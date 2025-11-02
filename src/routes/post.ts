import Router from '@koa/router';
import PostController from '../controllers/PostController';
import { authenticate, optionalAuth } from '../middlewares/auth';

const router = new Router({
  prefix: '/api',
});

/**
 * 动态相关路由
 */

// 发布动态（需要认证）
router.post('/posts', authenticate, PostController.createPost);

// 获取关注的动态流（需要认证）
router.get('/posts/feed', authenticate, PostController.getFollowingFeed);

// 获取社区动态流（公开接口，可选认证）
router.get('/posts/community', optionalAuth, PostController.getCommunityFeed);

// 获取动态详情（公开接口，可选认证）
router.get('/posts/:id', optionalAuth, PostController.getPostDetail);

// 点赞动态（需要认证）
router.post('/posts/:id/like', authenticate, PostController.likePost);

// 取消点赞（需要认证）
router.delete('/posts/:id/like', authenticate, PostController.unlikePost);

// 收藏动态（需要认证）
router.post('/posts/:id/collect', authenticate, PostController.collectPost);

// 取消收藏（需要认证）
router.delete('/posts/:id/collect', authenticate, PostController.uncollectPost);

// 发表评论（需要认证）
router.post('/posts/:id/comments', authenticate, PostController.createComment);

// 获取评论列表（公开接口）
router.get('/posts/:id/comments', PostController.getComments);

// 点赞评论（需要认证）
router.post('/comments/:id/like', authenticate, PostController.likeComment);

// 取消点赞评论（需要认证）
router.delete('/comments/:id/like', authenticate, PostController.unlikeComment);

// 获取用户收藏的动态列表（需要认证）
router.get('/posts/collects', authenticate, PostController.getUserCollects);

// 删除动态（需要认证）
router.delete('/posts/:id', authenticate, PostController.deletePost);

// 获取用户的动态列表（公开接口，可选认证）
router.get('/users/:userId/posts', optionalAuth, PostController.getUserPosts);

export default router;
