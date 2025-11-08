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
  ownerId: number;
  logoUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  rating: number;
  openHours?: string;
  status: StoreStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StoreCreationAttributes extends Optional<StoreAttributes, 'id' | 'rating' | 'status'> {}

class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
  public id!: number;
  public name!: string;
  public ownerId!: number;
  public logoUrl?: string;
  public address?: string;
  public latitude?: number;
  public longitude?: number;
  public phone?: string;
  public rating!: number;
  public openHours?: string;
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
    ownerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'owner_id',
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'logo_url',
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
