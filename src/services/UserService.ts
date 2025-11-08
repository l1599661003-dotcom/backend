import { User, UserStats } from '../models';
import { wxLogin, WxUserInfo } from '../utils/wechat';
import { generateToken } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';

/**
 * 用户服务类
 */
class UserService {
  /**
   * 微信登录
   * @param code 微信登录code
   * @param userInfo 用户信息（可选）
   */
  async wxLogin(code: string, userInfo?: WxUserInfo) {
    // 1. 调用微信接口获取openid
    const wxData = await wxLogin(code);

    if (!wxData.openid) {
      throw new AppError('获取微信用户信息失败', 400);
    }

    // 2. 查找或创建用户
    let user = await User.findOne({ where: { openid: wxData.openid } });

    if (!user) {
      // 新用户注册
      user = await User.create({
        openid: wxData.openid,
        unionid: wxData.unionid,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl || '',
        totalPoints: 50, // 新用户注册赠送50积分
      });

      console.log('新用户注册:', user.id);
    } else {
      // 老用户登录，更新用户信息
      if (userInfo) {
        await user.update({
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          unionid: wxData.unionid || user.unionid,
        });
      }
    }

    // 3. 生成JWT Token
    const token = generateToken({
      userId: user.id,
      openid: user.openid,
    });

    // 4. 返回用户信息和token
    return {
      token,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        totalPoints: user.totalPoints,
      },
    };
  }

  /**
   * 根据ID获取用户信息
   */
  async getUserById(userId: number) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      totalPoints: user.totalPoints,
      createdAt: user.createdAt,
    };
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId: number, data: { nickname?: string; avatar?: string; phone?: string }) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    await user.update(data);

    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      totalPoints: user.totalPoints,
    };
  }

  /**
   * 检查手机号是否已被使用
   */
  async checkPhoneExists(phone: string, excludeUserId?: number): Promise<boolean> {
    const where: any = { phone };

    if (excludeUserId) {
      where.id = { [require('sequelize').Op.ne]: excludeUserId };
    }

    const user = await User.findOne({ where });
    return !!user;
  }

  /**
   * 绑定手机号
   */
  async bindPhone(userId: number, phone: string) {
    // 检查手机号是否已被其他用户使用
    const exists = await this.checkPhoneExists(phone, userId);
    if (exists) {
      throw new AppError('该手机号已被其他用户绑定', 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    await user.update({ phone });

    return {
      id: user.id,
      phone: user.phone,
    };
  }

  /**
   * 获取用户积分
   */
  async getUserPoints(userId: number) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    return {
      totalPoints: user.totalPoints,
    };
  }

  /**
   * 获取用户中心数据
   */
  async getUserProfile(userId: number) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserStats,
          as: 'stats',
        },
      ],
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 如果没有统计数据，创建一个
    let stats = user.stats;
    if (!stats) {
      stats = await UserStats.create({
        userId: user.id,
        followingCount: 0,
        followerCount: 0,
        likeCount: 0,
        postCount: 0,
      });
    }

    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      totalPoints: user.totalPoints,
      followingCount: stats.followingCount,
      followerCount: stats.followerCount,
      likeCount: stats.likeCount,
      postCount: stats.postCount,
      createdAt: user.createdAt,
    };
  }

  /**
   * 注销账号
   * 根据微信小程序3.4.1条款要求，用户注销账号后应删除相关数据
   */
  async deleteAccount(userId: number, reason?: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // TODO: 检查用户是否有未完成的订单
    // 可以添加更多的注销前检查逻辑

    // 记录注销日志（用于审计和改进服务）
    console.log('用户注销账号:', {
      userId: user.id,
      nickname: user.nickname,
      reason: reason || '未提供原因',
      deletedAt: new Date(),
    });

    // 删除用户相关数据
    // 1. 删除用户统计数据
    await UserStats.destroy({ where: { userId } });

    // 2. 删除用户收货地址
    // await Address.destroy({ where: { userId } });

    // 3. 清空用户收藏
    // await UserCollect.destroy({ where: { userId } });

    // 4. 清空用户购物车
    // await Cart.destroy({ where: { userId } });

    // 5. 清空用户优惠券
    // await UserCoupon.destroy({ where: { userId } });

    // 6. 删除用户社交关系
    // await UserFollow.destroy({ where: { userId } });
    // await UserFollow.destroy({ where: { followingId: userId } });

    // 7. 删除用户动态和评论
    // await Post.destroy({ where: { userId } });
    // await Comment.destroy({ where: { userId } });

    // 8. 匿名化或删除用户信息（保留订单记录3年，符合法律要求）
    // 将用户信息脱敏处理，而不是完全删除，以满足订单保留要求
    await user.update({
      openid: `deleted_${user.id}_${Date.now()}`,
      unionid: undefined,
      nickname: '已注销用户',
      avatar: '',
      phone: undefined,
      totalPoints: 0,
    });

    // 也可以选择软删除（如果使用了paranoid选项）
    // await user.destroy();

    return true;
  }
}

export default new UserService();
