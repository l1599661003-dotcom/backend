import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum ProductStatus {
  ON_SALE = 'on_sale',
  OFF_SALE = 'off_sale',
}

export interface SKUInfo {
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

export interface ProductAttributes {
  id: number;
  storeId: number;
  categoryId?: number;
  title: string;
  description?: string;
  mainImage?: string;
  imageList?: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  sales: number;
  skuInfo?: SKUInfo[];
  status: ProductStatus;
  isHot?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'stock' | 'sales' | 'status'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public storeId!: number;
  public categoryId?: number;
  public title!: string;
  public description?: string;
  public mainImage?: string;
  public imageList?: string[];
  public price!: number;
  public originalPrice?: number;
  public stock!: number;
  public sales!: number;
  public skuInfo?: SKUInfo[];
  public status!: ProductStatus;
  public isHot?: boolean;
  public isNew?: boolean;
  public isRecommended?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'store_id',
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'category_id',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mainImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'main_image',
    },
    imageList: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'image_list',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'original_price',
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    sales: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    skuInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'sku_info',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProductStatus)),
      allowNull: false,
      defaultValue: ProductStatus.ON_SALE,
    },
    isHot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_hot',
    },
    isNew: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_new',
    },
    isRecommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_recommended',
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['store_id'] },
      { fields: ['category_id'] },
      { fields: ['status'] },
    ],
  }
);

export default Product;
