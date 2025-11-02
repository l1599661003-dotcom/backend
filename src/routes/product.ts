import Router from '@koa/router';
import ProductController from '../controllers/ProductController';
import { optionalAuth } from '../middlewares/auth';

const router = new Router({
  prefix: '/api',
});

/**
 * 商品相关路由
 */

// 获取热门商品（限时活动）
router.get('/products/hot', optionalAuth, ProductController.getHotProducts);

// 获取推荐商品
router.get('/products/recommended', optionalAuth, ProductController.getRecommendedProducts);

// 搜索商品
router.get('/products/search', optionalAuth, ProductController.searchProducts);

// 获取商品详情
router.get('/products/:id', optionalAuth, ProductController.getProductDetail);

// 获取店铺商品列表
router.get('/stores/:storeId/products', optionalAuth, ProductController.getStoreProducts);

export default router;
