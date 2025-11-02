import sequelize from '../config/database';
import Store, { StoreStatus } from '../models/Store';
import Product, { ProductStatus } from '../models/Product';
import Coupon from '../models/Coupon';

async function seedHomeData() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步数据库表结构（添加新字段）
    await sequelize.sync({ alter: true });
    console.log('数据库表结构同步完成');

    // 创建店铺数据
    const stores = await Store.bulkCreate([
      {
        name: '潮鞋集合站',
        logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
        address: '北京市朝阳区合生汇 3F',
        phone: '010-8888 6666',
        rating: 4.9,
        openHours: '10:00-22:00',
        status: StoreStatus.ACTIVE,
      },
      {
        name: '运动鞋专卖',
        logoUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=200&q=80',
        address: '北京市蓝色港湾 2F',
        phone: '010-6666 8899',
        rating: 4.7,
        openHours: '09:00-21:00',
        status: StoreStatus.ACTIVE,
      },
    ], { returning: true });

    console.log(`创建了 ${stores.length} 个店铺`);

    // 创建限时活动商品（isHot = true）
    const hotProducts = await Product.bulkCreate([
      {
        storeId: stores[0].id,
        title: 'Nike Air Jordan 1',
        description: '经典配色，正品保证，支持鉴定服务',
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        imageList: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
        ],
        price: 1299,
        originalPrice: 1599,
        stock: 50,
        sales: 320,
        status: ProductStatus.ON_SALE,
        isHot: true,
        isRecommended: false,
      },
      {
        storeId: stores[1].id,
        title: 'Adidas Yeezy 350',
        description: '限量款式，椰子系列经典配色',
        mainImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'],
        price: 1599,
        originalPrice: 1999,
        stock: 30,
        sales: 156,
        status: ProductStatus.ON_SALE,
        isHot: true,
        isRecommended: false,
      },
      {
        storeId: stores[1].id,
        title: 'New Balance 574',
        description: '复古设计，舒适透气，多色可选',
        mainImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80'],
        price: 699,
        originalPrice: 899,
        stock: 80,
        sales: 543,
        status: ProductStatus.ON_SALE,
        isHot: true,
        isRecommended: false,
      },
      {
        storeId: stores[0].id,
        title: 'Vans Old Skool',
        description: '街头经典款，潮流百搭',
        mainImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80'],
        price: 459,
        originalPrice: 599,
        stock: 120,
        sales: 876,
        status: ProductStatus.ON_SALE,
        isHot: true,
        isRecommended: false,
      },
    ]);

    console.log(`创建了 ${hotProducts.length} 个限时活动商品`);

    // 创建推荐商品（isRecommend = true）
    const recommendProducts = await Product.bulkCreate([
      {
        storeId: stores[0].id,
        title: 'Nike Air Force 1 经典白',
        description: '永不过时的经典款式',
        mainImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'],
        price: 799,
        originalPrice: 999,
        stock: 200,
        sales: 1234,
        status: ProductStatus.ON_SALE,
        isHot: false,
        isRecommended: true,
      },
      {
        storeId: stores[1].id,
        title: 'Converse 1970s 帆布鞋',
        description: '复古帆布鞋，多色可选',
        mainImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80'],
        price: 459,
        originalPrice: 599,
        stock: 150,
        sales: 987,
        status: ProductStatus.ON_SALE,
        isHot: false,
        isRecommended: true,
      },
      {
        storeId: stores[0].id,
        title: 'Puma RS-X 复古跑鞋',
        description: '时尚复古设计，舒适缓震',
        mainImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'],
        price: 899,
        originalPrice: 1099,
        stock: 60,
        sales: 234,
        status: ProductStatus.ON_SALE,
        isHot: false,
        isRecommended: true,
      },
      {
        storeId: stores[1].id,
        title: 'Reebok Club C 85',
        description: '经典网球鞋，简约百搭',
        mainImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80'],
        price: 599,
        originalPrice: 799,
        stock: 90,
        sales: 456,
        status: ProductStatus.ON_SALE,
        isHot: false,
        isRecommended: true,
      },
      {
        storeId: stores[0].id,
        title: 'ASICS GEL-KAYANO',
        description: '专业跑鞋，缓震透气',
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'],
        price: 1099,
        originalPrice: 1299,
        stock: 40,
        sales: 123,
        status: ProductStatus.ON_SALE,
        isHot: false,
        isRecommended: true,
      },
      {
        storeId: stores[1].id,
        title: 'Saucony 复古跑鞋',
        description: '美式复古风格，潮流必备',
        mainImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
        imageList: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80'],
        price: 799,
        originalPrice: 999,
        stock: 70,
        sales: 345,
        status: ProductStatus.ON_SALE,
        isHot: false,
        isRecommended: true,
      },
    ]);

    console.log(`创建了 ${recommendProducts.length} 个推荐商品`);

    // 创建优惠券
    const coupons = await Coupon.bulkCreate([
      {
        storeId: undefined, // 平台券
        name: '球鞋专区',
        type: 'full_reduction',
        conditionAmount: 500,
        discountValue: 100,
        totalQuantity: 1000,
        receivedQuantity: 0,
        usedQuantity: 0,
        validDays: 7,
        status: 'active',
        description: '满500可用 · 限时24H',
        color: '#e74c3c',
      },
      {
        storeId: undefined,
        name: '运动鞋款',
        type: 'discount',
        conditionAmount: 0,
        discountValue: 0.8,
        maxDiscount: 200,
        totalQuantity: 500,
        receivedQuantity: 0,
        usedQuantity: 0,
        validDays: 30,
        status: 'active',
        description: '全场运动鞋限时折扣',
        color: '#6c5ce7',
      },
      {
        storeId: undefined,
        name: '新用户礼包',
        type: 'full_reduction',
        conditionAmount: 0,
        discountValue: 50,
        totalQuantity: 10000,
        receivedQuantity: 0,
        usedQuantity: 0,
        validDays: 7,
        status: 'active',
        description: '新用户下单立减',
        color: '#fd79a8',
      },
      {
        storeId: undefined,
        name: '同城闪送',
        type: 'fixed',
        conditionAmount: 99,
        discountValue: 0, // 免运费
        totalQuantity: 2000,
        receivedQuantity: 0,
        usedQuantity: 0,
        validDays: 15,
        status: 'active',
        description: '15km内极速配送',
        color: '#00b894',
      },
    ]);

    console.log(`创建了 ${coupons.length} 个优惠券`);

    console.log('\n✅ 首页数据填充完成！');
    console.log(`  - ${stores.length} 个店铺`);
    console.log(`  - ${hotProducts.length} 个限时活动商品`);
    console.log(`  - ${recommendProducts.length} 个推荐商品`);
    console.log(`  - ${coupons.length} 个优惠券`);

  } catch (error) {
    console.error('数据填充失败:', error);
  } finally {
    await sequelize.close();
  }
}

seedHomeData();
