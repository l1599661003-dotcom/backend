import { Context } from 'koa';
import UserService from '../services/UserService';
import { AppError } from '../middlewares/errorHandler';

/**
 * 用户控制器
 */
class UserController {
  /**
   * POST /api/auth/wx_login
   * 微信登录
   */
  async wxLogin(ctx: Context) {
    const { code, userInfo } = ctx.request.body as any;

    // 验证参数
    if (!code) {
      throw new AppError('缺少登录code', 400);
    }

    // 调用服务层
    const result = await UserService.wxLogin(code, userInfo);

    ctx.success(result, '登录成功');
  }

  /**
   * GET /api/auth/user
   * 获取当前用户信息（需要认证）
   */
  async getCurrentUser(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const user = await UserService.getUserById(userId);

    ctx.success(user, '获取用户信息成功');
  }

  /**
   * PUT /api/auth/user
   * 更新用户信息（需要认证）
   */
  async updateUser(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { nickname, avatar, phone } = ctx.request.body as any;

    const user = await UserService.updateUser(userId, { nickname, avatar, phone });

    ctx.success(user, '更新成功');
  }

  /**
   * POST /api/auth/bind-phone
   * 绑定手机号（需要认证）
   */
  async bindPhone(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { phone } = ctx.request.body as any;

    if (!phone) {
      throw new AppError('请提供手机号', 400);
    }

    // 简单的手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new AppError('手机号格式不正确', 400);
    }

    const result = await UserService.bindPhone(userId, phone);

    ctx.success(result, '绑定成功');
  }

  /**
   * GET /api/auth/points
   * 获取用户积分（需要认证）
   */
  async getUserPoints(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const result = await UserService.getUserPoints(userId);

    ctx.success(result, '获取积分成功');
  }

  /**
   * GET /api/auth/profile
   * 获取用户中心数据（需要认证）
   */
  async getUserProfile(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const result = await UserService.getUserProfile(userId);

    ctx.success(result, '获取用户中心数据成功');
  }

  /**
   * POST /api/auth/delete-account
   * 注销账号（需要认证）
   */
  async deleteAccount(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { reason } = ctx.request.body as any;

    await UserService.deleteAccount(userId, reason);

    ctx.success(null, '账号注销成功');
  }
}

export default new UserController();
