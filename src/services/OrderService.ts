import { Order, OrderItem, User, Store, Product } from '../models';
import { OrderStatus } from '../models/Order';
import { AppError } from '../middlewares/errorHandler';
import ProductService from './ProductService';
import sequelize from '../config/database';

/**
 * 订单服务类
 */
class OrderService {
  /**
   * 创建订单
   */
  async createOrder(
    userId: number,
    data: {
      storeId: number;
      items: Array<{
        productId: number;
        skuId?: string;
        qty: number;
      }>;
      deliverType: string;
      receiverName: string;
      receiverPhone: string;
      receiverAddress: string;
      remark?: string;
      pointsUsed?: number;
    }
  ) {
    const transaction = await sequelize.transaction();

    try {
      // 1. 验证用户
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('用户不存在', 404);
      }

      // 2. 验证店铺
      const store = await Store.findByPk(data.storeId);
      if (!store) {
        throw new AppError('店铺不存在', 404);
      }

      // 3. 计算订单金额
      let totalAmount = 0;
      const orderItems: any[] = [];

      for (const item of data.items) {
        const product = await Product.findByPk(item.productId);

        if (!product) {
          throw new AppError(`商品ID ${item.productId} 不存在`, 404);
        }

        // 检查库存
        const hasStock = await ProductService.checkStock(item.productId, item.qty);
        if (!hasStock) {
          throw new AppError(`商品 "${product.title}" 库存不足`, 400);
        }

        const itemPrice = Number(product.price);
        const itemTotal = itemPrice * item.qty;
        totalAmount += itemTotal;

        orderItems.push({
          productId: item.productId,
          skuId: item.skuId,
          productTitle: product.title,
          productImage: product.mainImage,
          skuName: item.skuId,
          qty: item.qty,
          price: itemPrice,
          totalPrice: itemTotal,
        });
      }

      // 4. 计算积分抵扣
      const pointsUsed = data.pointsUsed || 0;
      if (pointsUsed > 0) {
        // 检查用户积分是否足够
        if (user.totalPoints < pointsUsed) {
          throw new AppError('积分不足', 400);
        }

        // 积分抵扣上限为订单总额的20%
        const maxPointsDiscount = totalAmount * 0.2;
        if (pointsUsed > maxPointsDiscount) {
          throw new AppError(`最多可使用${Math.floor(maxPointsDiscount)}积分`, 400);
        }
      }

      const payAmount = totalAmount - pointsUsed;

      // 5. 生成订单号
      const orderNo = this.generateOrderNo();

      // 6. 创建订单
      const order = await Order.create(
        {
          orderNo,
          userId,
          storeId: data.storeId,
          totalAmount,
          payAmount,
          pointsUsed,
          status: OrderStatus.PENDING,
          deliverType: data.deliverType,
          receiverName: data.receiverName,
          receiverPhone: data.receiverPhone,
          receiverAddress: data.receiverAddress,
          remark: data.remark,
        },
        { transaction }
      );

      // 7. 创建订单商品
      for (const item of orderItems) {
        await OrderItem.create(
          {
            orderId: order.id,
            ...item,
          },
          { transaction }
        );

        // 减少库存
        await ProductService.decreaseStock(item.productId, item.qty);
      }

      // 8. 扣除积分
      if (pointsUsed > 0) {
        await user.update(
          {
            totalPoints: user.totalPoints - pointsUsed,
          },
          { transaction }
        );
      }

      // 9. 清空购物车中已购买的商品（如果是从购物车下单）
      // 这里简化处理，实际应该只清除已购买的商品
      // await CartService.clearCart(userId);

      await transaction.commit();

      return {
        orderId: order.id,
        orderNo: order.orderNo,
        payAmount: Number(order.payAmount),
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取订单列表
   */
  async getOrders(userId: number, status?: OrderStatus, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'logoUrl'],
        },
        {
          model: OrderItem,
          as: 'items',
        },
      ],
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      list: rows.map((order) => this.formatOrder(order)),
    };
  }

  /**
   * 获取订单详情
   */
  async getOrderDetail(orderId: number, userId: number) {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'logoUrl', 'phone', 'address'],
        },
        {
          model: OrderItem,
          as: 'items',
        },
      ],
    });

    if (!order) {
      throw new AppError('订单不存在', 404);
    }

    return this.formatOrder(order);
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId: number, userId: number) {
    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new AppError('订单不存在', 404);
    }

    // 只有待支付状态的订单才能取消
    if (order.status !== OrderStatus.PENDING) {
      throw new AppError('该订单不能取消', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      // 1. 更新订单状态
      await order.update({ status: OrderStatus.CANCELLED }, { transaction });

      // 2. 恢复库存
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
      });

      for (const item of orderItems) {
        await ProductService.increaseStock(item.productId, item.qty);
      }

      // 3. 退还积分
      if (order.pointsUsed > 0) {
        const user = await User.findByPk(userId);
        if (user) {
          await user.update(
            {
              totalPoints: user.totalPoints + order.pointsUsed,
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      return this.formatOrder(order);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 支付订单（预留接口，后续集成微信支付）
   */
  async payOrder(orderId: number, userId: number) {
    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new AppError('订单不存在', 404);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError('订单状态不正确', 400);
    }

    // TODO: 集成微信支付
    // 这里先模拟支付成功
    await order.update({
      status: OrderStatus.PAID,
      paidAt: new Date(),
    });

    return {
      orderId: order.id,
      orderNo: order.orderNo,
      status: order.status,
    };
  }

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp}${random}`;
  }

  /**
   * 格式化订单数据
   */
  private formatOrder(order: any) {
    return {
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      payAmount: Number(order.payAmount),
      pointsUsed: order.pointsUsed,
      deliverType: order.deliverType,
      deliverTimeExpected: order.deliverTimeExpected,
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      receiverAddress: order.receiverAddress,
      remark: order.remark,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      store: order.store
        ? {
            id: order.store.id,
            name: order.store.name,
            logoUrl: order.store.logoUrl,
            phone: order.store.phone,
            address: order.store.address,
          }
        : null,
      items: order.items
        ? order.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            skuId: item.skuId,
            productTitle: item.productTitle,
            productImage: item.productImage,
            skuName: item.skuName,
            qty: item.qty,
            price: Number(item.price),
            totalPrice: Number(item.totalPrice),
          }))
        : [],
    };
  }
}

export default new OrderService();
