import Coupon from '../models/Coupon';
import UserCoupon from '../models/UserCoupon';
import Store from '../models/Store';
import { Op } from 'sequelize';
import sequelize from '../config/database';

class CouponService {
  /**
   * 获取可用优惠券列表
   */
  async getAvailableCoupons(params: {
    page?: number;
    pageSize?: number;
    storeId?: number;
    type?: string;
  }) {
    const { page = 1, pageSize = 10, storeId, type } = params;
    const offset = (page - 1) * pageSize;

    const where: any = {
      status: 'active',
      [Op.or]: [
        { totalQuantity: 0 }, // 无限量
        { receivedQuantity: { [Op.lt]: sequelize.col('total_quantity') } }, // 还有库存
      ],
    };

    // 只在有效期内的优惠券
    const now = new Date();
    where[Op.or] = [
      { startTime: null, endTime: null },
      { startTime: { [Op.lte]: now }, endTime: { [Op.gte]: now } },
      { startTime: { [Op.lte]: now }, endTime: null },
      { startTime: null, endTime: { [Op.gte]: now } },
    ];

    if (storeId !== undefined) {
      where.storeId = storeId === 0 ? null : storeId; // 0 表示平台券
    }

    if (type) {
      where.type = type;
    }

    const { count, rows } = await Coupon.findAndCountAll({
      where,
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name'],
          required: false,
        },
      ],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      list: rows,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * 领取优惠券
   */
  async claimCoupon(userId: number, couponId: number) {
    const coupon = await Coupon.findByPk(couponId);

    if (!coupon) {
      throw new Error('优惠券不存在');
    }

    if (coupon.status !== 'active') {
      throw new Error('优惠券已失效');
    }

    // 检查是否还有库存
    if (coupon.totalQuantity > 0 && coupon.receivedQuantity >= coupon.totalQuantity) {
      throw new Error('优惠券已被领完');
    }

    // 检查有效期
    const now = new Date();
    if (coupon.startTime && coupon.startTime > now) {
      throw new Error('优惠券未到领取时间');
    }
    if (coupon.endTime && coupon.endTime < now) {
      throw new Error('优惠券已过期');
    }

    // 检查用户是否已经领取过
    const existingUserCoupon = await UserCoupon.findOne({
      where: {
        userId,
        couponId,
      },
    });

    if (existingUserCoupon) {
      throw new Error('您已经领取过该优惠券');
    }

    // 计算用户优惠券的有效期
    let validStart: Date | undefined;
    let validEnd: Date | undefined;

    if (coupon.validDays) {
      // 基于领取时间计算有效期
      validStart = now;
      validEnd = new Date(now.getTime() + coupon.validDays * 24 * 60 * 60 * 1000);
    } else if (coupon.startTime && coupon.endTime) {
      // 使用优惠券本身的有效期
      validStart = coupon.startTime;
      validEnd = coupon.endTime;
    }

    // 创建用户优惠券记录
    const userCoupon = await UserCoupon.create({
      userId,
      couponId,
      status: 'unused',
      receivedAt: now,
      validStart,
      validEnd,
    });

    // 更新优惠券的领取数量
    await coupon.increment('receivedQuantity');

    return userCoupon;
  }

  /**
   * 获取用户的优惠券列表
   */
  async getUserCoupons(userId: number, params: {
    page?: number;
    pageSize?: number;
    status?: 'unused' | 'used' | 'expired';
    storeId?: number;
  }) {
    const { page = 1, pageSize = 10, status, storeId } = params;
    const offset = (page - 1) * pageSize;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await UserCoupon.findAndCountAll({
      where,
      include: [
        {
          model: Coupon,
          as: 'coupon',
          where: storeId !== undefined ? { storeId: storeId === 0 ? null : storeId } : undefined,
          include: [
            {
              model: Store,
              as: 'store',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
      ],
      limit: pageSize,
      offset,
      order: [['receivedAt', 'DESC']],
    });

    return {
      list: rows,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * 获取可用于订单的优惠券
   */
  async getAvailableCouponsForOrder(userId: number, params: {
    storeId?: number;
    totalAmount: number;
  }) {
    const { storeId, totalAmount } = params;
    const now = new Date();

    const where: any = {
      userId,
      status: 'unused',
      [Op.or]: [
        { validEnd: { [Op.gte]: now } },
        { validEnd: null },
      ],
    };

    const userCoupons = await UserCoupon.findAll({
      where,
      include: [
        {
          model: Coupon,
          as: 'coupon',
          where: {
            status: 'active',
            conditionAmount: { [Op.lte]: totalAmount },
            [Op.or]: [
              { storeId: null }, // 平台券
              { storeId }, // 店铺券
            ],
          },
          include: [
            {
              model: Store,
              as: 'store',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
      ],
      order: [[{ model: Coupon, as: 'coupon' }, 'discountValue', 'DESC']],
    });

    return userCoupons;
  }

  /**
   * 使用优惠券
   */
  async useCoupon(userCouponId: number, orderId: number) {
    const userCoupon = await UserCoupon.findByPk(userCouponId, {
      include: [{ model: Coupon, as: 'coupon' }],
    });

    if (!userCoupon) {
      throw new Error('优惠券不存在');
    }

    if (userCoupon.status !== 'unused') {
      throw new Error('优惠券已使用或已过期');
    }

    const now = new Date();
    if (userCoupon.validEnd && userCoupon.validEnd < now) {
      await userCoupon.update({ status: 'expired' });
      throw new Error('优惠券已过期');
    }

    await userCoupon.update({
      status: 'used',
      orderId,
      usedAt: now,
    });

    // 更新优惠券使用数量
    const coupon = await Coupon.findByPk(userCoupon.couponId);
    if (coupon) {
      await coupon.increment('usedQuantity');
    }

    return userCoupon;
  }

  /**
   * 退还优惠券（订单退款时）
   */
  async refundCoupon(orderId: number) {
    const userCoupon = await UserCoupon.findOne({
      where: { orderId },
      include: [{ model: Coupon, as: 'coupon' }],
    });

    if (!userCoupon) {
      return null;
    }

    // 检查是否还在有效期内
    const now = new Date();
    const isExpired = userCoupon.validEnd && userCoupon.validEnd < now;

    await userCoupon.update({
      status: isExpired ? 'expired' : 'unused',
      orderId: undefined,
      usedAt: undefined,
    });

    // 更新优惠券使用数量
    const coupon = await Coupon.findByPk(userCoupon.couponId);
    if (coupon) {
      await coupon.decrement('usedQuantity');
    }

    return userCoupon;
  }

  /**
   * 计算优惠券折扣金额
   */
  calculateDiscount(coupon: Coupon, orderAmount: number): number {
    if (orderAmount < coupon.conditionAmount) {
      return 0;
    }

    let discount = 0;

    switch (coupon.type) {
      case 'full_reduction':
        // 满减券
        discount = coupon.discountValue;
        break;

      case 'discount':
        // 折扣券（如0.9表示9折）
        discount = orderAmount * (1 - coupon.discountValue);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
        break;

      case 'fixed':
        // 固定金额券
        discount = coupon.discountValue;
        break;
    }

    // 确保折扣不超过订单金额
    return Math.min(discount, orderAmount);
  }
}

export default new CouponService();
