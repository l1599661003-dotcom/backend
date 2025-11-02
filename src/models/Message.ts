import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 消息属性接口
export interface MessageAttributes {
  id: number;
  receiverUserId: number;
  senderUserId?: number;
  type: 'system' | 'order' | 'interaction' | 'customer_service';
  title?: string;
  content?: string;
  relatedType?: string;
  relatedId?: number;
  isRead: boolean;
  createdAt?: Date;
}

// 创建时可选的属性
interface MessageCreationAttributes
  extends Optional<MessageAttributes, 'id' | 'isRead'> {}

// 消息模型类
class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: number;
  public receiverUserId!: number;
  public senderUserId!: number;
  public type!: 'system' | 'order' | 'interaction' | 'customer_service';
  public title!: string;
  public content!: string;
  public relatedType!: string;
  public relatedId!: number;
  public isRead!: boolean;

  public readonly createdAt!: Date;
}

// 初始化模型
Message.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    receiverUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '接收者用户ID',
      field: 'receiver_user_id',
    },
    senderUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '发送者用户ID（系统消息为NULL）',
      field: 'sender_user_id',
    },
    type: {
      type: DataTypes.ENUM('system', 'order', 'interaction', 'customer_service'),
      allowNull: false,
      comment: '消息类型',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '消息标题',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '消息内容',
    },
    relatedType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '关联类型（order/post/comment）',
      field: 'related_type',
    },
    relatedId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '关联ID',
      field: 'related_id',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否已读',
      field: 'is_read',
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ['receiver_user_id', 'is_read'] },
      { fields: ['type'] },
      { fields: ['created_at'] },
    ],
  }
);

export default Message;
