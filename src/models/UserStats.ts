import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 用户统计属性接口
export interface UserStatsAttributes {
  userId: number;
  followingCount: number;
  followerCount: number;
  likeCount: number;
  postCount: number;
  updatedAt?: Date;
}

// 创建时可选的属性
interface UserStatsCreationAttributes
  extends Optional<
    UserStatsAttributes,
    'followingCount' | 'followerCount' | 'likeCount' | 'postCount'
  > {}

// 用户统计模型类
class UserStats
  extends Model<UserStatsAttributes, UserStatsCreationAttributes>
  implements UserStatsAttributes
{
  public userId!: number;
  public followingCount!: number;
  public followerCount!: number;
  public likeCount!: number;
  public postCount!: number;

  public readonly updatedAt!: Date;
}

// 初始化模型
UserStats.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      comment: '用户ID',
      field: 'user_id',
    },
    followingCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '关注数',
      field: 'following_count',
    },
    followerCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '粉丝数',
      field: 'follower_count',
    },
    likeCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '获赞数',
      field: 'like_count',
    },
    postCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '动态数',
      field: 'post_count',
    },
  },
  {
    sequelize,
    tableName: 'user_stats',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
    underscored: true,
  }
);

export default UserStats;
