import { Op } from 'sequelize';
import { Store, Product } from '../models';
import { StoreStatus } from '../models/Store';
import { AppError } from '../middlewares/errorHandler';
import { redisUtils } from '../config/redis';

/**
 * 店铺服务类
 */
class StoreService {
  /**
   * 获取附近店铺列表
   * @param latitude 纬度
   * @param longitude 经度
   * @param sort 排序方式：distance|rating|newest
   * @param page 页码
   * @param pageSize 每页数量
   */
  async getNearbyStores(
    latitude?: number,
    longitude?: number,
    sort = 'distance',
    page = 1,
    pageSize = 20
  ) {
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {
      status: StoreStatus.ACTIVE,
    };

    // 如果提供了坐标，计算距离
    // 简化版：这里先返回所有店铺，实际项目中应该使用地理位置计算
    const { count, rows } = await Store.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: sort === 'rating' ? [['rating', 'DESC']] : [['created_at', 'DESC']],
    });

    // 如果提供了用户坐标，计算距离
    const storesWithDistance = rows.map((store) => {
      let distance = null;

      if (latitude && longitude && store.latitude && store.longitude) {
        // 使用 Haversine 公式计算距离
        distance = this.calculateDistance(
          latitude,
          longitude,
          Number(store.latitude),
          Number(store.longitude)
        );
      }

      return {
        id: store.id,
        name: store.name,
        logoUrl: store.logoUrl,
        address: store.address,
        phone: store.phone,
        rating: Number(store.rating),
        openHours: store.openHours,
        status: store.status === StoreStatus.ACTIVE ? 'open' : 'closed',
        distance,
      };
    });

    // 按距离排序（如果是distance排序且有坐标）
    if (sort === 'distance' && latitude && longitude) {
      storesWithDistance.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      list: storesWithDistance,
    };
  }

  /**
   * 获取店铺详情
   */
  async getStoreDetail(storeId: number) {
    // 尝试从缓存获取
    const cacheKey = `store:detail:${storeId}`;
    const cached = await redisUtils.get(cacheKey);
    if (cached) {
      return cached;
    }

    const store = await Store.findByPk(storeId);

    if (!store) {
      throw new AppError('店铺不存在', 404);
    }

    if (store.status !== StoreStatus.ACTIVE) {
      throw new AppError('店铺已停业', 400);
    }

    const result = {
      id: store.id,
      name: store.name,
      logoUrl: store.logoUrl,
      address: store.address,
      latitude: store.latitude ? Number(store.latitude) : null,
      longitude: store.longitude ? Number(store.longitude) : null,
      phone: store.phone,
      rating: Number(store.rating),
      openHours: store.openHours,
      productCount: await Product.count({ where: { storeId } }),
    };

    // 缓存5分钟
    await redisUtils.set(cacheKey, result, 300);

    return result;
  }

  /**
   * 搜索店铺
   */
  async searchStores(keyword: string, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Store.findAndCountAll({
      where: {
        status: StoreStatus.ACTIVE,
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { address: { [Op.like]: `%${keyword}%` } },
        ],
      },
      limit: pageSize,
      offset,
      order: [['rating', 'DESC']],
    });

    return {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      list: rows.map((store) => ({
        id: store.id,
        name: store.name,
        logoUrl: store.logoUrl,
        address: store.address,
        rating: Number(store.rating),
      })),
    };
  }

  /**
   * 计算两点之间的距离（Haversine公式）
   * @returns 距离（公里）
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半径（公里）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // 保留两位小数
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export default new StoreService();
