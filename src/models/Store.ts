import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 门店状态枚举
export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// 门店属性接口
export interface StoreAttributes {
  id: number;
  name: string;
  logoUrl?: string;
  coverImage?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  rating: number;
  openHours?: string;
  businessStatus?: string;
  monthlySales?: number;
  status: StoreStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StoreCreationAttributes extends Optional<StoreAttributes, 'id' | 'rating' | 'status'> {}

class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
  public id!: number;
  public name!: string;
  public logoUrl?: string;
  public coverImage?: string;
  public address?: string;
  public latitude?: number;
  public longitude?: number;
  public phone?: string;
  public rating!: number;
  public openHours?: string;
  public businessStatus?: string;
  public monthlySales?: number;
  public status!: StoreStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Store.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'logo_url',
    },
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'cover_image',
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 5.0,
    },
    openHours: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'open_hours',
    },
    businessStatus: {
      type: DataTypes.ENUM('open', 'closed', 'busy'),
      allowNull: true,
      defaultValue: 'open',
      field: 'business_status',
    },
    monthlySales: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      field: 'monthly_sales',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StoreStatus)),
      allowNull: false,
      defaultValue: StoreStatus.ACTIVE,
    },
  },
  {
    sequelize,
    tableName: 'stores',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['latitude', 'longitude'] },
    ],
  }
);

export default Store;
