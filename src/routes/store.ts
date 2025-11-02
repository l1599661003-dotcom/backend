import Router from '@koa/router';
import StoreController from '../controllers/StoreController';
import { optionalAuth } from '../middlewares/auth';

const router = new Router({
  prefix: '/api/stores',
});

/**
 * 店铺相关路由
 */

// 获取店铺列表（可选认证）
router.get('/', optionalAuth, StoreController.getStores);

// 搜索店铺
router.get('/search', optionalAuth, StoreController.searchStores);

// 获取店铺详情（必须在动态路由前面）
router.get('/:id', optionalAuth, StoreController.getStoreDetail);

export default router;
