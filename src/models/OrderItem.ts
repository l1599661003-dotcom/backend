import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 订单商品属性接口
export interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  skuId?: string;
  productTitle: string;
  productImage?: string;
  skuName?: string;
  qty: number;
  price: number;
  totalPrice: number;
  createdAt?: Date;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public skuId?: string;
  public productTitle!: string;
  public productImage?: string;
  public skuName?: string;
  public qty!: number;
  public price!: number;
  public totalPrice!: number;

  public readonly createdAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'order_id',
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    skuId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'sku_id',
    },
    productTitle: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'product_title',
    },
    productImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'product_image',
    },
    skuName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'sku_name',
    },
    qty: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_price',
    },
  },
  {
    sequelize,
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

export default OrderItem;
