import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 动态属性接口
export interface PostAttributes {
  id: number;
  userId: number;
  content?: string;
  images?: string[];
  tags?: string[];
  relatedProductId?: number;
  location?: string;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  viewCount: number;
  status: 'published' | 'draft' | 'deleted';
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建时可选的属性
interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    'id' | 'likeCount' | 'commentCount' | 'collectCount' | 'viewCount' | 'status'
  > {}

// 动态模型类
class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public userId!: number;
  public content!: string;
  public images!: string[];
  public tags!: string[];
  public relatedProductId!: number;
  public location!: string;
  public likeCount!: number;
  public commentCount!: number;
  public collectCount!: number;
  public viewCount!: number;
  public status!: 'published' | 'draft' | 'deleted';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化模型
Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '发布者用户ID',
      field: 'user_id',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '动态文字内容',
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '图片列表',
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '话题标签',
    },
    relatedProductId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '关联商品ID',
      field: 'related_product_id',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '地理位置',
    },
    likeCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '点赞数',
      field: 'like_count',
    },
    commentCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评论数',
      field: 'comment_count',
    },
    collectCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '收藏数',
      field: 'collect_count',
    },
    viewCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '浏览数',
      field: 'view_count',
    },
    status: {
      type: DataTypes.ENUM('published', 'draft', 'deleted'),
      allowNull: false,
      defaultValue: 'published',
      comment: '状态',
    },
  },
  {
    sequelize,
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
    ],
  }
);

export default Post;
