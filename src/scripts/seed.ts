import sequelize from '../config/database';
import {
  Store,
  Product,
  User,
  Banner,
  Follow,
  UserStats,
  Post,
  PostLike,
  PostComment,
  PostCollect,
  Message,
  Order,
  OrderItem,
  Cart
} from '../models';
import { StoreStatus } from '../models/Store';
import { ProductStatus } from '../models/Product';
import { OrderStatus } from '../models/Order';

async function seed() {
  try {
    console.log('开始初始化测试数据...');

    // 清空现有数据（不使用truncate，避免外键约束问题）
    console.log('清空现有数据...');
    await Cart.destroy({ where: {}, force: true });
    await OrderItem.destroy({ where: {}, force: true });
    await Order.destroy({ where: {}, force: true });
    await Message.destroy({ where: {}, force: true });
    await PostCollect.destroy({ where: {}, force: true });
    await PostComment.destroy({ where: {}, force: true });
    await PostLike.destroy({ where: {}, force: true });
    await Post.destroy({ where: {}, force: true });
    await Follow.destroy({ where: {}, force: true });
    await UserStats.destroy({ where: {}, force: true });
    await Banner.destroy({ where: {}, force: true });
    await Product.destroy({ where: {}, force: true });
    await Store.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    console.log('✅ 数据清空完成');

    // 创建测试用户（包括管理员用户）
    const users = await User.bulkCreate([
      {
        openid: 'admin_openid',
        nickname: '管理员',
        avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
        phone: '13800138000',
        totalPoints: 10000,
      },
      {
        openid: 'test_user_001',
        nickname: '测试用户1',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        phone: '13800138001',
        totalPoints: 1000,
      },
      {
        openid: 'test_user_002',
        nickname: '测试用户2',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        phone: '13800138002',
        totalPoints: 500,
      },
      {
        openid: 'test_user_003',
        nickname: '时尚达人',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        phone: '13800138003',
        totalPoints: 800,
      },
      {
        openid: 'test_user_004',
        nickname: '购物狂人',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        phone: '13800138004',
        totalPoints: 1500,
      },
    ]);
    console.log(`✅ 创建了 ${users.length} 个测试用户`);

    // 创建测试店铺
    const stores = await Store.bulkCreate([
      {
        name: '时尚衣橱',
        logoUrl: 'https://picsum.photos/200/200?random=1',
        address: '北京市朝阳区三里屯路12号',
        latitude: 39.9163,
        longitude: 116.4474,
        phone: '010-12345678',
        rating: 4.8,
        openHours: '09:00-22:00',
        status: StoreStatus.ACTIVE,
      },
      {
        name: '潮流服饰',
        logoUrl: 'https://picsum.photos/200/200?random=2',
        address: '上海市黄浦区南京东路88号',
        latitude: 31.2359,
        longitude: 121.4812,
        phone: '021-87654321',
        rating: 4.6,
        openHours: '10:00-21:00',
        status: StoreStatus.ACTIVE,
      },
      {
        name: '优雅女装',
        logoUrl: 'https://picsum.photos/200/200?random=3',
        address: '广州市天河区天河路168号',
        latitude: 23.1329,
        longitude: 113.3235,
        phone: '020-55667788',
        rating: 4.9,
        openHours: '09:30-21:30',
        status: StoreStatus.ACTIVE,
      },
      {
        name: '男士精选',
        logoUrl: 'https://picsum.photos/200/200?random=4',
        address: '深圳市福田区华强北路200号',
        latitude: 22.5442,
        longitude: 114.0579,
        phone: '0755-88990011',
        rating: 4.7,
        openHours: '10:00-22:00',
        status: StoreStatus.ACTIVE,
      },
    ]);
    console.log(`✅ 创建了 ${stores.length} 个测试店铺`);

    // 创建测试商品
    const products = await Product.bulkCreate([
      // 时尚衣橱的商品
      {
        storeId: stores[0].id,
        title: '纯棉休闲T恤',
        description: '100%纯棉材质，舒适透气，多色可选。适合春夏季节日常穿着。',
        mainImage: 'https://picsum.photos/400/400?random=11',
        imageList: [
          'https://picsum.photos/400/400?random=11',
          'https://picsum.photos/400/400?random=12',
          'https://picsum.photos/400/400?random=13',
        ],
        price: 89.00,
        originalPrice: 129.00,
        stock: 200,
        sales: 1234,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[0].id,
        title: '韩版修身牛仔裤',
        description: '高弹力牛仔面料，修身显瘦，舒适百搭。经典款式永不过时。',
        mainImage: 'https://picsum.photos/400/400?random=14',
        imageList: [
          'https://picsum.photos/400/400?random=14',
          'https://picsum.photos/400/400?random=15',
        ],
        price: 199.00,
        originalPrice: 299.00,
        stock: 150,
        sales: 856,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[0].id,
        title: '连帽卫衣套装',
        description: '加绒保暖，运动休闲两不误。内里柔软舒适，外层防风防寒。',
        mainImage: 'https://picsum.photos/400/400?random=16',
        imageList: [
          'https://picsum.photos/400/400?random=16',
          'https://picsum.photos/400/400?random=17',
          'https://picsum.photos/400/400?random=18',
        ],
        price: 259.00,
        originalPrice: 399.00,
        stock: 88,
        sales: 567,
        status: ProductStatus.ON_SALE,
      },

      // 潮流服饰的商品
      {
        storeId: stores[1].id,
        title: '时尚印花衬衫',
        description: '个性印花设计，潮流百搭款。采用优质面料，版型挺括有型。',
        mainImage: 'https://picsum.photos/400/400?random=21',
        imageList: [
          'https://picsum.photos/400/400?random=21',
          'https://picsum.photos/400/400?random=22',
        ],
        price: 159.00,
        originalPrice: 239.00,
        stock: 120,
        sales: 423,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[1].id,
        title: '工装风外套',
        description: '复古工装设计，多口袋实用设计。耐磨面料，适合日常通勤。',
        mainImage: 'https://picsum.photos/400/400?random=23',
        imageList: [
          'https://picsum.photos/400/400?random=23',
          'https://picsum.photos/400/400?random=24',
          'https://picsum.photos/400/400?random=25',
        ],
        price: 389.00,
        originalPrice: 599.00,
        stock: 66,
        sales: 234,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[1].id,
        title: '休闲运动裤',
        description: '柔软舒适，弹力十足。束脚设计时尚有型，运动休闲两相宜。',
        mainImage: 'https://picsum.photos/400/400?random=26',
        imageList: [
          'https://picsum.photos/400/400?random=26',
          'https://picsum.photos/400/400?random=27',
        ],
        price: 139.00,
        originalPrice: 199.00,
        stock: 180,
        sales: 678,
        status: ProductStatus.ON_SALE,
      },

      // 优雅女装的商品
      {
        storeId: stores[2].id,
        title: '碎花连衣裙',
        description: '浪漫碎花元素，优雅A字裙型。雪纺面料轻盈飘逸，展现女性魅力。',
        mainImage: 'https://picsum.photos/400/400?random=31',
        imageList: [
          'https://picsum.photos/400/400?random=31',
          'https://picsum.photos/400/400?random=32',
          'https://picsum.photos/400/400?random=33',
        ],
        price: 299.00,
        originalPrice: 499.00,
        stock: 95,
        sales: 345,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[2].id,
        title: '职业小西装',
        description: '修身剪裁，展现职场女性干练气质。优质面料，穿着舒适不易皱。',
        mainImage: 'https://picsum.photos/400/400?random=34',
        imageList: [
          'https://picsum.photos/400/400?random=34',
          'https://picsum.photos/400/400?random=35',
        ],
        price: 359.00,
        originalPrice: 549.00,
        stock: 75,
        sales: 289,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[2].id,
        title: '针织开衫',
        description: '柔软针织面料，温柔百搭款。V领设计修饰脸型，适合多种场合。',
        mainImage: 'https://picsum.photos/400/400?random=36',
        imageList: [
          'https://picsum.photos/400/400?random=36',
          'https://picsum.photos/400/400?random=37',
          'https://picsum.photos/400/400?random=38',
        ],
        price: 189.00,
        originalPrice: 279.00,
        stock: 160,
        sales: 512,
        status: ProductStatus.ON_SALE,
      },

      // 男士精选的商品
      {
        storeId: stores[3].id,
        title: '商务衬衫',
        description: '免烫设计，商务出行必备。修身版型，展现男士魅力。',
        mainImage: 'https://picsum.photos/400/400?random=41',
        imageList: [
          'https://picsum.photos/400/400?random=41',
          'https://picsum.photos/400/400?random=42',
        ],
        price: 179.00,
        originalPrice: 259.00,
        stock: 140,
        sales: 456,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[3].id,
        title: '羊毛混纺大衣',
        description: '高端羊毛混纺面料，保暖又显档次。经典款式，百搭商务休闲。',
        mainImage: 'https://picsum.photos/400/400?random=43',
        imageList: [
          'https://picsum.photos/400/400?random=43',
          'https://picsum.photos/400/400?random=44',
          'https://picsum.photos/400/400?random=45',
        ],
        price: 899.00,
        originalPrice: 1499.00,
        stock: 45,
        sales: 123,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[3].id,
        title: '修身西裤',
        description: '精选面料，立体剪裁。适合商务场合，展现专业形象。',
        mainImage: 'https://picsum.photos/400/400?random=46',
        imageList: [
          'https://picsum.photos/400/400?random=46',
          'https://picsum.photos/400/400?random=47',
        ],
        price: 229.00,
        originalPrice: 339.00,
        stock: 110,
        sales: 378,
        status: ProductStatus.ON_SALE,
      },
      {
        storeId: stores[3].id,
        title: 'POLO衫',
        description: '经典翻领设计，商务休闲皆宜。透气舒适，四季可穿。',
        mainImage: 'https://picsum.photos/400/400?random=48',
        imageList: [
          'https://picsum.photos/400/400?random=48',
          'https://picsum.photos/400/400?random=49',
          'https://picsum.photos/400/400?random=50',
        ],
        price: 149.00,
        originalPrice: 219.00,
        stock: 200,
        sales: 789,
        status: ProductStatus.ON_SALE,
      },
    ]);
    console.log(`✅ 创建了 ${products.length} 个测试商品`);

    // 创建轮播图数据
    const banners = await Banner.bulkCreate([
      {
        title: '春季新品上市',
        imageUrl: 'https://picsum.photos/800/400?random=101',
        linkType: 'store',
        linkId: stores[0].id,
        sortOrder: 1,
        status: 'active',
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
      },
      {
        title: '夏日清仓大促',
        imageUrl: 'https://picsum.photos/800/400?random=102',
        linkType: 'product',
        linkId: products[0].id,
        sortOrder: 2,
        status: 'active',
        startTime: new Date(),
        endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15天后
      },
      {
        title: '限时秒杀',
        imageUrl: 'https://picsum.photos/800/400?random=103',
        linkType: 'store',
        linkId: stores[1].id,
        sortOrder: 3,
        status: 'active',
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
      },
      {
        title: '新人专享',
        imageUrl: 'https://picsum.photos/800/400?random=104',
        linkType: 'url',
        linkUrl: 'https://example.com/newuser',
        sortOrder: 4,
        status: 'active',
      },
    ]);
    console.log(`✅ 创建了 ${banners.length} 个轮播图`);

    // 创建用户统计数据
    const userStats = await UserStats.bulkCreate(
      users.map(user => ({
        userId: user.id,
        followingCount: 0,
        followerCount: 0,
        likeCount: 0,
        postCount: 0,
        collectCount: 0,
      }))
    );
    console.log(`✅ 创建了 ${userStats.length} 个用户统计`);

    // 创建关注数据
    const follows = await Follow.bulkCreate([
      {
        followerUserId: users[1].id,
        followingType: 'store',
        followingId: stores[0].id,
      },
      {
        followerUserId: users[1].id,
        followingType: 'store',
        followingId: stores[1].id,
      },
      {
        followerUserId: users[2].id,
        followingType: 'store',
        followingId: stores[0].id,
      },
      {
        followerUserId: users[2].id,
        followingType: 'user',
        followingId: users[1].id,
      },
      {
        followerUserId: users[3].id,
        followingType: 'user',
        followingId: users[1].id,
      },
    ]);
    console.log(`✅ 创建了 ${follows.length} 个关注关系`);

    // 创建动态数据
    const posts = await Post.bulkCreate([
      {
        userId: users[1].id,
        content: '今天入手了这件T恤，质量真的很好！强烈推荐给大家 👕',
        images: [
          'https://picsum.photos/600/600?random=201',
          'https://picsum.photos/600/600?random=202',
        ],
        tags: ['#时尚穿搭', '#好物推荐'],
        relatedProductId: products[0].id,
        location: '北京市朝阳区',
        likeCount: 23,
        commentCount: 5,
        collectCount: 8,
        viewCount: 156,
        status: 'published',
      },
      {
        userId: users[2].id,
        content: '分享一下我的衣橱整理心得，大家有什么想法吗？',
        images: [
          'https://picsum.photos/600/600?random=203',
          'https://picsum.photos/600/600?random=204',
          'https://picsum.photos/600/600?random=205',
        ],
        tags: ['#生活分享', '#衣橱整理'],
        location: '上海市黄浦区',
        likeCount: 45,
        commentCount: 12,
        collectCount: 18,
        viewCount: 234,
        status: 'published',
      },
      {
        userId: users[3].id,
        content: '这家店的衣服真的太好看了！每件都想买 😍',
        images: ['https://picsum.photos/600/600?random=206'],
        tags: ['#购物分享'],
        relatedProductId: products[3].id,
        location: '广州市天河区',
        likeCount: 67,
        commentCount: 8,
        collectCount: 25,
        viewCount: 345,
        status: 'published',
      },
    ]);
    console.log(`✅ 创建了 ${posts.length} 个动态`);

    // 创建动态点赞
    const postLikes = await PostLike.bulkCreate([
      { postId: posts[0].id, userId: users[2].id },
      { postId: posts[0].id, userId: users[3].id },
      { postId: posts[1].id, userId: users[1].id },
      { postId: posts[1].id, userId: users[3].id },
      { postId: posts[2].id, userId: users[1].id },
      { postId: posts[2].id, userId: users[2].id },
    ]);
    console.log(`✅ 创建了 ${postLikes.length} 个动态点赞`);

    // 创建动态评论
    const postComments = await PostComment.bulkCreate([
      {
        postId: posts[0].id,
        userId: users[2].id,
        content: '看起来很不错呢！',
        likeCount: 3,
      },
      {
        postId: posts[0].id,
        userId: users[3].id,
        content: '我也想买一件',
        likeCount: 2,
      },
      {
        postId: posts[1].id,
        userId: users[1].id,
        content: '很实用的分享，感谢！',
        likeCount: 5,
      },
      {
        postId: posts[2].id,
        userId: users[2].id,
        content: '确实很好看',
        likeCount: 1,
      },
    ]);
    console.log(`✅ 创建了 ${postComments.length} 个动态评论`);

    // 创建动态收藏
    const postCollects = await PostCollect.bulkCreate([
      { postId: posts[0].id, userId: users[2].id },
      { postId: posts[1].id, userId: users[1].id },
      { postId: posts[1].id, userId: users[3].id },
      { postId: posts[2].id, userId: users[2].id },
    ]);
    console.log(`✅ 创建了 ${postCollects.length} 个动态收藏`);

    // 创建消息数据
    const messages = await Message.bulkCreate([
      {
        receiverUserId: users[1].id,
        type: 'system',
        title: '欢迎使用',
        content: '欢迎使用本地衣物整合小程序！',
        isRead: false,
      },
      {
        receiverUserId: users[1].id,
        senderUserId: users[2].id,
        type: 'interaction',
        title: '新的点赞',
        content: '用户"测试用户2"点赞了你的动态',
        relatedType: 'post',
        relatedId: posts[0].id,
        isRead: false,
      },
      {
        receiverUserId: users[2].id,
        type: 'system',
        title: '积分到账',
        content: '您获得了10积分奖励',
        isRead: true,
      },
    ]);
    console.log(`✅ 创建了 ${messages.length} 条消息`);

    // 创建订单数据
    const orders = await Order.bulkCreate([
      {
        orderNo: 'ORDER' + Date.now() + '001',
        userId: users[1].id,
        storeId: stores[0].id,
        totalAmount: 89.00,
        payAmount: 89.00,
        pointsUsed: 0,
        status: OrderStatus.COMPLETED,
        deliverType: '快递配送',
        receiverName: '张三',
        receiverPhone: '13800138001',
        receiverAddress: '北京市朝阳区xxx街道xxx号',
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        orderNo: 'ORDER' + Date.now() + '002',
        userId: users[2].id,
        storeId: stores[1].id,
        totalAmount: 548.00,
        payAmount: 548.00,
        pointsUsed: 0,
        status: OrderStatus.DELIVERING,
        deliverType: '快递配送',
        receiverName: '李四',
        receiverPhone: '13800138002',
        receiverAddress: '上海市黄浦区xxx路xxx号',
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        orderNo: 'ORDER' + Date.now() + '003',
        userId: users[3].id,
        storeId: stores[0].id,
        totalAmount: 199.00,
        payAmount: 199.00,
        pointsUsed: 0,
        status: OrderStatus.PAID,
        deliverType: '门店自提',
        receiverName: '王五',
        receiverPhone: '13800138003',
        receiverAddress: '广州市天河区xxx路xxx号',
        paidAt: new Date(),
      },
    ]);
    console.log(`✅ 创建了 ${orders.length} 个订单`);

    // 创建订单商品
    const orderItems = await OrderItem.bulkCreate([
      {
        orderId: orders[0].id,
        productId: products[0].id,
        productTitle: products[0].title,
        productImage: products[0].mainImage,
        skuName: 'M码/白色',
        qty: 1,
        price: 89.00,
        totalPrice: 89.00,
      },
      {
        orderId: orders[1].id,
        productId: products[3].id,
        productTitle: products[3].title,
        productImage: products[3].mainImage,
        skuName: 'L码/蓝色',
        qty: 2,
        price: 159.00,
        totalPrice: 318.00,
      },
      {
        orderId: orders[1].id,
        productId: products[5].id,
        productTitle: products[5].title,
        productImage: products[5].mainImage,
        skuName: 'XL码/黑色',
        qty: 1,
        price: 139.00,
        totalPrice: 139.00,
      },
      {
        orderId: orders[2].id,
        productId: products[1].id,
        productTitle: products[1].title,
        productImage: products[1].mainImage,
        skuName: '30码/深蓝',
        qty: 1,
        price: 199.00,
        totalPrice: 199.00,
      },
    ]);
    console.log(`✅ 创建了 ${orderItems.length} 个订单商品`);

    // 创建购物车数据
    const carts = await Cart.bulkCreate([
      {
        userId: users[1].id,
        items: [
          {
            productId: products[2].id,
            skuId: 'sku_001',
            title: products[2].title,
            mainImage: products[2].mainImage,
            qty: 1,
            price: 259.00,
            selected: true,
          },
        ],
      },
      {
        userId: users[2].id,
        items: [
          {
            productId: products[4].id,
            skuId: 'sku_002',
            title: products[4].title,
            mainImage: products[4].mainImage,
            qty: 2,
            price: 389.00,
            selected: true,
          },
          {
            productId: products[6].id,
            skuId: 'sku_003',
            title: products[6].title,
            mainImage: products[6].mainImage,
            qty: 1,
            price: 299.00,
            selected: false,
          },
        ],
      },
    ]);
    console.log(`✅ 创建了 ${carts.length} 个购物车`);

    console.log('\n✨ 测试数据初始化完成！');
    console.log('====================');
    console.log(`📊 用户数量: ${users.length}`);
    console.log(`🏪 店铺数量: ${stores.length}`);
    console.log(`👕 商品数量: ${products.length}`);
    console.log(`🎬 轮播图数量: ${banners.length}`);
    console.log(`👥 关注关系: ${follows.length}`);
    console.log(`📝 动态数量: ${posts.length}`);
    console.log(`💬 评论数量: ${postComments.length}`);
    console.log(`📧 消息数量: ${messages.length}`);
    console.log(`📦 订单数量: ${orders.length}`);
    console.log(`🛒 购物车数量: ${carts.length}`);
    console.log('====================\n');

  } catch (error) {
    console.error('❌ 初始化测试数据失败:', error);
  } finally {
    await sequelize.close();
  }
}

// 执行seed
seed();
