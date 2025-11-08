/**
 * 商家相关路由
 */

import Router from '@koa/router';
import MerchantController from '../controllers/MerchantController';
import { authenticate } from '../middlewares/auth';

const router = new Router();

// 公开路由
router.get('/stats', MerchantController.getMerchantStats); // 获取商家统计（剩余名额等）
router.get('/commission-policy', MerchantController.getCommissionPolicy); // 获取佣金政策

// 需要认证的路由
router.post('/apply', authenticate, MerchantController.applyForMerchant); // 提交商家申请
router.get('/my-info', authenticate, MerchantController.getMyMerchantInfo); // 获取我的商家信息
router.get('/my-applications', authenticate, MerchantController.getMyApplications); // 获取我的申请记录

// 管理员路由（后续可以添加管理员权限中间件）
router.get('/applications/pending', authenticate, MerchantController.getPendingApplications); // 获取待审核申请
router.post('/applications/:applicationId/review', authenticate, MerchantController.reviewApplication); // 审核申请

export default router;
