import { Op } from 'sequelize';
import { Post, PostLike, PostComment, PostCollect, User, Follow, Product, UserStats } from '../models';
import { AppError } from '../middlewares/errorHandler';
import sequelize from '../config/database';

/**
 * 动态服务类
 */
class PostService {
  /**
   * 发布动态
   * @param userId 用户ID
   * @param data 动态数据
   */
  async createPost(userId: number, data: {
    content?: string;
    images?: string[];
    tags?: string[];
    relatedProductId?: number;
    location?: string;
    status?: 'published' | 'draft';
  }) {
    // 验证用户是否存在
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 验证关联商品是否存在（如果有）
    if (data.relatedProductId) {
      const product = await Product.findByPk(data.relatedProductId);
      if (!product) {
        throw new AppError('关联商品不存在', 404);
      }
    }

    // 验证至少有内容或图片
    if (!data.content && (!data.images || data.images.length === 0)) {
      throw new AppError('动态内容不能为空', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      // 创建动态
      const post = await Post.create(
        {
          userId,
          content: data.content,
          images: data.images || [],
          tags: data.tags || [],
          relatedProductId: data.relatedProductId,
          location: data.location,
          status: data.status || 'published',
        },
        { transaction }
      );

      // 如果是发布状态，更新用户统计的动态数
      if (post.status === 'published') {
        await this.incrementPostCount(userId, transaction);
      }

      await transaction.commit();

      return post;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取关注的动态流
   * @param userId 用户ID
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getFollowingFeed(userId: number, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;

    // 获取用户关注的用户ID列表
    const followingUsers = await Follow.findAll({
      where: {
        followerUserId: userId,
        followingType: 'user',
      },
      attributes: ['followingId'],
    });

    const followingUserIds = followingUsers.map((f) => f.followingId);

    // 如果没有关注任何人，返回空列表
    if (followingUserIds.length === 0) {
      return {
        list: [],
        pagination: {
          page,
          pageSize,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // 查询关注用户的动态
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: {
        userId: {
          [Op.in]: followingUserIds,
        },
        status: 'published',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: Product,
          as: 'relatedProduct',
          attributes: ['id', 'title', 'mainImage', 'price'],
          required: false,
        },
      ],
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    // 为每个动态添加当前用户的互动状态
    const postList = await this.enrichPostsWithUserInteraction(posts, userId);

    return {
      list: postList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取社区动态流（推荐）
   * @param page 页码
   * @param pageSize 每页数量
   * @param userId 当前用户ID（可选，用于获取互动状态）
   */
  async getCommunityFeed(page: number = 1, pageSize: number = 20, userId?: number) {
    const offset = (page - 1) * pageSize;

    // 查询所有已发布的动态，按热度或时间排序
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: {
        status: 'published',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: Product,
          as: 'relatedProduct',
          attributes: ['id', 'title', 'mainImage', 'price'],
          required: false,
        },
      ],
      limit: pageSize,
      offset,
      // 简单按时间排序，后续可以改为按热度排序
      order: [['created_at', 'DESC']],
    });

    // 如果有用户ID，添加互动状态
    let postList;
    if (userId) {
      postList = await this.enrichPostsWithUserInteraction(posts, userId);
    } else {
      postList = posts.map((post) => this.formatPost(post));
    }

    return {
      list: postList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取动态详情
   * @param postId 动态ID
   * @param userId 当前用户ID（可选）
   */
  async getPostDetail(postId: number, userId?: number) {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: Product,
          as: 'relatedProduct',
          attributes: ['id', 'title', 'mainImage', 'price'],
          required: false,
        },
      ],
    });

    if (!post) {
      throw new AppError('动态不存在', 404);
    }

    if (post.status === 'deleted') {
      throw new AppError('动态已删除', 404);
    }

    // 增加浏览数
    await post.increment('viewCount');

    // 格式化动态数据
    let formattedPost: any = this.formatPost(post);

    // 如果有用户ID，添加互动状态
    if (userId) {
      const [isLiked, isCollected] = await Promise.all([
        this.checkIsLiked(postId, userId),
        this.checkIsCollected(postId, userId),
      ]);

      formattedPost = {
        ...formattedPost,
        isLiked,
        isCollected,
      };
    }

    return formattedPost;
  }

  /**
   * 点赞动态
   * @param postId 动态ID
   * @param userId 用户ID
   */
  async likePost(postId: number, userId: number) {
    const post = await Post.findByPk(postId);
    if (!post || post.status === 'deleted') {
      throw new AppError('动态不存在', 404);
    }

    // 检查是否已点赞
    const existingLike = await PostLike.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      throw new AppError('已经点赞过了', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      // 创建点赞记录
      await PostLike.create({ postId, userId }, { transaction });

      // 增加动态的点赞数
      await post.increment('likeCount', { transaction });

      // 增加动态作者的获赞数
      await this.incrementUserLikeCount(post.userId, transaction);

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 取消点赞
   * @param postId 动态ID
   * @param userId 用户ID
   */
  async unlikePost(postId: number, userId: number) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('动态不存在', 404);
    }

    const like = await PostLike.findOne({
      where: { postId, userId },
    });

    if (!like) {
      throw new AppError('未点赞过该动态', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      // 删除点赞记录
      await like.destroy({ transaction });

      // 减少动态的点赞数
      if (post.likeCount > 0) {
        await post.decrement('likeCount', { transaction });
      }

      // 减少动态作者的获赞数
      await this.decrementUserLikeCount(post.userId, transaction);

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 收藏动态
   * @param postId 动态ID
   * @param userId 用户ID
   */
  async collectPost(postId: number, userId: number) {
    const post = await Post.findByPk(postId);
    if (!post || post.status === 'deleted') {
      throw new AppError('动态不存在', 404);
    }

    // 检查是否已收藏
    const existingCollect = await PostCollect.findOne({
      where: { postId, userId },
    });

    if (existingCollect) {
      throw new AppError('已经收藏过了', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      // 创建收藏记录
      await PostCollect.create({ postId, userId }, { transaction });

      // 增加动态的收藏数
      await post.increment('collectCount', { transaction });

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 取消收藏
   * @param postId 动态ID
   * @param userId 用户ID
   */
  async uncollectPost(postId: number, userId: number) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('动态不存在', 404);
    }

    const collect = await PostCollect.findOne({
      where: { postId, userId },
    });

    if (!collect) {
      throw new AppError('未收藏过该动态', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      // 删除收藏记录
      await collect.destroy({ transaction });

      // 减少动态的收藏数
      if (post.collectCount > 0) {
        await post.decrement('collectCount', { transaction });
      }

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 发表评论
   * @param postId 动态ID
   * @param userId 用户ID
   * @param content 评论内容
   * @param parentCommentId 父评论ID（回复功能）
   */
  async createComment(
    postId: number,
    userId: number,
    content: string,
    parentCommentId?: number
  ) {
    const post = await Post.findByPk(postId);
    if (!post || post.status === 'deleted') {
      throw new AppError('动态不存在', 404);
    }

    // 如果是回复评论，验证父评论是否存在
    if (parentCommentId) {
      const parentComment = await PostComment.findByPk(parentCommentId);
      if (!parentComment || parentComment.postId !== postId) {
        throw new AppError('父评论不存在', 404);
      }
    }

    const transaction = await sequelize.transaction();

    try {
      // 创建评论
      const comment = await PostComment.create(
        {
          postId,
          userId,
          content,
          parentCommentId,
        },
        { transaction }
      );

      // 增加动态的评论数
      await post.increment('commentCount', { transaction });

      await transaction.commit();

      // 返回评论详情（包含用户信息）
      const commentWithUser = await PostComment.findByPk(comment.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nickname', 'avatar'],
          },
        ],
      });

      return commentWithUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取评论列表
   * @param postId 动态ID
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getComments(postId: number, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;

    // 只获取顶级评论（没有父评论的）
    const { rows: comments, count: total } = await PostComment.findAndCountAll({
      where: {
        postId,
        parentCommentId: {
          [Op.is]: null as any,
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: PostComment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar'],
            },
          ],
          limit: 3, // 每个评论最多显示3条回复
          order: [['created_at', 'DESC']],
        },
      ],
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      list: comments,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 删除动态
   * @param postId 动态ID
   * @param userId 用户ID
   */
  async deletePost(postId: number, userId: number) {
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new AppError('动态不存在', 404);
    }

    // 只能删除自己的动态
    if (post.userId !== userId) {
      throw new AppError('无权删除该动态', 403);
    }

    const transaction = await sequelize.transaction();

    try {
      // 软删除：将状态改为deleted
      await post.update({ status: 'deleted' }, { transaction });

      // 减少用户的动态数
      await this.decrementPostCount(userId, transaction);

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取用户的动态列表
   * @param targetUserId 目标用户ID
   * @param page 页码
   * @param pageSize 每页数量
   * @param currentUserId 当前用户ID（可选）
   */
  async getUserPosts(
    targetUserId: number,
    page: number = 1,
    pageSize: number = 20,
    currentUserId?: number
  ) {
    const offset = (page - 1) * pageSize;

    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: {
        userId: targetUserId,
        status: 'published',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: Product,
          as: 'relatedProduct',
          attributes: ['id', 'title', 'mainImage', 'price'],
          required: false,
        },
      ],
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    let postList;
    if (currentUserId) {
      postList = await this.enrichPostsWithUserInteraction(posts, currentUserId);
    } else {
      postList = posts.map((post) => this.formatPost(post));
    }

    return {
      list: postList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ========== 私有辅助方法 ==========

  /**
   * 格式化动态数据
   */
  private formatPost(post: any) {
    return {
      id: post.id,
      user: post.user
        ? {
            id: post.user.id,
            nickname: post.user.nickname,
            avatar: post.user.avatar,
          }
        : null,
      content: post.content,
      images: post.images,
      tags: post.tags,
      relatedProduct: post.relatedProduct
        ? {
            id: post.relatedProduct.id,
            title: post.relatedProduct.title,
            mainImage: post.relatedProduct.mainImage,
            price: post.relatedProduct.price,
          }
        : null,
      location: post.location,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      collectCount: post.collectCount,
      viewCount: post.viewCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  /**
   * 为动态列表添加用户互动状态
   */
  private async enrichPostsWithUserInteraction(posts: any[], userId: number) {
    const postIds = posts.map((p) => p.id);

    // 批量查询点赞和收藏状态
    const [likes, collects] = await Promise.all([
      PostLike.findAll({
        where: {
          postId: { [Op.in]: postIds },
          userId,
        },
        attributes: ['postId'],
      }),
      PostCollect.findAll({
        where: {
          postId: { [Op.in]: postIds },
          userId,
        },
        attributes: ['postId'],
      }),
    ]);

    const likedPostIds = new Set(likes.map((l) => l.postId));
    const collectedPostIds = new Set(collects.map((c) => c.postId));

    return posts.map((post) => ({
      ...this.formatPost(post),
      isLiked: likedPostIds.has(post.id),
      isCollected: collectedPostIds.has(post.id),
    }));
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: number, _userId: number) {
    // 验证评论是否存在
    const comment = await PostComment.findByPk(commentId);
    if (!comment) {
      throw new AppError('评论不存在', 404);
    }

    // 检查是否已点赞
    // Note: 需要创建CommentLike模型，暂时使用简单的实现
    // 这里只是增加点赞数，不记录具体谁点赞了（简化版）

    await comment.increment('likeCount');

    return { success: true };
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(commentId: number, _userId: number) {
    // 验证评论是否存在
    const comment = await PostComment.findByPk(commentId);
    if (!comment) {
      throw new AppError('评论不存在', 404);
    }

    // 减少点赞数
    if (comment.likeCount > 0) {
      await comment.decrement('likeCount');
    }

    return { success: true };
  }

  /**
   * 获取用户收藏的动态列表
   */
  async getUserCollects(userId: number, page: number = 1, pageSize: number = 20) {
    // 验证用户是否存在
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    const offset = (page - 1) * pageSize;

    // 查询收藏列表
    const { count, rows } = await PostCollect.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nickName', 'avatarUrl'],
            },
            {
              model: Product,
              as: 'relatedProduct',
              required: false,
              attributes: ['id', 'title', 'price', 'mainImage'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset,
    });

    // 提取动态列表
    const posts = rows.map((collect: any) => collect.post).filter(Boolean);

    // 检查点赞和收藏状态
    for (const post of posts) {
      post.dataValues.isLiked = await this.checkIsLiked(post.id, userId);
      post.dataValues.isCollected = true; // 已经在收藏列表中
    }

    return {
      list: posts,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * 检查是否点赞
   */
  private async checkIsLiked(postId: number, userId: number): Promise<boolean> {
    const like = await PostLike.findOne({
      where: { postId, userId },
    });
    return !!like;
  }

  /**
   * 检查是否收藏
   */
  private async checkIsCollected(postId: number, userId: number): Promise<boolean> {
    const collect = await PostCollect.findOne({
      where: { postId, userId },
    });
    return !!collect;
  }

  /**
   * 增加用户动态数
   */
  private async incrementPostCount(userId: number, transaction: any) {
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

    await stats.increment('postCount', { transaction });
  }

  /**
   * 减少用户动态数
   */
  private async decrementPostCount(userId: number, transaction: any) {
    const stats = await UserStats.findByPk(userId, { transaction });
    if (stats && stats.postCount > 0) {
      await stats.decrement('postCount', { transaction });
    }
  }

  /**
   * 增加用户获赞数
   */
  private async incrementUserLikeCount(userId: number, transaction: any) {
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

    await stats.increment('likeCount', { transaction });
  }

  /**
   * 减少用户获赞数
   */
  private async decrementUserLikeCount(userId: number, transaction: any) {
    const stats = await UserStats.findByPk(userId, { transaction });
    if (stats && stats.likeCount > 0) {
      await stats.decrement('likeCount', { transaction });
    }
  }
}

export default new PostService();
