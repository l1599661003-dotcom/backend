import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 动态点赞属性接口
export interface PostLikeAttributes {
  id: number;
  postId: number;
  userId: number;
  createdAt?: Date;
}

// 创建时可选的属性
interface PostLikeCreationAttributes extends Optional<PostLikeAttributes, 'id'> {}

// 动态点赞模型类
class PostLike
  extends Model<PostLikeAttributes, PostLikeCreationAttributes>
  implements PostLikeAttributes
{
  public id!: number;
  public postId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
}

// 初始化模型
PostLike.init(
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
  },
  {
    sequelize,
    tableName: 'post_likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ['post_id'] },
      { fields: ['user_id'] },
      {
        unique: true,
        fields: ['post_id', 'user_id'],
        name: 'uk_post_user',
      },
    ],
  }
);

export default PostLike;
