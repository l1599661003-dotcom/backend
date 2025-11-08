import Router from '@koa/router';
import authRouter from './auth';
import storeRouter from './store';
import productRouter from './product';
import cartRouter from './cart';
import orderRouter from './order';
import followRouter from './follow';
import postRouter from './post';
import messageRouter from './message';
import bannerRouter from './banner';
import couponRouter from './coupon';
import addressRouter from './address';
import merchantRouter from './merchant';

/**
 * 路由索引文件
 * 汇总所有路由模块
 */

const router = new Router();

// 注册各模块路由
router.use(authRouter.routes());
router.use(authRouter.allowedMethods());

router.use(storeRouter.routes());
router.use(storeRouter.allowedMethods());

router.use(productRouter.routes());
router.use(productRouter.allowedMethods());

router.use(cartRouter.routes());
router.use(cartRouter.allowedMethods());

router.use(orderRouter.routes());
router.use(orderRouter.allowedMethods());

router.use(followRouter.routes());
router.use(followRouter.allowedMethods());

router.use(postRouter.routes());
router.use(postRouter.allowedMethods());

router.use(messageRouter.routes());
router.use(messageRouter.allowedMethods());

router.use(bannerRouter.routes());
router.use(bannerRouter.allowedMethods());

router.use(couponRouter.routes());
router.use(couponRouter.allowedMethods());

router.use(addressRouter.routes());
router.use(addressRouter.allowedMethods());

router.use('/api/merchant', merchantRouter.routes());
router.use(merchantRouter.allowedMethods());

export default router;
