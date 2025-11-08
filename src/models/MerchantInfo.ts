import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 商家信息属性接口
export interface MerchantInfoAttributes {
  id: number;
  storeId: number;
  userId: number;
  commissionRate: number;           // 当前佣金比例
  isEarlyBird: boolean;              // 是否为前20名商家
  earlyBirdExpireAt?: Date;          // 前20名免佣金到期时间
  deposit: number;                    // 保证金
  balance: number;                    // 账户余额
  frozenBalance: number;              // 冻结金额
  totalSales: number;                 // 总销售额
  totalCommission: number;            // 总佣金
  monthSales: number;                 // 本月销售额
  lastSettlementAt?: Date;            // 上次结算时间
  createdAt?: Date;
  updatedAt?: Date;
}

interface MerchantInfoCreationAttributes
  extends Optional<
    MerchantInfoAttributes,
    'id' | 'commissionRate' | 'isEarlyBird' | 'earlyBirdExpireAt' | 'deposit' | 'balance' | 'frozenBalance' | 'totalSales' | 'totalCommission' | 'monthSales' | 'lastSettlementAt'
  > {}

class MerchantInfo extends Model<MerchantInfoAttributes, MerchantInfoCreationAttributes>
  implements MerchantInfoAttributes {
  public id!: number;
  public storeId!: number;
  public userId!: number;
  public commissionRate!: number;
  public isEarlyBird!: boolean;
  public earlyBirdExpireAt?: Date;
  public deposit!: number;
  public balance!: number;
  public frozenBalance!: number;
  public totalSales!: number;
  public totalCommission!: number;
  public monthSales!: number;
  public lastSettlementAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MerchantInfo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      field: 'store_id',
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    commissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 5.0,
      comment: '佣金比例（百分比）',
      field: 'commission_rate',
    },
    isEarlyBird: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否为前20名商家',
      field: 'is_early_bird',
    },
    earlyBirdExpireAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '前20名免佣金到期时间',
      field: 'early_bird_expire_at',
    },
    deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '保证金',
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '账户余额',
    },
    frozenBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '冻结金额',
      field: 'frozen_balance',
    },
    totalSales: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '总销售额',
      field: 'total_sales',
    },
    totalCommission: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '总佣金',
      field: 'total_commission',
    },
    monthSales: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '本月销售额',
      field: 'month_sales',
    },
    lastSettlementAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '上次结算时间',
      field: 'last_settlement_at',
    },
  },
  {
    sequelize,
    tableName: 'merchant_info',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['store_id'] },
      { fields: ['user_id'] },
      { fields: ['is_early_bird'] },
    ],
  }
);

export default MerchantInfo;
