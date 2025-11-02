import { Context } from 'koa';
import FollowService from '../services/FollowService';
import { AppError } from '../middlewares/errorHandler';

/**
 * 关注控制器
 */
class FollowController {
  /**
   * POST /api/follows
   * 关注店铺或用户（需要认证）
   */
  async follow(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { followingType, followingId } = ctx.request.body as any;

    // 验证参数
    if (!followingType || !followingId) {
      throw new AppError('缺少必要参数', 400);
    }

    if (!['user', 'store'].includes(followingType)) {
      throw new AppError('关注类型只能是 user 或 store', 400);
    }

    if (!Number.isInteger(Number(followingId)) || Number(followingId) <= 0) {
      throw new AppError('followingId 必须是正整数', 400);
    }

    // 调用服务层
    const follow = await FollowService.follow(userId, followingType, Number(followingId));

    ctx.success(
      {
        id: follow.id,
        followingType: follow.followingType,
        followingId: follow.followingId,
        createdAt: follow.createdAt,
      },
      '关注成功'
    );
  }

  /**
   * DELETE /api/follows
   * 取消关注（需要认证）
   */
  async unfollow(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { followingType, followingId } = ctx.request.body as any;

    // 验证参数
    if (!followingType || !followingId) {
      throw new AppError('缺少必要参数', 400);
    }

    if (!['user', 'store'].includes(followingType)) {
      throw new AppError('关注类型只能是 user 或 store', 400);
    }

    if (!Number.isInteger(Number(followingId)) || Number(followingId) <= 0) {
      throw new AppError('followingId 必须是正整数', 400);
    }

    // 调用服务层
    await FollowService.unfollow(userId, followingType, Number(followingId));

    ctx.success(null, '取消关注成功');
  }

  /**
   * GET /api/follows/stores
   * 获取用户关注的店铺列表（需要认证）
   */
  async getFollowingStores(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await FollowService.getFollowingStores(userId, page, pageSize);

    ctx.success(result, '获取成功');
  }

  /**
   * GET /api/follows/users
   * 获取用户关注的用户列表（需要认证）
   */
  async getFollowingUsers(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await FollowService.getFollowingUsers(userId, page, pageSize);

    ctx.success(result, '获取成功');
  }

  /**
   * GET /api/followers
   * 获取粉丝列表（需要认证）
   */
  async getFollowers(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await FollowService.getFollowers(userId, page, pageSize);

    ctx.success(result, '获取成功');
  }

  /**
   * GET /api/follows/check
   * 检查是否关注（需要认证）
   */
  async checkIsFollowing(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { followingType, followingId } = ctx.query;

    // 验证参数
    if (!followingType || !followingId) {
      throw new AppError('缺少必要参数', 400);
    }

    if (!['user', 'store'].includes(followingType as string)) {
      throw new AppError('关注类型只能是 user 或 store', 400);
    }

    // 调用服务层
    const isFollowing = await FollowService.checkIsFollowing(
      userId,
      followingType as 'user' | 'store',
      Number(followingId)
    );

    ctx.success({ isFollowing }, '查询成功');
  }

  /**
   * GET /api/users/:userId/stats
   * 获取用户统计数据（公开接口，可选认证）
   */
  async getUserStats(ctx: Context) {
    const targetUserId = parseInt(ctx.params.userId);

    if (!targetUserId || targetUserId <= 0) {
      throw new AppError('用户ID无效', 400);
    }

    // 调用服务层
    const stats = await FollowService.getUserStats(targetUserId);

    ctx.success(stats, '获取成功');
  }
}

export default new FollowController();
