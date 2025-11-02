import { Context } from 'koa';
import StoreService from '../services/StoreService';

/**
 * 店铺控制器
 */
class StoreController {
  /**
   * GET /api/stores
   * 获取店铺列表
   */
  async getStores(ctx: Context) {
    const { lat, lng, sort, page, pageSize } = ctx.query;

    const result = await StoreService.getNearbyStores(
      lat ? parseFloat(lat as string) : undefined,
      lng ? parseFloat(lng as string) : undefined,
      sort as string,
      page ? parseInt(page as string, 10) : 1,
      pageSize ? parseInt(pageSize as string, 10) : 20
    );

    ctx.success(result, '获取店铺列表成功');
  }

  /**
   * GET /api/stores/:id
   * 获取店铺详情
   */
  async getStoreDetail(ctx: Context) {
    const storeId = parseInt(ctx.params.id, 10);

    if (!storeId || isNaN(storeId)) {
      ctx.fail('无效的店铺ID', 400);
      return;
    }

    const result = await StoreService.getStoreDetail(storeId);

    ctx.success(result, '获取店铺详情成功');
  }

  /**
   * GET /api/stores/search
   * 搜索店铺
   */
  async searchStores(ctx: Context) {
    const { q, page, pageSize } = ctx.query;

    if (!q || typeof q !== 'string') {
      ctx.fail('请提供搜索关键词', 400);
      return;
    }

    const result = await StoreService.searchStores(
      q,
      page ? parseInt(page as string, 10) : 1,
      pageSize ? parseInt(pageSize as string, 10) : 20
    );

    ctx.success(result, '搜索成功');
  }
}

export default new StoreController();
