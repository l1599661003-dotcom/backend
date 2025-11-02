import { Context } from 'koa';
import MessageService from '../services/MessageService';
import { AppError } from '../middlewares/errorHandler';

/**
 * 消息控制器
 */
class MessageController {
  /**
   * GET /api/messages
   * 获取消息列表（需要认证）
   */
  async getMessages(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const type = ctx.query.type as 'system' | 'order' | 'interaction' | 'customer_service' | undefined;
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    // 调用服务层
    const result = await MessageService.getMessages(userId, type, page, pageSize);

    ctx.success(result, '获取成功');
  }

  /**
   * GET /api/messages/:id
   * 获取消息详情（需要认证）
   */
  async getMessageDetail(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const messageId = parseInt(ctx.params.id);

    if (!messageId || messageId <= 0) {
      throw new AppError('消息ID无效', 400);
    }

    // 调用服务层
    const message = await MessageService.getMessageDetail(messageId, userId);

    ctx.success(message, '获取成功');
  }

  /**
   * PUT /api/messages/:id/read
   * 标记消息为已读（需要认证）
   */
  async markAsRead(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const messageId = parseInt(ctx.params.id);

    if (!messageId || messageId <= 0) {
      throw new AppError('消息ID无效', 400);
    }

    // 调用服务层
    await MessageService.markAsRead(messageId, userId);

    ctx.success(null, '标记成功');
  }

  /**
   * PUT /api/messages/read-all
   * 标记所有消息为已读（需要认证）
   */
  async markAllAsRead(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const body = ctx.request.body as any;
    const type = body?.type as 'system' | 'order' | 'interaction' | 'customer_service' | undefined;

    // 调用服务层
    await MessageService.markAllAsRead(userId, type);

    ctx.success(null, '全部标记为已读');
  }

  /**
   * GET /api/messages/unread-count
   * 获取未读消息数量（需要认证）
   */
  async getUnreadCount(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const type = ctx.query.type as 'system' | 'order' | 'interaction' | 'customer_service' | undefined;

    let count;
    if (type) {
      count = await MessageService.getUnreadCount(userId, type);
    } else {
      count = await MessageService.getUnreadCountByType(userId);
    }

    ctx.success({ count }, '获取成功');
  }

  /**
   * DELETE /api/messages/:id
   * 删除消息（需要认证）
   */
  async deleteMessage(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const messageId = parseInt(ctx.params.id);

    if (!messageId || messageId <= 0) {
      throw new AppError('消息ID无效', 400);
    }

    // 调用服务层
    await MessageService.deleteMessage(messageId, userId);

    ctx.success(null, '删除成功');
  }

  /**
   * POST /api/messages/batch-delete
   * 批量删除消息（需要认证）
   */
  async batchDeleteMessages(ctx: Context) {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new AppError('未登录', 401);
    }

    const { messageIds } = ctx.request.body as any;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      throw new AppError('消息ID列表不能为空', 400);
    }

    // 调用服务层
    await MessageService.batchDeleteMessages(messageIds, userId);

    ctx.success(null, '删除成功');
  }
}

export default new MessageController();
