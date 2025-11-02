import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CouponAttributes {
  id: number;
  storeId?: number;
  name: string;
  type: 'full_reduction' | 'discount' | 'fixed';
  conditionAmount: number;
  discountValue: number;
  maxDiscount?: number;
  totalQuantity: number;
  receivedQuantity: number;
  usedQuantity: number;
  validDays?: number;
  startTime?: Date;
  endTime?: Date;
  status: 'active' | 'inactive' | 'expired';
  description?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CouponCreationAttributes extends Optional<CouponAttributes, 'id' | 'storeId' | 'maxDiscount' | 'validDays' | 'startTime' | 'endTime' | 'description' | 'createdAt' | 'updatedAt'> {}

class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
  public id!: number;
  public storeId?: number;
  public name!: string;
  public type!: 'full_reduction' | 'discount' | 'fixed';
  public conditionAmount!: number;
  public discountValue!: number;
  public maxDiscount?: number;
  public totalQuantity!: number;
  public receivedQuantity!: number;
  public usedQuantity!: number;
  public validDays?: number;
  public startTime?: Date;
  public endTime?: Date;
  public status!: 'active' | 'inactive' | 'expired';
  public description?: string;
  public color?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'store_id',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('full_reduction', 'discount', 'fixed'),
      allowNull: false,
    },
    conditionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'condition_amount',
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'discount_value',
    },
    maxDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'max_discount',
    },
    totalQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'total_quantity',
    },
    receivedQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'received_quantity',
    },
    usedQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'used_quantity',
    },
    validDays: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'valid_days',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_time',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'expired'),
      allowNull: false,
      defaultValue: 'active',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#e74c3c',
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
    tableName: 'coupons',
    timestamps: true,
    underscored: true,
  }
);

export default Coupon;
