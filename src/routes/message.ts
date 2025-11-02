import Router from '@koa/router';
import MessageController from '../controllers/MessageController';
import { authenticate } from '../middlewares/auth';

const router = new Router({
  prefix: '/api',
});

/**
 * 消息相关路由
 */

// 获取消息列表（需要认证）
router.get('/messages', authenticate, MessageController.getMessages);

// 获取未读消息数量（需要认证）
router.get('/messages/unread-count', authenticate, MessageController.getUnreadCount);

// 获取消息详情（需要认证）
router.get('/messages/:id', authenticate, MessageController.getMessageDetail);

// 标记消息为已读（需要认证）
router.put('/messages/:id/read', authenticate, MessageController.markAsRead);

// 标记所有消息为已读（需要认证）
router.put('/messages/read-all', authenticate, MessageController.markAllAsRead);

// 删除消息（需要认证）
router.delete('/messages/:id', authenticate, MessageController.deleteMessage);

// 批量删除消息（需要认证）
router.post('/messages/batch-delete', authenticate, MessageController.batchDeleteMessages);

export default router;
