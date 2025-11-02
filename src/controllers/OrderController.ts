import { Context } from 'koa';
import OrderService from '../services/OrderService';
import { AppError } from '../middlewares/errorHandler';
import { OrderStatus } from '../models/Order';

/**
 * 订单控制器
 */
class OrderController {
  /**
   * POST /api/orders
   * 创建订单
   */
  async createOrder(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const {
      storeId,
      items,
      deliverType,
      receiverName,
      receiverPhone,
      receiverAddress,
      remark,
      pointsUsed,
    } = ctx.request.body as any;

    // 验证必填字段
    if (!storeId || !items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('缺少必要参数', 400);
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      throw new AppError('请填写收货信息', 400);
    }

    const result = await OrderService.createOrder(userId, {
      storeId: parseInt(storeId, 10),
      items: items.map((item: any) => ({
        productId: parseInt(item.productId, 10),
        skuId: item.skuId,
        qty: parseInt(item.qty, 10),
      })),
      deliverType,
      receiverName,
      receiverPhone,
      receiverAddress,
      remark,
      pointsUsed: pointsUsed ? parseInt(pointsUsed, 10) : 0,
    });

    ctx.success(result, '订单创建成功');
  }

  /**
   * GET /api/orders
   * 获取订单列表
   */
  async getOrders(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { status, page, pageSize } = ctx.query;

    const result = await OrderService.getOrders(
      userId,
      status as OrderStatus,
      page ? parseInt(page as string, 10) : 1,
      pageSize ? parseInt(pageSize as string, 10) : 20
    );

    ctx.success(result, '获取订单列表成功');
  }

  /**
   * GET /api/orders/:id
   * 获取订单详情
   */
  async getOrderDetail(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const orderId = parseInt(ctx.params.id, 10);

    if (!orderId || isNaN(orderId)) {
      throw new AppError('无效的订单ID', 400);
    }

    const result = await OrderService.getOrderDetail(orderId, userId);

    ctx.success(result, '获取订单详情成功');
  }

  /**
   * POST /api/orders/:id/cancel
   * 取消订单
   */
  async cancelOrder(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const orderId = parseInt(ctx.params.id, 10);

    if (!orderId || isNaN(orderId)) {
      throw new AppError('无效的订单ID', 400);
    }

    const result = await OrderService.cancelOrder(orderId, userId);

    ctx.success(result, '订单已取消');
  }

  /**
   * POST /api/orders/:id/pay
   * 支付订单
   */
  async payOrder(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const orderId = parseInt(ctx.params.id, 10);

    if (!orderId || isNaN(orderId)) {
      throw new AppError('无效的订单ID', 400);
    }

    const result = await OrderService.payOrder(orderId, userId);

    ctx.success(result, '支付成功');
  }
}

export default new OrderController();
