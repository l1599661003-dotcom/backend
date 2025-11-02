import { Context } from 'koa';
import BannerService from '../services/BannerService';

/**
 * 轮播活动控制器
 */
class BannerController {
  /**
   * GET /api/banners
   * 获取有效的轮播列表（公开接口）
   */
  async getActiveBanners(ctx: Context) {
    // 调用服务层
    const banners = await BannerService.getActiveBanners();

    ctx.success(banners, '获取成功');
  }

  /**
   * GET /api/banners/:id
   * 获取轮播详情（公开接口）
   */
  async getBannerDetail(ctx: Context) {
    const bannerId = parseInt(ctx.params.id);

    if (!bannerId || bannerId <= 0) {
      ctx.error('轮播ID无效', 400);
      return;
    }

    // 调用服务层
    const banner = await BannerService.getBannerDetail(bannerId);

    ctx.success(banner, '获取成功');
  }

  // 以下是管理员功能，暂时不实现认证逻辑

  /**
   * POST /api/admin/banners
   * 创建轮播（管理员功能，暂未实现认证）
   */
  async createBanner(ctx: Context) {
    const data = ctx.request.body as any;

    // 调用服务层
    const banner = await BannerService.createBanner(data);

    ctx.success(banner, '创建成功');
  }

  /**
   * PUT /api/admin/banners/:id
   * 更新轮播（管理员功能，暂未实现认证）
   */
  async updateBanner(ctx: Context) {
    const bannerId = parseInt(ctx.params.id);

    if (!bannerId || bannerId <= 0) {
      ctx.error('轮播ID无效', 400);
      return;
    }

    const data = ctx.request.body as any;

    // 调用服务层
    const banner = await BannerService.updateBanner(bannerId, data);

    ctx.success(banner, '更新成功');
  }

  /**
   * DELETE /api/admin/banners/:id
   * 删除轮播（管理员功能，暂未实现认证）
   */
  async deleteBanner(ctx: Context) {
    const bannerId = parseInt(ctx.params.id);

    if (!bannerId || bannerId <= 0) {
      ctx.error('轮播ID无效', 400);
      return;
    }

    // 调用服务层
    await BannerService.deleteBanner(bannerId);

    ctx.success(null, '删除成功');
  }

  /**
   * GET /api/admin/banners
   * 获取所有轮播（管理员功能，暂未实现认证）
   */
  async getAllBanners(ctx: Context) {
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await BannerService.getAllBanners(page, pageSize);

    ctx.success(result, '获取成功');
  }
}

export default new BannerController();
