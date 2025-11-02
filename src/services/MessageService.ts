import { Op } from 'sequelize';
import { Message, User } from '../models';
import { AppError } from '../middlewares/errorHandler';

/**
 * 消息服务类
 */
class MessageService {
  /**
   * 创建系统消息
   * @param receiverUserId 接收者用户ID
   * @param title 标题
   * @param content 内容
   * @param relatedType 关联类型
   * @param relatedId 关联ID
   */
  async createSystemMessage(
    receiverUserId: number,
    title: string,
    content: string,
    relatedType?: string,
    relatedId?: number
  ) {
    return await Message.create({
      receiverUserId,
      senderUserId: undefined,
      type: 'system',
      title,
      content,
      relatedType,
      relatedId,
    });
  }

  /**
   * 创建订单消息
   * @param receiverUserId 接收者用户ID
   * @param orderId 订单ID
   * @param title 标题
   * @param content 内容
   */
  async createOrderMessage(
    receiverUserId: number,
    orderId: number,
    title: string,
    content: string
  ) {
    return await Message.create({
      receiverUserId,
      senderUserId: undefined,
      type: 'order',
      title,
      content,
      relatedType: 'order',
      relatedId: orderId,
    });
  }

  /**
   * 创建互动消息（点赞、评论、关注等）
   * @param receiverUserId 接收者用户ID
   * @param senderUserId 发送者用户ID
   * @param title 标题
   * @param content 内容
   * @param relatedType 关联类型
   * @param relatedId 关联ID
   */
  async createInteractionMessage(
    receiverUserId: number,
    senderUserId: number,
    title: string,
    content: string,
    relatedType: string,
    relatedId: number
  ) {
    // 不给自己发消息
    if (receiverUserId === senderUserId) {
      return null;
    }

    return await Message.create({
      receiverUserId,
      senderUserId,
      type: 'interaction',
      title,
      content,
      relatedType,
      relatedId,
    });
  }

  /**
   * 获取消息列表
   * @param userId 用户ID
   * @param type 消息类型（可选）
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getMessages(
    userId: number,
    type?: 'system' | 'order' | 'interaction' | 'customer_service',
    page: number = 1,
    pageSize: number = 20
  ) {
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {
      receiverUserId: userId,
    };

    if (type) {
      where.type = type;
    }

    const { rows: messages, count: total } = await Message.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'nickname', 'avatar'],
          required: false,
        },
      ],
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      list: messages,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取消息详情
   * @param messageId 消息ID
   * @param userId 用户ID
   */
  async getMessageDetail(messageId: number, userId: number) {
    const message = await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'nickname', 'avatar'],
          required: false,
        },
      ],
    });

    if (!message) {
      throw new AppError('消息不存在', 404);
    }

    // 只能查看自己的消息
    if (message.receiverUserId !== userId) {
      throw new AppError('无权查看该消息', 403);
    }

    // 自动标记为已读
    if (!message.isRead) {
      await message.update({ isRead: true });
    }

    return message;
  }

  /**
   * 标记消息为已读
   * @param messageId 消息ID
   * @param userId 用户ID
   */
  async markAsRead(messageId: number, userId: number) {
    const message = await Message.findByPk(messageId);

    if (!message) {
      throw new AppError('消息不存在', 404);
    }

    if (message.receiverUserId !== userId) {
      throw new AppError('无权操作该消息', 403);
    }

    if (!message.isRead) {
      await message.update({ isRead: true });
    }

    return true;
  }

  /**
   * 标记所有消息为已读
   * @param userId 用户ID
   * @param type 消息类型（可选）
   */
  async markAllAsRead(
    userId: number,
    type?: 'system' | 'order' | 'interaction' | 'customer_service'
  ) {
    const where: any = {
      receiverUserId: userId,
      isRead: false,
    };

    if (type) {
      where.type = type;
    }

    await Message.update({ isRead: true }, { where });

    return true;
  }

  /**
   * 获取未读消息数量
   * @param userId 用户ID
   * @param type 消息类型（可选）
   */
  async getUnreadCount(
    userId: number,
    type?: 'system' | 'order' | 'interaction' | 'customer_service'
  ) {
    const where: any = {
      receiverUserId: userId,
      isRead: false,
    };

    if (type) {
      where.type = type;
    }

    const count = await Message.count({ where });

    return count;
  }

  /**
   * 获取各类型未读消息数量
   * @param userId 用户ID
   */
  async getUnreadCountByType(userId: number) {
    const types = ['system', 'order', 'interaction', 'customer_service'] as const;

    const counts = await Promise.all(
      types.map((type) => this.getUnreadCount(userId, type))
    );

    return {
      system: counts[0],
      order: counts[1],
      interaction: counts[2],
      customer_service: counts[3],
      total: counts.reduce((sum, count) => sum + count, 0),
    };
  }

  /**
   * 删除消息
   * @param messageId 消息ID
   * @param userId 用户ID
   */
  async deleteMessage(messageId: number, userId: number) {
    const message = await Message.findByPk(messageId);

    if (!message) {
      throw new AppError('消息不存在', 404);
    }

    if (message.receiverUserId !== userId) {
      throw new AppError('无权删除该消息', 403);
    }

    await message.destroy();

    return true;
  }

  /**
   * 批量删除消息
   * @param messageIds 消息ID数组
   * @param userId 用户ID
   */
  async batchDeleteMessages(messageIds: number[], userId: number) {
    await Message.destroy({
      where: {
        id: {
          [Op.in]: messageIds,
        },
        receiverUserId: userId,
      },
    });

    return true;
  }
}

export default new MessageService();
