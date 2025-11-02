import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 购物车项接口
export interface CartItem {
  productId: number;
  skuId?: string;
  title: string;
  mainImage?: string;
  price: number;
  qty: number;
  selected: boolean;
}

// 购物车属性接口
export interface CartAttributes {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id' | 'items'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: number;
  public userId!: number;
  public items!: CartItem[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'carts',
    timestamps: true,
    underscored: true,
  }
);

export default Cart;
