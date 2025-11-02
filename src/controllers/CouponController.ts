import { Context } from 'koa';
import CouponService from '../services/CouponService';

class CouponController {
  /**
   * 获取可用优惠券列表
   * GET /api/coupons
   */
  async getAvailableCoupons(ctx: Context) {
    try {
      const { page, pageSize, storeId, type } = ctx.query;

      const result = await CouponService.getAvailableCoupons({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        storeId: storeId ? parseInt(storeId as string) : undefined,
        type: type as string,
      });

      ctx.body = {
        code: 200,
        message: 'success',
        data: result,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '获取优惠券列表失败',
      };
    }
  }

  /**
   * 领取优惠券
   * POST /api/user/coupons/:couponId/claim
   */
  async claimCoupon(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { couponId } = ctx.params;

      const userCoupon = await CouponService.claimCoupon(
        userId,
        parseInt(couponId)
      );

      ctx.body = {
        code: 200,
        message: '领取成功',
        data: userCoupon,
      };
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: error.message || '领取失败',
      };
    }
  }

  /**
   * 获取用户的优惠券列表
   * GET /api/user/coupons
   */
  async getUserCoupons(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { page, pageSize, status, storeId } = ctx.query;

      const result = await CouponService.getUserCoupons(userId, {
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        status: status as 'unused' | 'used' | 'expired',
        storeId: storeId ? parseInt(storeId as string) : undefined,
      });

      ctx.body = {
        code: 200,
        message: 'success',
        data: result,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '获取优惠券列表失败',
      };
    }
  }

  /**
   * 获取可用于订单的优惠券
   * GET /api/user/coupons/available-for-order
   */
  async getAvailableCouponsForOrder(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { storeId, totalAmount } = ctx.query;

      if (!totalAmount) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: '缺少订单金额参数',
        };
        return;
      }

      const coupons = await CouponService.getAvailableCouponsForOrder(userId, {
        storeId: storeId ? parseInt(storeId as string) : undefined,
        totalAmount: parseFloat(totalAmount as string),
      });

      ctx.body = {
        code: 200,
        message: 'success',
        data: coupons,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '获取可用优惠券失败',
      };
    }
  }
}

export default new CouponController();
