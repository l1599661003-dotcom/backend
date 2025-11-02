import { Context } from 'koa';
import PostService from '../services/PostService';
import { AppError } from '../middlewares/errorHandler';

/**
 * 动态控制器
 */
class PostController {
  /**
   * POST /api/posts
   * 发布动态（需要认证）
   */
  async createPost(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { content, images, tags, relatedProductId, location, status } = ctx.request
      .body as any;

    // 调用服务层
    const post = await PostService.createPost(userId, {
      content,
      images,
      tags,
      relatedProductId,
      location,
      status,
    });

    ctx.success(post, '发布成功');
  }

  /**
   * GET /api/posts/feed
   * 获取关注的动态流（需要认证）
   */
  async getFollowingFeed(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await PostService.getFollowingFeed(userId, page, pageSize);

    ctx.success(result, '获取成功');
  }

  /**
   * GET /api/posts/community
   * 获取社区动态流（公开接口，可选认证）
   */
  async getCommunityFeed(ctx: Context) {
    const userId = ctx.state.user?.userId; // 可选

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await PostService.getCommunityFeed(page, pageSize, userId);

    ctx.success(result, '获取成功');
  }

  /**
   * GET /api/posts/:id
   * 获取动态详情（公开接口，可选认证）
   */
  async getPostDetail(ctx: Context) {
    const postId = parseInt(ctx.params.id);
    const userId = ctx.state.user?.userId; // 可选

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    // 调用服务层
    const post = await PostService.getPostDetail(postId, userId);

    ctx.success(post, '获取成功');
  }

  /**
   * POST /api/posts/:id/like
   * 点赞动态（需要认证）
   */
  async likePost(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const postId = parseInt(ctx.params.id);

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    // 调用服务层
    await PostService.likePost(postId, userId);

    ctx.success(null, '点赞成功');
  }

  /**
   * DELETE /api/posts/:id/like
   * 取消点赞（需要认证）
   */
  async unlikePost(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const postId = parseInt(ctx.params.id);

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    // 调用服务层
    await PostService.unlikePost(postId, userId);

    ctx.success(null, '取消点赞成功');
  }

  /**
   * POST /api/posts/:id/collect
   * 收藏动态（需要认证）
   */
  async collectPost(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const postId = parseInt(ctx.params.id);

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    // 调用服务层
    await PostService.collectPost(postId, userId);

    ctx.success(null, '收藏成功');
  }

  /**
   * DELETE /api/posts/:id/collect
   * 取消收藏（需要认证）
   */
  async uncollectPost(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const postId = parseInt(ctx.params.id);

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    // 调用服务层
    await PostService.uncollectPost(postId, userId);

    ctx.success(null, '取消收藏成功');
  }

  /**
   * POST /api/posts/:id/comments
   * 发表评论（需要认证）
   */
  async createComment(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const postId = parseInt(ctx.params.id);

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    const { content, parentCommentId } = ctx.request.body as any;

    if (!content || content.trim().length === 0) {
      throw new AppError('评论内容不能为空', 400);
    }

    // 调用服务层
    const comment = await PostService.createComment(postId, userId, content, parentCommentId);

    ctx.success(comment, '评论成功');
  }

  /**
   * GET /api/posts/:id/comments
   * 获取评论列表（公开接口）
   */
  async getComments(ctx: Context) {
    const postId = parseInt(ctx.params.id);

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await PostService.getComments(postId, page, pageSize);

    ctx.success(result, '获取成功');
  }

  /**
   * DELETE /api/posts/:id
   * 删除动态（需要认证）
   */
  async deletePost(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const postId = parseInt(ctx.params.id);

    if (!postId || postId <= 0) {
      throw new AppError('动态ID无效', 400);
    }

    // 调用服务层
    await PostService.deletePost(postId, userId);

    ctx.success(null, '删除成功');
  }

  /**
   * POST /api/comments/:id/like
   * 点赞评论（需要认证）
   */
  async likeComment(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const commentId = parseInt(ctx.params.id);

    if (!commentId || commentId <= 0) {
      throw new AppError('评论ID无效', 400);
    }

    // 调用服务层
    await PostService.likeComment(commentId, userId);

    ctx.success(null, '点赞成功');
  }

  /**
   * DELETE /api/comments/:id/like
   * 取消点赞评论（需要认证）
   */
  async unlikeComment(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const commentId = parseInt(ctx.params.id);

    if (!commentId || commentId <= 0) {
      throw new AppError('评论ID无效', 400);
    }

    // 调用服务层
    await PostService.unlikeComment(commentId, userId);

    ctx.success(null, '取消点赞成功');
  }

  /**
   * GET /api/posts/collects
   * 获取用户收藏的动态列表（需要认证）
   */
  async getUserCollects(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await PostService.getUserCollects(userId, page, pageSize);

    ctx.success(result, '获取成功');
  }

  /**
   * GET /api/users/:userId/posts
   * 获取用户的动态列表（公开接口，可选认证）
   */
  async getUserPosts(ctx: Context) {
    const targetUserId = parseInt(ctx.params.userId);
    const currentUserId = ctx.state.user?.userId; // 可选

    if (!targetUserId || targetUserId <= 0) {
      throw new AppError('用户ID无效', 400);
    }

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await PostService.getUserPosts(targetUserId, page, pageSize, currentUserId);

    ctx.success(result, '获取成功');
  }
}

export default new PostController();
