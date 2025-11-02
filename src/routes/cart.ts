import Router from '@koa/router';
import CartController from '../controllers/CartController';
import { authenticate } from '../middlewares/auth';

const router = new Router({
  prefix: '/api/cart',
});

/**
 * 购物车相关路由
 * 所有路由都需要认证
 */

// 获取购物车
router.get('/', authenticate, CartController.getCart);

// 添加商品到购物车
router.post('/', authenticate, CartController.addToCart);

// 全选/全不选
router.put('/select-all', authenticate, CartController.toggleSelectAll);

// 清空购物车
router.delete('/', authenticate, CartController.clearCart);

// 切换商品选中状态
router.put('/:productId/select', authenticate, CartController.toggleSelect);

// 更新购物车商品数量
router.put('/:productId', authenticate, CartController.updateCartItem);

// 删除购物车商品
router.delete('/:productId', authenticate, CartController.removeFromCart);

export default router;
