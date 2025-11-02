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
}

export default new UserService();
