import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 商家申请状态枚举
export enum ApplicationStatus {
  PENDING = 'pending',      // 待审核
  APPROVED = 'approved',    // 已通过
  REJECTED = 'rejected',    // 已拒绝
}

// 商家申请属性接口
export interface MerchantApplicationAttributes {
  id: number;
  userId: number;
  storeName: string;
  contactName: string;
  contactPhone: string;
  storeAddress: string;
  category: string;
  businessLicense?: string;
  description?: string;
  status: ApplicationStatus;
  rejectReason?: string;
  reviewedAt?: Date;
  reviewedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MerchantApplicationCreationAttributes
  extends Optional<MerchantApplicationAttributes, 'id' | 'status' | 'businessLicense' | 'description' | 'rejectReason' | 'reviewedAt' | 'reviewedBy'> {}

class MerchantApplication extends Model<MerchantApplicationAttributes, MerchantApplicationCreationAttributes>
  implements MerchantApplicationAttributes {
  public id!: number;
  public userId!: number;
  public storeName!: string;
  public contactName!: string;
  public contactPhone!: string;
  public storeAddress!: string;
  public category!: string;
  public businessLicense?: string;
  public description?: string;
  public status!: ApplicationStatus;
  public rejectReason?: string;
  public reviewedAt?: Date;
  public reviewedBy?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MerchantApplication.init(
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
    storeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'store_name',
    },
    contactName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'contact_name',
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'contact_phone',
    },
    storeAddress: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'store_address',
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    businessLicense: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'business_license',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      allowNull: false,
      defaultValue: ApplicationStatus.PENDING,
    },
    rejectReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reject_reason',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at',
    },
    reviewedBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'reviewed_by',
    },
  },
  {
    sequelize,
    tableName: 'merchant_applications',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
    ],
  }
);

export default MerchantApplication;
