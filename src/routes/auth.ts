import Router from '@koa/router';
import UserController from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';

const router = new Router({
  prefix: '/api/auth',
});

/**
 * 认证相关路由
 */

// 微信登录（无需认证）
router.post('/wx_login', UserController.wxLogin);

// 获取当前用户信息（需要认证）
router.get('/user', authenticate, UserController.getCurrentUser);

// 更新用户信息（需要认证）
router.put('/user', authenticate, UserController.updateUser);

// 绑定手机号（需要认证）
router.post('/bind-phone', authenticate, UserController.bindPhone);

// 获取用户积分（需要认证）
router.get('/points', authenticate, UserController.getUserPoints);

// 获取用户中心数据（需要认证）
router.get('/profile', authenticate, UserController.getUserProfile);

// 注销账号（需要认证）
router.post('/delete-account', authenticate, UserController.deleteAccount);

export default router;
