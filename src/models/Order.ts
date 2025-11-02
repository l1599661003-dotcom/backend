import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
}

export interface OrderAttributes {
  id: number;
  orderNo: string;
  userId: number;
  storeId: number;
  totalAmount: number;
  payAmount: number;
  pointsUsed: number;
  status: OrderStatus;
  deliverType?: string;
  deliverTimeExpected?: Date;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  remark?: string;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'pointsUsed' | 'status'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public orderNo!: string;
  public userId!: number;
  public storeId!: number;
  public totalAmount!: number;
  public payAmount!: number;
  public pointsUsed!: number;
  public status!: OrderStatus;
  public deliverType?: string;
  public deliverTimeExpected?: Date;
  public receiverName?: string;
  public receiverPhone?: string;
  public receiverAddress?: string;
  public remark?: string;
  public paidAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderNo: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      field: 'order_no',
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    storeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'store_id',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    payAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'pay_amount',
    },
    pointsUsed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'points_used',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
      defaultValue: OrderStatus.PENDING,
    },
    deliverType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'deliver_type',
    },
    deliverTimeExpected: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deliver_time_expected',
    },
    receiverName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'receiver_name',
    },
    receiverPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'receiver_phone',
    },
    receiverAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'receiver_address',
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at',
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['store_id'] },
      { fields: ['status'] },
      { fields: ['order_no'], unique: true },
    ],
  }
);

export default Order;
