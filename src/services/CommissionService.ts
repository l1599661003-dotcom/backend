/**
 * 佣金计算服务
 * 根据月销售额和商家类型计算佣金
 */

import { MerchantInfo } from '../models';

export interface CommissionTier {
  min: number;
  max: number | null;
  rate: number;
}

// 佣金阶梯配置
const COMMISSION_TIERS: CommissionTier[] = [
  { min: 0, max: 10000, rate: 5.0 },           // 0-1万: 5%
  { min: 10000, max: 50000, rate: 4.0 },       // 1-5万: 4%
  { min: 50000, max: 100000, rate: 3.0 },      // 5-10万: 3%
  { min: 100000, max: null, rate: 2.5 },       // 10万+: 2.5%
];

const EARLY_BIRD_RATE = 2.0;  // 前20名商家永久优惠费率: 2%

class CommissionService {
  /**
   * 根据月销售额计算佣金比例
   * @param monthSales 月销售额
   * @param isEarlyBird 是否为前20名商家
   * @param earlyBirdExpireAt 前20名特权到期时间
   * @returns 佣金比例
   */
  calculateCommissionRate(
    monthSales: number,
    isEarlyBird: boolean = false,
    earlyBirdExpireAt?: Date
  ): number {
    // 检查前20名商家特权
    if (isEarlyBird && earlyBirdExpireAt) {
      const now = new Date();

      // 6个月免佣金期内
      if (now < earlyBirdExpireAt) {
        return 0;
      }

      // 免佣金期结束后，永久享受2%优惠费率
      return EARLY_BIRD_RATE;
    }

    // 普通商家按阶梯费率计算
    for (const tier of COMMISSION_TIERS) {
      if (tier.max === null) {
        // 最高档
        if (monthSales >= tier.min) {
          return tier.rate;
        }
      } else {
        // 中间档
        if (monthSales >= tier.min && monthSales < tier.max) {
          return tier.rate;
        }
      }
    }

    // 默认返回最高费率
    return COMMISSION_TIERS[0].rate;
  }

  /**
   * 计算订单佣金
   * @param orderAmount 订单金额
   * @param merchantInfo 商家信息
   * @returns 佣金金额
   */
  calculateOrderCommission(orderAmount: number, merchantInfo: MerchantInfo): number {
    const rate = this.calculateCommissionRate(
      merchantInfo.monthSales,
      merchantInfo.isEarlyBird,
      merchantInfo.earlyBirdExpireAt
    );

    return (orderAmount * rate) / 100;
  }

  /**
   * 获取佣金阶梯配置
   * @returns 佣金阶梯配置数组
   */
  getCommissionTiers(): CommissionTier[] {
    return COMMISSION_TIERS;
  }

  /**
   * 获取前20名商家优惠费率
   * @returns 优惠费率
   */
  getEarlyBirdRate(): number {
    return EARLY_BIRD_RATE;
  }

  /**
   * 更新商家佣金比例
   * @param merchantInfo 商家信息
   * @returns 更新后的佣金比例
   */
  async updateMerchantCommissionRate(merchantInfo: MerchantInfo): Promise<number> {
    const newRate = this.calculateCommissionRate(
      merchantInfo.monthSales,
      merchantInfo.isEarlyBird,
      merchantInfo.earlyBirdExpireAt
    );

    // 只有当费率发生变化时才更新
    if (merchantInfo.commissionRate !== newRate) {
      await merchantInfo.update({ commissionRate: newRate });
      console.log(`商家 ${merchantInfo.storeId} 佣金比例更新: ${merchantInfo.commissionRate}% -> ${newRate}%`);
    }

    return newRate;
  }
}

export default new CommissionService();
