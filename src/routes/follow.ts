import Router from '@koa/router';
import FollowController from '../controllers/FollowController';
import { authenticate } from '../middlewares/auth';

const router = new Router({
  prefix: '/api',
});

/**
 * 关注相关路由
 */

// 关注店铺或用户（需要认证）
router.post('/follows', authenticate, FollowController.follow);

// 取消关注（需要认证）
router.delete('/follows', authenticate, FollowController.unfollow);

// 获取关注的店铺列表（需要认证）
router.get('/follows/stores', authenticate, FollowController.getFollowingStores);

// 获取关注的用户列表（需要认证）
router.get('/follows/users', authenticate, FollowController.getFollowingUsers);

// 检查是否关注（需要认证）
router.get('/follows/check', authenticate, FollowController.checkIsFollowing);

// 获取粉丝列表（需要认证）
router.get('/followers', authenticate, FollowController.getFollowers);

// 获取用户统计数据（公开接口）
router.get('/users/:userId/stats', FollowController.getUserStats);

export default router;
