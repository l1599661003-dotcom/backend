import { Context } from 'koa';
import ProductService from '../services/ProductService';

/**
 * 商品控制器
 */
class ProductController {
  /**
   * GET /api/stores/:storeId/products
   * 获取店铺商品列表
   */
  async getStoreProducts(ctx: Context) {
    const storeId = parseInt(ctx.params.storeId, 10);
    const { categoryId, q, sort, page, pageSize } = ctx.query;

    if (!storeId || isNaN(storeId)) {
      ctx.fail('无效的店铺ID', 400);
      return;
    }

    const result = await ProductService.getStoreProducts(
      storeId,
      categoryId ? parseInt(categoryId as string, 10) : undefined,
      q as string,
      sort as string,
      page ? parseInt(page as string, 10) : 1,
      pageSize ? parseInt(pageSize as string, 10) : 20
    );

    ctx.success(result, '获取商品列表成功');
  }

  /**
   * GET /api/products/:id
   * 获取商品详情
   */
  async getProductDetail(ctx: Context) {
    const productId = parseInt(ctx.params.id, 10);

    if (!productId || isNaN(productId)) {
      ctx.fail('无效的商品ID', 400);
      return;
    }

    const result = await ProductService.getProductDetail(productId);

    ctx.success(result, '获取商品详情成功');
  }

  /**
   * GET /api/products/search
   * 搜索商品
   */
  async searchProducts(ctx: Context) {
    const { q, page, pageSize } = ctx.query;

    if (!q || typeof q !== 'string') {
      ctx.fail('请提供搜索关键词', 400);
      return;
    }

    const result = await ProductService.searchProducts(
      q,
      page ? parseInt(page as string, 10) : 1,
      pageSize ? parseInt(pageSize as string, 10) : 20
    );

    ctx.success(result, '搜索成功');
  }

  /**
   * GET /api/products/hot
   * 获取热门商品（限时活动）
   */
  async getHotProducts(ctx: Context) {
    const { limit } = ctx.query;

    const result = await ProductService.getHotProducts(
      limit ? parseInt(limit as string, 10) : 10
    );

    ctx.success(result, '获取热门商品成功');
  }

  /**
   * GET /api/products/recommended
   * 获取推荐商品
   */
  async getRecommendedProducts(ctx: Context) {
    const { limit } = ctx.query;

    const result = await ProductService.getRecommendedProducts(
      limit ? parseInt(limit as string, 10) : 10
    );

    ctx.success(result, '获取推荐商品成功');
  }
}

export default new ProductController();
