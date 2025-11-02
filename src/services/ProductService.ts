import { Op } from 'sequelize';
import { Product, Store } from '../models';
import { ProductStatus } from '../models/Product';
import { AppError } from '../middlewares/errorHandler';
import { redisUtils } from '../config/redis';

/**
 * 商品服务类
 */
class ProductService {
  /**
   * 获取店铺商品列表
   */
  async getStoreProducts(
    storeId: number,
    categoryId?: number,
    keyword?: string,
    sort = 'newest',
    page = 1,
    pageSize = 20
  ) {
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {
      storeId,
      status: ProductStatus.ON_SALE,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }

    // 构建排序
    let order: any[] = [];
    switch (sort) {
      case 'price_asc':
        order = [['price', 'ASC']];
        break;
      case 'price_desc':
        order = [['price', 'DESC']];
        break;
      case 'sales':
        order = [['sales', 'DESC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order,
      attributes: [
        'id',
        'storeId',
        'title',
        'mainImage',
        'price',
        'originalPrice',
        'stock',
        'sales',
      ],
    });

    return {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      list: rows.map((product) => ({
        id: product.id,
        storeId: product.storeId,
        title: product.title,
        mainImage: product.mainImage,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        stock: product.stock,
        sales: product.sales,
      })),
    };
  }

  /**
   * 获取商品详情
   */
  async getProductDetail(productId: number) {
    // 尝试从缓存获取
    const cacheKey = `product:detail:${productId}`;
    const cached = await redisUtils.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'logoUrl', 'rating'],
        },
      ],
    });

    if (!product) {
      throw new AppError('商品不存在', 404);
    }

    if (product.status !== ProductStatus.ON_SALE) {
      throw new AppError('商品已下架', 400);
    }

    const result = {
      id: product.id,
      storeId: product.storeId,
      categoryId: product.categoryId,
      title: product.title,
      description: product.description,
      mainImage: product.mainImage,
      imageList: product.imageList || [],
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      stock: product.stock,
      sales: product.sales,
      skuInfo: product.skuInfo || [],
      store: (product as any).store
        ? {
            id: (product as any).store.id,
            name: (product as any).store.name,
            logoUrl: (product as any).store.logoUrl,
            rating: Number((product as any).store.rating),
          }
        : null,
    };

    // 缓存5分钟
    await redisUtils.set(cacheKey, result, 300);

    return result;
  }

  /**
   * 搜索商品
   */
  async searchProducts(keyword: string, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Product.findAndCountAll({
      where: {
        status: ProductStatus.ON_SALE,
        title: { [Op.like]: `%${keyword}%` },
      },
      limit: pageSize,
      offset,
      order: [['sales', 'DESC']],
      attributes: ['id', 'storeId', 'title', 'mainImage', 'price', 'originalPrice', 'sales'],
    });

    return {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      list: rows.map((product) => ({
        id: product.id,
        storeId: product.storeId,
        title: product.title,
        mainImage: product.mainImage,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        sales: product.sales,
      })),
    };
  }

  /**
   * 获取热门商品（限时活动商品，首页）
   */
  async getHotProducts(limit = 10) {
    const cacheKey = 'product:hot';
    const cached = await redisUtils.get(cacheKey);
    if (cached) {
      return cached;
    }

    const products = await Product.findAll({
      where: {
        status: ProductStatus.ON_SALE,
        isHot: true,
      },
      limit,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'storeId', 'title', 'mainImage', 'price', 'originalPrice', 'sales'],
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name'],
        },
      ],
    });

    const result = products.map((product) => ({
      id: product.id,
      storeId: product.storeId,
      title: product.title,
      mainImage: product.mainImage,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      sales: product.sales,
      store: (product as any).store
        ? {
            id: (product as any).store.id,
            name: (product as any).store.name,
          }
        : null,
    }));

    // 缓存10分钟
    await redisUtils.set(cacheKey, result, 600);

    return result;
  }

  /**
   * 获取推荐商品（首页推荐商品）
   */
  async getRecommendedProducts(limit = 10) {
    const cacheKey = 'product:recommended';
    const cached = await redisUtils.get(cacheKey);
    if (cached) {
      return cached;
    }

    const products = await Product.findAll({
      where: {
        status: ProductStatus.ON_SALE,
        isRecommended: true,
      },
      limit,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'storeId', 'title', 'mainImage', 'price', 'originalPrice', 'sales'],
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name'],
        },
      ],
    });

    const result = products.map((product) => ({
      id: product.id,
      storeId: product.storeId,
      title: product.title,
      mainImage: product.mainImage,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      sales: product.sales,
      store: (product as any).store
        ? {
            id: (product as any).store.id,
            name: (product as any).store.name,
          }
        : null,
    }));

    // 缓存10分钟
    await redisUtils.set(cacheKey, result, 600);

    return result;
  }

  /**
   * 检查商品库存
   */
  async checkStock(productId: number, quantity: number): Promise<boolean> {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new AppError('商品不存在', 404);
    }

    if (product.status !== ProductStatus.ON_SALE) {
      throw new AppError('商品已下架', 400);
    }

    return product.stock >= quantity;
  }

  /**
   * 减少库存（创建订单时调用）
   */
  async decreaseStock(productId: number, quantity: number): Promise<void> {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new AppError('商品不存在', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('库存不足', 400);
    }

    await product.update({
      stock: product.stock - quantity,
      sales: product.sales + quantity,
    });

    // 清除缓存
    await redisUtils.del(`product:detail:${productId}`);
  }

  /**
   * 增加库存（取消订单时调用）
   */
  async increaseStock(productId: number, quantity: number): Promise<void> {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new AppError('商品不存在', 404);
    }

    await product.update({
      stock: product.stock + quantity,
      sales: Math.max(0, product.sales - quantity),
    });

    // 清除缓存
    await redisUtils.del(`product:detail:${productId}`);
  }
}

export default new ProductService();
