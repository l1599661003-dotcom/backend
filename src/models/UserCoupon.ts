import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserCouponAttributes {
  id: number;
  userId: number;
  couponId: number;
  orderId?: number;
  status: 'unused' | 'used' | 'expired';
  receivedAt: Date;
  validStart?: Date;
  validEnd?: Date;
  usedAt?: Date;
}

interface UserCouponCreationAttributes extends Optional<UserCouponAttributes, 'id' | 'orderId' | 'validStart' | 'validEnd' | 'usedAt'> {}

class UserCoupon extends Model<UserCouponAttributes, UserCouponCreationAttributes> implements UserCouponAttributes {
  public id!: number;
  public userId!: number;
  public couponId!: number;
  public orderId?: number;
  public status!: 'unused' | 'used' | 'expired';
  public receivedAt!: Date;
  public validStart?: Date;
  public validEnd?: Date;
  public usedAt?: Date;
}

UserCoupon.init(
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
    couponId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'coupon_id',
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'order_id',
    },
    status: {
      type: DataTypes.ENUM('unused', 'used', 'expired'),
      allowNull: false,
      defaultValue: 'unused',
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'received_at',
    },
    validStart: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'valid_start',
    },
    validEnd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'valid_end',
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'used_at',
    },
  },
  {
    sequelize,
    tableName: 'user_coupons',
    timestamps: false,
    underscored: true,
  }
);

export default UserCoupon;
