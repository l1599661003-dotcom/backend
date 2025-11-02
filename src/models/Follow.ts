import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 关注属性接口
export interface FollowAttributes {
  id: number;
  followerUserId: number;
  followingType: 'user' | 'store';
  followingId: number;
  createdAt?: Date;
}

// 创建时可选的属性
interface FollowCreationAttributes extends Optional<FollowAttributes, 'id'> {}

// 关注模型类
class Follow extends Model<FollowAttributes, FollowCreationAttributes> implements FollowAttributes {
  public id!: number;
  public followerUserId!: number;
  public followingType!: 'user' | 'store';
  public followingId!: number;

  public readonly createdAt!: Date;
}

// 初始化模型
Follow.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    followerUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '关注者用户ID',
      field: 'follower_user_id',
    },
    followingType: {
      type: DataTypes.ENUM('user', 'store'),
      allowNull: false,
      comment: '关注类型',
      field: 'following_type',
    },
    followingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '被关注对象ID（用户ID或店铺ID）',
      field: 'following_id',
    },
  },
  {
    sequelize,
    tableName: 'follows',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ['follower_user_id'] },
      { fields: ['following_type', 'following_id'] },
      {
        unique: true,
        fields: ['follower_user_id', 'following_type', 'following_id'],
        name: 'uk_follower_following',
      },
    ],
  }
);

export default Follow;
