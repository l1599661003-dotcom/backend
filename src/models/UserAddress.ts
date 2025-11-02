import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAddressAttributes {
  id: number;
  userId: number;
  name: string;
  phone: string;
  province?: string;
  city?: string;
  district?: string;
  detail: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserAddressCreationAttributes extends Optional<UserAddressAttributes, 'id' | 'province' | 'city' | 'district' | 'postalCode' | 'createdAt' | 'updatedAt'> {}

class UserAddress extends Model<UserAddressAttributes, UserAddressCreationAttributes> implements UserAddressAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public phone!: string;
  public province?: string;
  public city?: string;
  public district?: string;
  public detail!: string;
  public postalCode?: string;
  public isDefault!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserAddress.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    detail: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'postal_code',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'user_addresses',
    timestamps: true,
    underscored: true,
  }
);

export default UserAddress;
