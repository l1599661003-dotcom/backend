/**
 * 商家服务
 * 处理商家申请、审核、信息管理等业务逻辑
 */

import { Transaction } from 'sequelize';
import sequelize from '../config/database';
import {
  MerchantApplication,
  MerchantInfo,
  Store,
  User,
} from '../models';
import { ApplicationStatus } from '../models/MerchantApplication';
import { StoreStatus } from '../models/Store';
import CommissionService from './CommissionService';

// 前20名商家免佣金期限（月）
const EARLY_BIRD_FREE_MONTHS = 6;
// 前20名商家名额
const EARLY_BIRD_SLOTS = 20;

class MerchantService {
  /**
   * 提交商家入驻申请
   * @param userId 用户ID
   * @param applicationData 申请数据
   * @returns 申请记录
   */
  async applyForMerchant(
    userId: number,
    applicationData: {
      storeName: string;
      contactName: string;
      contactPhone: string;
      storeAddress: string;
      category: string;
      businessLicense?: string;
      description?: string;
    }
  ): Promise<MerchantApplication> {
    // 检查用户是否已经是商家
    const existingStore = await Store.findOne({ where: { ownerId: userId } });
    if (existingStore) {
      throw new Error('您已经是商家，无需重复申请');
    }

    // 检查是否有待审核的申请
    const pendingApplication = await MerchantApplication.findOne({
      where: {
        userId,
        status: ApplicationStatus.PENDING,
      },
    });

    if (pendingApplication) {
      throw new Error('您已有待审核的申请，请等待审核结果');
    }

    // 创建申请
    const application = await MerchantApplication.create({
      userId,
      ...applicationData,
      status: ApplicationStatus.PENDING,
    });

    console.log('商家申请提交成功:', {
      applicationId: application.id,
      userId,
      storeName: applicationData.storeName,
    });

    return application;
  }

  /**
   * 审核商家申请
   * @param applicationId 申请ID
   * @param reviewerId 审核人ID
   * @param approved 是否通过
   * @param rejectReason 拒绝原因（如果拒绝）
   * @returns 更新后的申请记录
   */
  async reviewApplication(
    applicationId: number,
    reviewerId: number,
    approved: boolean,
    rejectReason?: string
  ): Promise<MerchantApplication> {
    const application = await MerchantApplication.findByPk(applicationId);

    if (!application) {
      throw new Error('申请记录不存在');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new Error('该申请已经被审核过了');
    }

    const transaction = await sequelize.transaction();

    try {
      // 更新申请状态
      await application.update(
        {
          status: approved ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
          rejectReason: approved ? undefined : rejectReason,
        },
        { transaction }
      );

      // 如果通过，创建店铺和商家信息
      if (approved) {
        await this.createStoreAndMerchantInfo(application, transaction);
      }

      await transaction.commit();

      console.log('商家申请审核完成:', {
        applicationId,
        approved,
        userId: application.userId,
      });

      return application;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 创建店铺和商家信息
   * @param application 申请记录
   * @param transaction 数据库事务
   */
  private async createStoreAndMerchantInfo(
    application: MerchantApplication,
    transaction: Transaction
  ): Promise<void> {
    // 创建店铺
    const store = await Store.create(
      {
        name: application.storeName,
        ownerId: application.userId,
        logoUrl: 'https://via.placeholder.com/200/cccccc/ffffff?text=Store',
        address: application.storeAddress,
        phone: application.contactPhone,
        rating: 5.0,
        status: StoreStatus.ACTIVE,
      },
      { transaction }
    );

    // 检查是否为前20名商家
    const merchantCount = await MerchantInfo.count({ transaction });
    const isEarlyBird = merchantCount < EARLY_BIRD_SLOTS;

    // 计算前20名商家的免佣金到期时间
    let earlyBirdExpireAt: Date | undefined;
    if (isEarlyBird) {
      earlyBirdExpireAt = new Date();
      earlyBirdExpireAt.setMonth(earlyBirdExpireAt.getMonth() + EARLY_BIRD_FREE_MONTHS);
    }

    // 计算初始佣金比例
    const initialRate = CommissionService.calculateCommissionRate(
      0,
      isEarlyBird,
      earlyBirdExpireAt
    );

    // 创建商家信息
    await MerchantInfo.create(
      {
        storeId: store.id,
        userId: application.userId,
        commissionRate: initialRate,
        isEarlyBird,
        earlyBirdExpireAt,
        deposit: 0,
        balance: 0,
        frozenBalance: 0,
        totalSales: 0,
        totalCommission: 0,
        monthSales: 0,
      },
      { transaction }
    );

    console.log('店铺和商家信息创建成功:', {
      storeId: store.id,
      userId: application.userId,
      isEarlyBird,
      merchantCount: merchantCount + 1,
    });
  }

  /**
   * 获取商家数量
   * @returns 商家数量
   */
  async getMerchantCount(): Promise<number> {
    return await MerchantInfo.count();
  }

  /**
   * 获取前20名商家剩余名额
   * @returns 剩余名额
   */
  async getEarlyBirdRemainingSlots(): Promise<number> {
    const count = await this.getMerchantCount();
    return Math.max(0, EARLY_BIRD_SLOTS - count);
  }

  /**
   * 获取商家信息
   * @param userId 用户ID
   * @returns 商家信息
   */
  async getMerchantInfo(userId: number): Promise<MerchantInfo | null> {
    return await MerchantInfo.findOne({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store',
        },
      ],
    });
  }

  /**
   * 获取用户的商家申请
   * @param userId 用户ID
   * @returns 申请记录列表
   */
  async getUserApplications(userId: number): Promise<MerchantApplication[]> {
    return await MerchantApplication.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * 获取待审核的申请列表
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 申请列表和总数
   */
  async getPendingApplications(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ applications: MerchantApplication[]; total: number }> {
    const offset = (page - 1) * pageSize;

    const { rows: applications, count: total } = await MerchantApplication.findAndCountAll({
      where: { status: ApplicationStatus.PENDING },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar', 'phone'],
        },
      ],
      order: [['createdAt', 'ASC']],
      limit: pageSize,
      offset,
    });

    return { applications, total };
  }

  /**
   * 更新商家月销售额并重新计算佣金比例
   * @param storeId 店铺ID
   * @param amount 订单金额
   * @param commission 佣金金额
   */
  async updateMerchantSales(
    storeId: number,
    amount: number,
    commission: number
  ): Promise<void> {
    const merchantInfo = await MerchantInfo.findOne({ where: { storeId } });

    if (!merchantInfo) {
      throw new Error('商家信息不存在');
    }

    // 更新销售额和佣金
    await merchantInfo.update({
      monthSales: merchantInfo.monthSales + amount,
      totalSales: merchantInfo.totalSales + amount,
      totalCommission: merchantInfo.totalCommission + commission,
    });

    // 重新计算并更新佣金比例
    await CommissionService.updateMerchantCommissionRate(merchantInfo);
  }

  /**
   * 重置所有商家的月销售额（每月1号执行）
   */
  async resetMonthSales(): Promise<void> {
    await MerchantInfo.update(
      { monthSales: 0 },
      { where: {} }
    );

    // 重新计算所有商家的佣金比例
    const allMerchants = await MerchantInfo.findAll();
    for (const merchant of allMerchants) {
      await CommissionService.updateMerchantCommissionRate(merchant);
    }

    console.log('所有商家月销售额已重置，佣金比例已更新');
  }
}

export default new MerchantService();
