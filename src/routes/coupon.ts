import Router from '@koa/router';
import CouponController from '../controllers/CouponController';
import { authenticate } from '../middlewares/auth';

const router = new Router({
  prefix: '/api',
});

// 公开接口 - 获取可用优惠券列表
router.get('/coupons', CouponController.getAvailableCoupons);

// 需要认证的接口
router.post('/user/coupons/:couponId/claim', authenticate, CouponController.claimCoupon);
router.get('/user/coupons', authenticate, CouponController.getUserCoupons);
router.get('/user/coupons/available-for-order', authenticate, CouponController.getAvailableCouponsForOrder);

export default router;
