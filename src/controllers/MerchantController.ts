/**
 * 商家控制器
 * 处理商家相关的HTTP请求
 */

import { Context } from 'koa';
import MerchantService from '../services/MerchantService';
import CommissionService from '../services/CommissionService';

class MerchantController {
  /**
   * 提交商家入驻申请
   */
  async applyForMerchant(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.body = {
          code: 401,
          message: '请先登录',
        };
        return;
      }

      const {
        storeName,
        contactName,
        contactPhone,
        storeAddress,
        category,
        businessLicense,
        description,
      } = ctx.request.body as any;

      // 验证必填字段
      if (!storeName || !contactName || !contactPhone || !storeAddress || !category) {
        ctx.body = {
          code: 400,
          message: '请填写完整的申请信息',
        };
        return;
      }

      const application = await MerchantService.applyForMerchant(userId, {
        storeName,
        contactName,
        contactPhone,
        storeAddress,
        category,
        businessLicense,
        description,
      });

      ctx.body = {
        code: 200,
        message: '申请提交成功，请等待审核',
        data: application,
      };
    } catch (error: any) {
      console.error('商家申请失败:', error);
      ctx.body = {
        code: 500,
        message: error.message || '申请提交失败',
      };
    }
  }

  /**
   * 获取商家数量和前20名剩余名额
   */
  async getMerchantStats(ctx: Context) {
    try {
      const totalCount = await MerchantService.getMerchantCount();
      const remainingSlots = await MerchantService.getEarlyBirdRemainingSlots();

      ctx.body = {
        code: 200,
        data: {
          totalCount,
          remainingSlots,
          earlyBirdAvailable: remainingSlots > 0,
        },
      };
    } catch (error: any) {
      console.error('获取商家统计失败:', error);
      ctx.body = {
        code: 500,
        message: error.message || '获取统计信息失败',
      };
    }
  }

  /**
   * 获取当前用户的商家信息
   */
  async getMyMerchantInfo(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.body = {
          code: 401,
          message: '请先登录',
        };
        return;
      }

      const merchantInfo = await MerchantService.getMerchantInfo(userId);

      ctx.body = {
        code: 200,
        data: merchantInfo,
      };
    } catch (error: any) {
      console.error('获取商家信息失败:', error);
      ctx.body = {
        code: 500,
        message: error.message || '获取商家信息失败',
      };
    }
  }

  /**
   * 获取当前用户的申请记录
   */
  async getMyApplications(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.body = {
          code: 401,
          message: '请先登录',
        };
        return;
      }

      const applications = await MerchantService.getUserApplications(userId);

      ctx.body = {
        code: 200,
        data: applications,
      };
    } catch (error: any) {
      console.error('获取申请记录失败:', error);
      ctx.body = {
        code: 500,
        message: error.message || '获取申请记录失败',
      };
    }
  }

  /**
   * 获取佣金政策配置
   */
  async getCommissionPolicy(ctx: Context) {
    try {
      const tiers = CommissionService.getCommissionTiers();
      const earlyBirdRate = CommissionService.getEarlyBirdRate();

      ctx.body = {
        code: 200,
        data: {
          tiers,
          earlyBirdRate,
          earlyBirdFreeMonths: 6,
          earlyBirdSlots: 20,
        },
      };
    } catch (error: any) {
      console.error('获取佣金政策失败:', error);
      ctx.body = {
        code: 500,
        message: error.message || '获取佣金政策失败',
      };
    }
  }

  /**
   * 审核商家申请（管理员）
   */
  async reviewApplication(ctx: Context) {
    try {
      const reviewerId = ctx.state.user?.userId;

      if (!reviewerId) {
        ctx.body = {
          code: 401,
          message: '请先登录',
        };
        return;
      }

      const { applicationId } = ctx.params;
      const { approved, rejectReason } = ctx.request.body as any;

      if (approved === undefined) {
        ctx.body = {
          code: 400,
          message: '请指定是否通过审核',
        };
        return;
      }

      if (!approved && !rejectReason) {
        ctx.body = {
          code: 400,
          message: '拒绝申请时必须提供原因',
        };
        return;
      }

      const application = await MerchantService.reviewApplication(
        parseInt(applicationId),
        reviewerId,
        approved,
        rejectReason
      );

      ctx.body = {
        code: 200,
        message: approved ? '申请已通过' : '申请已拒绝',
        data: application,
      };
    } catch (error: any) {
      console.error('审核申请失败:', error);
      ctx.body = {
        code: 500,
        message: error.message || '审核申请失败',
      };
    }
  }

  /**
   * 获取待审核的申请列表（管理员）
   */
  async getPendingApplications(ctx: Context) {
    try {
      const { page = 1, pageSize = 10 } = ctx.query;

      const result = await MerchantService.getPendingApplications(
        parseInt(page as string),
        parseInt(pageSize as string)
      );

      ctx.body = {
        code: 200,
        data: result.applications,
        pagination: {
          page: parseInt(page as string),
          pageSize: parseInt(pageSize as string),
          total: result.total,
        },
      };
    } catch (error: any) {
      console.error('获取待审核申请失败:', error);
      ctx.body = {
        code: 500,
        message: error.message || '获取待审核申请失败',
      };
    }
  }
}

export default new MerchantController();
