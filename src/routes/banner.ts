import Router from '@koa/router';
import BannerController from '../controllers/BannerController';

const router = new Router({
  prefix: '/api',
});

/**
 * 轮播活动相关路由
 */

// 获取有效的轮播列表（公开接口）
router.get('/banners', BannerController.getActiveBanners);

// 获取轮播详情（公开接口）
router.get('/banners/:id', BannerController.getBannerDetail);

// ========== 管理员功能（暂未实现认证） ==========

// 创建轮播（管理员功能）
router.post('/admin/banners', BannerController.createBanner);

// 更新轮播（管理员功能）
router.put('/admin/banners/:id', BannerController.updateBanner);

// 删除轮播（管理员功能）
router.delete('/admin/banners/:id', BannerController.deleteBanner);

// 获取所有轮播（管理员功能）
router.get('/admin/banners', BannerController.getAllBanners);

export default router;
