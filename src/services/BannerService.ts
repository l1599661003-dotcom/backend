import { Op } from 'sequelize';
import { Banner } from '../models';
import { AppError } from '../middlewares/errorHandler';

/**
 * 轮播活动服务类
 */
class BannerService {
  /**
   * 获取有效的轮播列表（按排序返回）
   */
  async getActiveBanners() {
    const now = new Date();

    const banners = await Banner.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          {
            startTime: {
              [Op.lte]: now,
            },
            endTime: {
              [Op.gte]: now,
            },
          },
          {
            startTime: { [Op.is]: null as any },
            endTime: { [Op.is]: null as any },
          },
        ],
      },
      order: [['sortOrder', 'ASC'], ['created_at', 'DESC']],
    });

    return banners.map((banner) => ({
      id: banner.id,
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkType: banner.linkType,
      linkId: banner.linkId,
      linkUrl: banner.linkUrl,
    }));
  }

  /**
   * 获取轮播详情
   * @param bannerId 轮播ID
   */
  async getBannerDetail(bannerId: number) {
    const banner = await Banner.findByPk(bannerId);

    if (!banner) {
      throw new AppError('轮播不存在', 404);
    }

    return banner;
  }

  /**
   * 创建轮播（管理员功能）
   * @param data 轮播数据
   */
  async createBanner(data: {
    title: string;
    imageUrl: string;
    linkType: 'store' | 'product' | 'post' | 'activity' | 'url';
    linkId?: number;
    linkUrl?: string;
    sortOrder?: number;
    startTime?: Date;
    endTime?: Date;
    status?: 'active' | 'inactive';
  }) {
    return await Banner.create(data);
  }

  /**
   * 更新轮播（管理员功能）
   * @param bannerId 轮播ID
   * @param data 更新数据
   */
  async updateBanner(
    bannerId: number,
    data: Partial<{
      title: string;
      imageUrl: string;
      linkType: 'store' | 'product' | 'post' | 'activity' | 'url';
      linkId: number;
      linkUrl: string;
      sortOrder: number;
      startTime: Date;
      endTime: Date;
      status: 'active' | 'inactive';
    }>
  ) {
    const banner = await Banner.findByPk(bannerId);

    if (!banner) {
      throw new AppError('轮播不存在', 404);
    }

    await banner.update(data);

    return banner;
  }

  /**
   * 删除轮播（管理员功能）
   * @param bannerId 轮播ID
   */
  async deleteBanner(bannerId: number) {
    const banner = await Banner.findByPk(bannerId);

    if (!banner) {
      throw new AppError('轮播不存在', 404);
    }

    await banner.destroy();

    return true;
  }

  /**
   * 获取所有轮播（管理员功能）
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getAllBanners(page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;

    const { rows: banners, count: total } = await Banner.findAndCountAll({
      limit: pageSize,
      offset,
      order: [['sortOrder', 'ASC'], ['created_at', 'DESC']],
    });

    return {
      list: banners,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

export default new BannerService();
