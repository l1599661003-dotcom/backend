import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 动态评论属性接口
export interface PostCommentAttributes {
  id: number;
  postId: number;
  userId: number;
  content: string;
  parentCommentId?: number;
  likeCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建时可选的属性
interface PostCommentCreationAttributes
  extends Optional<PostCommentAttributes, 'id' | 'likeCount'> {}

// 动态评论模型类
class PostComment
  extends Model<PostCommentAttributes, PostCommentCreationAttributes>
  implements PostCommentAttributes
{
  public id!: number;
  public postId!: number;
  public userId!: number;
  public content!: string;
  public parentCommentId!: number;
  public likeCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化模型
PostComment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '动态ID',
      field: 'post_id',
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '用户ID',
      field: 'user_id',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '评论内容',
    },
    parentCommentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '父评论ID（回复功能）',
      field: 'parent_comment_id',
    },
    likeCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '点赞数',
      field: 'like_count',
    },
  },
  {
    sequelize,
    tableName: 'post_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
      { fields: ['post_id'] },
      { fields: ['user_id'] },
      { fields: ['parent_comment_id'] },
    ],
  }
);

export default PostComment;
