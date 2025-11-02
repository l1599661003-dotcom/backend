import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import UserStats from './UserStats';

// 用户属性接口
export interface UserAttributes {
  id: number;
  openid: string;
  unionid?: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  totalPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建时可选的属性
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'totalPoints'> {}

// 用户模型类
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public openid!: string;
  public unionid?: string;
  public nickname?: string;
  public avatar?: string;
  public phone?: string;
  public totalPoints!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 关联属性
  public readonly stats?: UserStats;
}

// 初始化模型
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    openid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    unionid: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    totalPoints: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'total_points',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['openid'] },
      { fields: ['phone'] },
    ],
  }
);

export default User;
