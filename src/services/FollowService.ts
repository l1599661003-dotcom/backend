import { Op } from 'sequelize';
import { Follow, UserStats, User, Store } from '../models';
import { AppError } from '../middlewares/errorHandler';
import sequelize from '../config/database';

/**
 * 关注服务类
 */
class FollowService {
  /**
   * 关注店铺或用户
   * @param followerUserId 关注者用户ID
   * @param followingType 关注类型 ('user' | 'store')
   * @param followingId 被关注对象ID
   */
  async follow(followerUserId: number, followingType: 'user' | 'store', followingId: number) {
    // 1. 验证不能关注自己
    if (followingType === 'user' && followerUserId === followingId) {
      throw new AppError('不能关注自己', 400);
    }

    // 2. 验证被关注对象是否存在
    if (followingType === 'user') {
      const targetUser = await User.findByPk(followingId);
      if (!targetUser) {
        throw new AppError('用户不存在', 404);
      }
    } else if (followingType === 'store') {
      const targetStore = await Store.findByPk(followingId);
      if (!targetStore) {
        throw new AppError('店铺不存在', 404);
      }
    }

    // 3. 检查是否已经关注
    const existingFollow = await Follow.findOne({
      where: {
        followerUserId,
        followingType,
        followingId,
      },
    });

    if (existingFollow) {
      throw new AppError('已经关注过了', 400);
    }

    // 4. 使用事务创建关注记录并更新统计数据
    const transaction = await sequelize.transaction();

    try {
      // 创建关注记录
      const follow = await Follow.create(
        {
          followerUserId,
          followingType,
          followingId,
        },
        { transaction }
      );

      // 更新关注者的关注数（following_count）
      await this.incrementFollowingCount(followerUserId, transaction);

      // 如果关注的是用户，更新被关注用户的粉丝数（follower_count）
      if (followingType === 'user') {
        await this.incrementFollowerCount(followingId, transaction);
      }

      await transaction.commit();

      return follow;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 取消关注
   * @param followerUserId 关注者用户ID
   * @param followingType 关注类型
   * @param followingId 被关注对象ID
   */
  async unfollow(followerUserId: number, followingType: 'user' | 'store', followingId: number) {
    // 1. 查找关注记录
    const follow = await Follow.findOne({
      where: {
        followerUserId,
        followingType,
        followingId,
      },
    });

    if (!follow) {
      throw new AppError('未关注过该对象', 400);
    }

    // 2. 使用事务删除关注记录并更新统计数据
    const transaction = await sequelize.transaction();

    try {
      // 删除关注记录
      await follow.destroy({ transaction });

      // 减少关注者的关注数
      await this.decrementFollowingCount(followerUserId, transaction);

      // 如果取消关注的是用户，减少被关注用户的粉丝数
      if (followingType === 'user') {
        await this.decrementFollowerCount(followingId, transaction);
      }

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取用户关注的店铺列表
   * @param userId 用户ID
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getFollowingStores(userId: number, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;

    const { rows: follows, count: total } = await Follow.findAndCountAll({
      where: {
        followerUserId: userId,
        followingType: 'store',
      },
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    // 获取店铺详情
    const storeIds = follows.map((f) => f.followingId);
    const stores = await Store.findAll({
      where: {
        id: {
          [Op.in]: storeIds,
        },
      },
    });

    // 构建店铺信息并保持关注顺序
    const storeMap = new Map(stores.map((s) => [s.id, s]));
    const storeList = follows
      .map((f) => {
        const store = storeMap.get(f.followingId);
        if (!store) return null;
        return {
          id: store.id,
          name: store.name,
          logoUrl: store.logoUrl,
          address: store.address,
          rating: store.rating,
          followedAt: f.createdAt,
        };
      })
      .filter((s) => s !== null);

    return {
      list: storeList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取用户关注的用户列表
   * @param userId 用户ID
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getFollowingUsers(userId: number, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;

    const { rows: follows, count: total } = await Follow.findAndCountAll({
      where: {
        followerUserId: userId,
        followingType: 'user',
      },
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    // 获取用户详情
    const userIds = follows.map((f) => f.followingId);
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: userIds,
        },
      },
    });

    // 构建用户信息并保持关注顺序
    const userMap = new Map(users.map((u) => [u.id, u]));
    const userList = follows
      .map((f) => {
        const user = userMap.get(f.followingId);
        if (!user) return null;
        return {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          followedAt: f.createdAt,
        };
      })
      .filter((u) => u !== null);

    return {
      list: userList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取粉丝列表
   * @param userId 用户ID
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getFollowers(userId: number, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;

    const { rows: follows, count: total } = await Follow.findAndCountAll({
      where: {
        followingType: 'user',
        followingId: userId,
      },
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    // 获取粉丝用户详情
    const followerIds = follows.map((f) => f.followerUserId);
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: followerIds,
        },
      },
    });

    // 构建粉丝信息
    const userMap = new Map(users.map((u) => [u.id, u]));
    const followerList = follows
      .map((f) => {
        const user = userMap.get(f.followerUserId);
        if (!user) return null;
        return {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          followedAt: f.createdAt,
        };
      })
      .filter((u) => u !== null);

    return {
      list: followerList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 检查是否关注
   * @param followerUserId 关注者用户ID
   * @param followingType 关注类型
   * @param followingId 被关注对象ID
   */
  async checkIsFollowing(
    followerUserId: number,
    followingType: 'user' | 'store',
    followingId: number
  ): Promise<boolean> {
    const follow = await Follow.findOne({
      where: {
        followerUserId,
        followingType,
        followingId,
      },
    });

    return !!follow;
  }

  /**
   * 获取用户统计数据
   * @param userId 用户ID
   */
  async getUserStats(userId: number) {
    // 确保用户存在
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 查找或创建统计记录
    let stats = await UserStats.findByPk(userId);

    if (!stats) {
      stats = await UserStats.create({
        userId,
        followingCount: 0,
        followerCount: 0,
        likeCount: 0,
        postCount: 0,
      });
    }

    return {
      userId: stats.userId,
      followingCount: stats.followingCount,
      followerCount: stats.followerCount,
      likeCount: stats.likeCount,
      postCount: stats.postCount,
    };
  }

  // ========== 私有辅助方法 ==========

  /**
   * 增加关注数
   */
  private async incrementFollowingCount(userId: number, transaction: any) {
    const [stats] = await UserStats.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        followingCount: 0,
        followerCount: 0,
        likeCount: 0,
        postCount: 0,
      },
      transaction,
    });

    await stats.increment('followingCount', { transaction });
  }

  /**
   * 减少关注数
   */
  private async decrementFollowingCount(userId: number, transaction: any) {
    const stats = await UserStats.findByPk(userId, { transaction });
    if (stats && stats.followingCount > 0) {
      await stats.decrement('followingCount', { transaction });
    }
  }

  /**
   * 增加粉丝数
   */
  private async incrementFollowerCount(userId: number, transaction: any) {
    const [stats] = await UserStats.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        followingCount: 0,
        followerCount: 0,
        likeCount: 0,
        postCount: 0,
      },
      transaction,
    });

    await stats.increment('followerCount', { transaction });
  }

  /**
   * 减少粉丝数
   */
  private async decrementFollowerCount(userId: number, transaction: any) {
    const stats = await UserStats.findByPk(userId, { transaction });
    if (stats && stats.followerCount > 0) {
      await stats.decrement('followerCount', { transaction });
    }
  }
}

export default new FollowService();
