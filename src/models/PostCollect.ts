import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 动态收藏属性接口
export interface PostCollectAttributes {
  id: number;
  postId: number;
  userId: number;
  createdAt?: Date;
}

// 创建时可选的属性
interface PostCollectCreationAttributes extends Optional<PostCollectAttributes, 'id'> {}

// 动态收藏模型类
class PostCollect
  extends Model<PostCollectAttributes, PostCollectCreationAttributes>
  implements PostCollectAttributes
{
  public id!: number;
  public postId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
}

// 初始化模型
PostCollect.init(
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
    tableName: 'post_collects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['created_at'] },
      {
        unique: true,
        fields: ['post_id', 'user_id'],
        name: 'uk_post_user',
      },
    ],
  }
);

export default PostCollect;
