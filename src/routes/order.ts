import Router from '@koa/router';
import OrderController from '../controllers/OrderController';
import { authenticate } from '../middlewares/auth';

const router = new Router({
  prefix: '/api/orders',
});

/**
 * 订单相关路由
 * 所有路由都需要认证
 */

// 创建订单
router.post('/', authenticate, OrderController.createOrder);

// 获取订单列表
router.get('/', authenticate, OrderController.getOrders);

// 获取订单详情
router.get('/:id', authenticate, OrderController.getOrderDetail);

// 支付订单
router.post('/:id/pay', authenticate, OrderController.payOrder);

// 取消订单
router.post('/:id/cancel', authenticate, OrderController.cancelOrder);

export default router;
