import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 活动轮播属性接口
export interface BannerAttributes {
  id: number;
  title: string;
  imageUrl: string;
  linkType: 'store' | 'product' | 'post' | 'activity' | 'url';
  linkId?: number;
  linkUrl?: string;
  sortOrder: number;
  startTime?: Date;
  endTime?: Date;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建时可选的属性
interface BannerCreationAttributes
  extends Optional<BannerAttributes, 'id' | 'sortOrder' | 'status'> {}

// 活动轮播模型类
class Banner
  extends Model<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes
{
  public id!: number;
  public title!: string;
  public imageUrl!: string;
  public linkType!: 'store' | 'product' | 'post' | 'activity' | 'url';
  public linkId!: number;
  public linkUrl!: string;
  public sortOrder!: number;
  public startTime!: Date;
  public endTime!: Date;
  public status!: 'active' | 'inactive';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化模型
Banner.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '标题',
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: '图片URL',
      field: 'image_url',
    },
    linkType: {
      type: DataTypes.ENUM('store', 'product', 'post', 'activity', 'url'),
      allowNull: false,
      comment: '链接类型',
      field: 'link_type',
    },
    linkId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '链接ID',
      field: 'link_id',
    },
    linkUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '外部链接',
      field: 'link_url',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序',
      field: 'sort_order',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '开始时间',
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '结束时间',
      field: 'end_time',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
      comment: '状态',
    },
  },
  {
    sequelize,
    tableName: 'banners',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
      { fields: ['status', 'sort_order'] },
      { fields: ['start_time', 'end_time'] },
    ],
  }
);

export default Banner;
