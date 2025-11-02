import { Context } from 'koa';
import CartService from '../services/CartService';
import { AppError } from '../middlewares/errorHandler';

/**
 * 购物车控制器
 */
class CartController {
  /**
   * GET /api/cart
   * 获取购物车
   */
  async getCart(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const result = await CartService.getCart(userId);

    ctx.success(result, '获取购物车成功');
  }

  /**
   * POST /api/cart
   * 添加商品到购物车
   */
  async addToCart(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { productId, qty, skuId } = ctx.request.body as any;

    if (!productId) {
      throw new AppError('缺少商品ID', 400);
    }

    const result = await CartService.addToCart(
      userId,
      parseInt(productId, 10),
      qty ? parseInt(qty, 10) : 1,
      skuId
    );

    ctx.success(result, '添加成功');
  }

  /**
   * PUT /api/cart/:productId
   * 更新购物车商品数量
   */
  async updateCartItem(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const productId = parseInt(ctx.params.productId, 10);
    const { qty, skuId } = ctx.request.body as any;

    if (!qty) {
      throw new AppError('缺少数量参数', 400);
    }

    const result = await CartService.updateCartItem(
      userId,
      productId,
      parseInt(qty, 10),
      skuId
    );

    ctx.success(result, '更新成功');
  }

  /**
   * DELETE /api/cart/:productId
   * 删除购物车商品
   */
  async removeFromCart(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const productId = parseInt(ctx.params.productId, 10);
    const { skuId } = ctx.query;

    const result = await CartService.removeFromCart(userId, productId, skuId as string);

    ctx.success(result, '删除成功');
  }

  /**
   * PUT /api/cart/:productId/select
   * 切换商品选中状态
   */
  async toggleSelect(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const productId = parseInt(ctx.params.productId, 10);
    const { selected, skuId } = ctx.request.body as any;

    if (typeof selected !== 'boolean') {
      throw new AppError('缺少选中状态参数', 400);
    }

    const result = await CartService.toggleSelect(userId, productId, selected, skuId);

    ctx.success(result, '操作成功');
  }

  /**
   * PUT /api/cart/select-all
   * 全选/全不选
   */
  async toggleSelectAll(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { selected } = ctx.request.body as any;

    if (typeof selected !== 'boolean') {
      throw new AppError('缺少选中状态参数', 400);
    }

    const result = await CartService.toggleSelectAll(userId, selected);

    ctx.success(result, '操作成功');
  }

  /**
   * DELETE /api/cart
   * 清空购物车
   */
  async clearCart(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const result = await CartService.clearCart(userId);

    ctx.success(result, '清空成功');
  }
}

export default new CartController();
