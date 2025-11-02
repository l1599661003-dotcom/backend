-- ============================================
-- 测试数据 - 服装小程序
-- ============================================

USE clothing_mini_program;

-- 清空现有数据（可选，谨慎使用）
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE user_coupons;
-- TRUNCATE TABLE coupons;
-- TRUNCATE TABLE order_items;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE carts;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE stores;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============ 用户数据 ============
INSERT INTO users (id, openid, unionid, nickname, avatar, phone, total_points) VALUES
(1, 'oTest001', 'uTest001', '时尚达人小王', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL1', '13800138001', 500),
(2, 'oTest002', 'uTest002', '购物狂李小姐', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL2', '13800138002', 300),
(3, 'oTest003', 'uTest003', '型男张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL3', '13800138003', 150),
(4, 'oTest004', 'uTest004', '美女赵四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL4', '13800138004', 800),
(5, 'oTest005', 'uTest005', '极客王五', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL5', '13800138005', 200);

-- ============ 门店数据 ============
INSERT INTO stores (id, name, logo_url, cover_image, address, latitude, longitude, phone, rating, open_hours, business_status, monthly_sales, status) VALUES
(1, '潮流先锋旗舰店', 'https://via.placeholder.com/200/ff6b6b/ffffff?text=潮流', 'https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Cover', '北京市朝阳区三里屯太古里', 39.937510, 116.447870, '010-12345678', 4.8, '10:00-22:00', 'open', 1580, 'active'),
(2, '时尚女装精品店', 'https://via.placeholder.com/200/4ecdc4/ffffff?text=女装', 'https://via.placeholder.com/800x400/4ecdc4/ffffff?text=Cover', '上海市静安区南京西路', 31.229420, 121.455520, '021-87654321', 4.9, '09:30-21:30', 'open', 2340, 'active'),
(3, '男装绅士馆', 'https://via.placeholder.com/200/45b7d1/ffffff?text=男装', 'https://via.placeholder.com/800x400/45b7d1/ffffff?text=Cover', '广州市天河区天河城', 23.134570, 113.322100, '020-11112222', 4.7, '10:00-22:00', 'open', 980, 'active'),
(4, '运动潮牌店', 'https://via.placeholder.com/200/f7b731/ffffff?text=运动', 'https://via.placeholder.com/800x400/f7b731/ffffff?text=Cover', '深圳市南山区海岸城', 22.486290, 113.934950, '0755-33334444', 4.6, '10:00-22:00', 'open', 1250, 'active'),
(5, '童装乐园', 'https://via.placeholder.com/200/fa8231/ffffff?text=童装', 'https://via.placeholder.com/800x400/fa8231/ffffff?text=Cover', '成都市锦江区春熙路', 30.657810, 104.081850, '028-55556666', 4.8, '10:00-21:00', 'open', 760, 'active');

-- ============ 分类数据 ============
INSERT INTO categories (id, store_id, name, parent_id, sort_order) VALUES
-- 潮流先锋旗舰店分类
(1, 1, '上衣', 0, 1),
(2, 1, '裤装', 0, 2),
(3, 1, '外套', 0, 3),
(4, 1, 'T恤', 1, 1),
(5, 1, '衬衫', 1, 2),
-- 时尚女装精品店分类
(6, 2, '连衣裙', 0, 1),
(7, 2, '套装', 0, 2),
(8, 2, '配饰', 0, 3),
-- 男装绅士馆分类
(9, 3, '西装', 0, 1),
(10, 3, '休闲装', 0, 2),
-- 运动潮牌店分类
(11, 4, '运动鞋', 0, 1),
(12, 4, '运动服', 0, 2),
-- 童装乐园分类
(13, 5, '男童装', 0, 1),
(14, 5, '女童装', 0, 2);

-- ============ 商品数据 ============
INSERT INTO products (id, store_id, category_id, title, description, main_image, price, original_price, stock, sales, is_hot, is_new, is_recommended, status) VALUES
-- 潮流先锋旗舰店商品
(1, 1, 4, '纯棉基础款圆领T恤 简约百搭', '优质纯棉面料，舒适透气，多色可选。经典圆领设计，简约百搭，适合日常休闲穿搭。', 'https://via.placeholder.com/400/ff6b6b/ffffff?text=T恤1', 89.00, 159.00, 500, 1258, 1, 0, 1, 'on_sale'),
(2, 1, 4, '潮流印花短袖T恤 国潮设计', '原创国潮印花设计，彰显个性。采用高品质面料，版型修身，细节精致。', 'https://via.placeholder.com/400/ff6b6b/ffffff?text=T恤2', 128.00, 198.00, 300, 856, 1, 1, 1, 'on_sale'),
(3, 1, 5, '商务休闲长袖衬衫 修身版型', '精选优质棉质面料，透气舒适。修身剪裁，展现完美身材比例，适合商务和休闲场合。', 'https://via.placeholder.com/400/ff6b6b/ffffff?text=衬衫1', 199.00, 299.00, 200, 342, 0, 0, 1, 'on_sale'),
(4, 1, 2, '休闲九分裤 潮流锥形裤', '时尚锥形剪裁，修饰腿型。面料柔软亲肤，弹力舒适，不易变形。', 'https://via.placeholder.com/400/ff6b6b/ffffff?text=裤子1', 168.00, 268.00, 400, 675, 1, 0, 0, 'on_sale'),
(5, 1, 3, '秋冬连帽卫衣外套 加绒保暖', '内里加绒设计，保暖舒适。经典连帽款式，搭配拉链开合，方便穿脱。', 'https://via.placeholder.com/400/ff6b6b/ffffff?text=外套1', 258.00, 398.00, 150, 423, 0, 1, 1, 'on_sale'),

-- 时尚女装精品店商品
(6, 2, 6, '复古碎花连衣裙 优雅气质款', '法式复古碎花设计，展现温柔气质。A字版型，修饰身材，适合多种场合。', 'https://via.placeholder.com/400/4ecdc4/ffffff?text=连衣裙1', 299.00, 499.00, 180, 892, 1, 1, 1, 'on_sale'),
(7, 2, 6, '简约小黑裙 职场必备款', '经典小黑裙，永不过时。修身剪裁，凸显女性优雅曲线，职场聚会两相宜。', 'https://via.placeholder.com/400/4ecdc4/ffffff?text=连衣裙2', 358.00, 598.00, 120, 567, 1, 0, 1, 'on_sale'),
(8, 2, 7, '时尚针织套装 温柔两件套', '针织上衣+半身裙组合，温柔知性。柔软舒适的面料，穿着不紧绷。', 'https://via.placeholder.com/400/4ecdc4/ffffff?text=套装1', 468.00, 698.00, 80, 234, 0, 1, 0, 'on_sale'),
(9, 2, 8, '珍珠手提包 精致配饰', '珍珠装饰手提包，提升整体造型。小巧精致，容量适中，实用美观。', 'https://via.placeholder.com/400/4ecdc4/ffffff?text=包包1', 188.00, 288.00, 200, 445, 0, 0, 1, 'on_sale'),
(10, 2, 8, '时尚太阳镜 潮流墨镜', '时尚大框设计，修饰脸型。UV400防紫外线，保护双眼健康。', 'https://via.placeholder.com/400/4ecdc4/ffffff?text=墨镜1', 128.00, 198.00, 300, 678, 1, 0, 0, 'on_sale'),

-- 男装绅士馆商品
(11, 3, 9, '商务正装西服套装 修身款', '精选高档面料，做工精细。修身版型，展现男士沉稳气质，适合正式场合。', 'https://via.placeholder.com/400/45b7d1/ffffff?text=西装1', 1288.00, 1988.00, 50, 123, 0, 0, 1, 'on_sale'),
(12, 3, 9, '休闲小西装 韩版修身', '韩版修身剪裁，时尚百搭。面料挺括有型，适合商务休闲多种场合。', 'https://via.placeholder.com/400/45b7d1/ffffff?text=西装2', 598.00, 898.00, 100, 267, 1, 1, 1, 'on_sale'),
(13, 3, 10, '牛津纺休闲衬衫 文艺范', '经典牛津纺面料，质感上乘。宽松版型，舒适自在，展现文艺气息。', 'https://via.placeholder.com/400/45b7d1/ffffff?text=衬衫2', 198.00, 298.00, 200, 389, 0, 0, 0, 'on_sale'),
(14, 3, 10, '工装风休闲裤 多口袋设计', '工装风设计，实用时尚。多口袋设计，方便收纳。耐磨面料，经久耐用。', 'https://via.placeholder.com/400/45b7d1/ffffff?text=裤子2', 228.00, 358.00, 180, 456, 1, 0, 1, 'on_sale'),

-- 运动潮牌店商品
(15, 4, 11, '透气跑步鞋 轻便运动鞋', '飞织面料，透气轻便。缓震中底，保护双脚。适合跑步、健身等运动。', 'https://via.placeholder.com/400/f7b731/ffffff?text=跑鞋1', 399.00, 599.00, 250, 892, 1, 1, 1, 'on_sale'),
(16, 4, 11, '篮球鞋 高帮缓震款', '高帮设计，保护脚踝。优秀缓震性能，适合篮球运动。耐磨橡胶大底。', 'https://via.placeholder.com/400/f7b731/ffffff?text=篮球鞋', 598.00, 898.00, 150, 534, 1, 0, 1, 'on_sale'),
(17, 4, 12, '速干运动T恤 健身上衣', '速干面料，快速排汗。弹力舒适，运动无束缚。适合各类运动场景。', 'https://via.placeholder.com/400/f7b731/ffffff?text=运动T恤', 128.00, 198.00, 400, 723, 0, 0, 1, 'on_sale'),
(18, 4, 12, '运动卫裤 休闲束脚裤', '柔软舒适面料，贴肤不紧绷。束脚设计，时尚修身。适合运动和日常休闲。', 'https://via.placeholder.com/400/f7b731/ffffff?text=运动裤', 168.00, 258.00, 300, 645, 1, 1, 0, 'on_sale'),

-- 童装乐园商品
(19, 5, 13, '男童卡通印花T恤 纯棉舒适', '可爱卡通印花，孩子喜欢。纯棉面料，柔软亲肤，呵护儿童娇嫩肌肤。', 'https://via.placeholder.com/400/fa8231/ffffff?text=男童T恤', 68.00, 98.00, 300, 567, 1, 0, 1, 'on_sale'),
(20, 5, 13, '男童休闲套装 运动两件套', '运动风休闲套装，活力十足。面料柔软舒适，方便孩子活动玩耍。', 'https://via.placeholder.com/400/fa8231/ffffff?text=男童套装', 158.00, 228.00, 200, 389, 0, 1, 1, 'on_sale'),
(21, 5, 14, '女童公主裙 蓬蓬纱裙', '梦幻公主裙设计，满足女孩的公主梦。蓬蓬纱裙，甜美可爱。', 'https://via.placeholder.com/400/fa8231/ffffff?text=公主裙', 188.00, 298.00, 150, 456, 1, 1, 1, 'on_sale'),
(22, 5, 14, '女童针织开衫 温柔软萌', '温柔针织开衫，柔软舒适。开衫设计方便穿脱，适合春秋季节。', 'https://via.placeholder.com/400/fa8231/ffffff?text=女童开衫', 98.00, 158.00, 250, 342, 0, 0, 0, 'on_sale');

-- ============ 优惠券数据 ============
INSERT INTO coupons (id, store_id, name, type, condition_amount, discount_value, max_discount, total_quantity, received_quantity, used_quantity, valid_days, start_time, end_time, color, status, description) VALUES
-- 平台券
(1, NULL, '新人专享券', 'full_reduction', 99.00, 20.00, NULL, 10000, 1256, 423, 30, '2025-01-01 00:00:00', '2025-12-31 23:59:59', '#ff6b6b', 'active', '新用户专享，满99减20'),
(2, NULL, '全场通用券', 'full_reduction', 199.00, 50.00, NULL, 5000, 834, 267, 15, '2025-01-01 00:00:00', '2025-06-30 23:59:59', '#4ecdc4', 'active', '全场通用，满199减50'),
(3, NULL, '限时折扣券', 'discount', 0.00, 0.88, 100.00, 0, 2345, 1123, 7, '2025-01-01 00:00:00', '2025-03-31 23:59:59', '#f7b731', 'active', '全场8.8折，最高优惠100元'),

-- 门店券
(4, 1, '潮流店铺券', 'full_reduction', 299.00, 80.00, NULL, 1000, 345, 156, NULL, '2025-01-01 00:00:00', '2025-12-31 23:59:59', '#ff6b6b', 'active', '本店专用，满299减80'),
(5, 2, '女装店铺券', 'full_reduction', 399.00, 100.00, NULL, 800, 456, 234, NULL, '2025-01-01 00:00:00', '2025-12-31 23:59:59', '#4ecdc4', 'active', '本店专用，满399减100'),
(6, 3, '男装店铺券', 'full_reduction', 499.00, 150.00, NULL, 500, 234, 89, NULL, '2025-01-01 00:00:00', '2025-12-31 23:59:59', '#45b7d1', 'active', '本店专用，满499减150'),
(7, 4, '运动店铺券', 'discount', 0.00, 0.90, 50.00, 0, 678, 345, NULL, '2025-01-01 00:00:00', '2025-12-31 23:59:59', '#f7b731', 'active', '本店9折，最高优惠50元'),
(8, 5, '童装店铺券', 'full_reduction', 199.00, 40.00, NULL, 1200, 567, 234, NULL, '2025-01-01 00:00:00', '2025-12-31 23:59:59', '#fa8231', 'active', '本店专用，满199减40');

-- ============ 用户优惠券数据 ============
INSERT INTO user_coupons (user_id, coupon_id, order_id, status, received_at, valid_start, valid_end, used_at) VALUES
-- 用户1的优惠券
(1, 1, NULL, 'unused', '2025-01-15 10:00:00', '2025-01-15 10:00:00', '2025-02-14 23:59:59', NULL),
(1, 2, NULL, 'unused', '2025-01-16 14:30:00', '2025-01-16 14:30:00', '2025-01-31 23:59:59', NULL),
(1, 4, NULL, 'unused', '2025-01-17 09:20:00', '2025-01-17 09:20:00', '2025-12-31 23:59:59', NULL),

-- 用户2的优惠券
(2, 1, NULL, 'unused', '2025-01-18 11:00:00', '2025-01-18 11:00:00', '2025-02-17 23:59:59', NULL),
(2, 3, NULL, 'unused', '2025-01-19 15:45:00', '2025-01-19 15:45:00', '2025-01-26 23:59:59', NULL),
(2, 5, NULL, 'unused', '2025-01-20 10:30:00', '2025-01-20 10:30:00', '2025-12-31 23:59:59', NULL),

-- 用户3的优惠券
(3, 1, NULL, 'unused', '2025-01-21 16:00:00', '2025-01-21 16:00:00', '2025-02-20 23:59:59', NULL),
(3, 6, NULL, 'unused', '2025-01-22 12:00:00', '2025-01-22 12:00:00', '2025-12-31 23:59:59', NULL),

-- 用户4的优惠券
(4, 2, NULL, 'unused', '2025-01-23 14:20:00', '2025-01-23 14:20:00', '2025-02-07 23:59:59', NULL),
(4, 7, NULL, 'unused', '2025-01-24 09:50:00', '2025-01-24 09:50:00', '2025-12-31 23:59:59', NULL),

-- 用户5的优惠券
(5, 1, NULL, 'unused', '2025-01-25 11:30:00', '2025-01-25 11:30:00', '2025-02-24 23:59:59', NULL),
(5, 8, NULL, 'unused', '2025-01-26 13:40:00', '2025-01-26 13:40:00', '2025-12-31 23:59:59', NULL);

-- ============ 用户地址数据 ============
INSERT INTO user_addresses (user_id, name, phone, province, city, district, detail, postal_code, is_default) VALUES
(1, '王先生', '13800138001', '北京市', '北京市', '朝阳区', '三里屯SOHO 5号楼 1001室', '100027', TRUE),
(1, '王先生', '13800138001', '北京市', '北京市', '海淀区', '中关村大街1号 科技大厦 808室', '100080', FALSE),
(2, '李小姐', '13800138002', '上海市', '上海市', '静安区', '南京西路1688号 中信泰富广场 3202室', '200040', TRUE),
(3, '张三', '13800138003', '广东省', '广州市', '天河区', '天河路208号 粤海天河城 1506室', '510630', TRUE),
(4, '赵四', '13800138004', '广东省', '深圳市', '南山区', '科技园南区 深圳湾科技生态园 10栋A座 2001室', '518057', TRUE),
(5, '王五', '13800138005', '四川省', '成都市', '锦江区', '红星路三段1号 IFS国际金融中心 1号楼 3501室', '610021', TRUE);

-- ============ 轮播图数据 ============
INSERT INTO banners (title, image_url, link_type, link_id, link_url, sort_order, start_time, end_time, status) VALUES
('新春大促', 'https://via.placeholder.com/750x380/ff6b6b/ffffff?text=新春大促', 'store', 1, NULL, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active'),
('时尚女装专场', 'https://via.placeholder.com/750x380/4ecdc4/ffffff?text=女装专场', 'store', 2, NULL, 2, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active'),
('男装绅士馆', 'https://via.placeholder.com/750x380/45b7d1/ffffff?text=男装馆', 'store', 3, NULL, 3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active'),
('运动潮牌', 'https://via.placeholder.com/750x380/f7b731/ffffff?text=运动潮牌', 'store', 4, NULL, 4, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active'),
('童装乐园', 'https://via.placeholder.com/750x380/fa8231/ffffff?text=童装乐园', 'store', 5, NULL, 5, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active');

-- ============ 动态数据 ============
INSERT INTO posts (id, user_id, content, images, tags, related_product_id, location, like_count, comment_count, collect_count, view_count, status) VALUES
(1, 1, '今天入手了这件潮流T恤，质量超赞！印花设计特别有个性，强烈推荐！', '["https://via.placeholder.com/600/ff6b6b/ffffff?text=Post1-1", "https://via.placeholder.com/600/ff6b6b/ffffff?text=Post1-2"]', '["潮流穿搭", "国潮"]', 2, '北京·三里屯', 156, 23, 45, 2345, 'published'),
(2, 2, '这条连衣裙太美了！法式复古风，穿上超有气质～', '["https://via.placeholder.com/600/4ecdc4/ffffff?text=Post2-1"]', '["女装", "连衣裙", "法式复古"]', 6, '上海·静安寺', 234, 34, 67, 3456, 'published'),
(3, 3, '给自己添置了一套商务西装，面料和做工都很不错，价格也合理。', '["https://via.placeholder.com/600/45b7d1/ffffff?text=Post3-1", "https://via.placeholder.com/600/45b7d1/ffffff?text=Post3-2"]', '["男装", "西装", "商务"]', 11, '广州·天河城', 89, 12, 23, 1234, 'published'),
(4, 4, '跑步新装备get！这双跑鞋真的很轻很透气，跑了5公里脚不累。', '["https://via.placeholder.com/600/f7b731/ffffff?text=Post4-1"]', '["运动", "跑步", "跑鞋"]', 15, '深圳·深圳湾', 312, 45, 89, 4567, 'published'),
(5, 1, '给侄女买的公主裙收到了，小公主穿上美美的，很喜欢！', '["https://via.placeholder.com/600/fa8231/ffffff?text=Post5-1"]', '["童装", "公主裙"]', 21, '北京·朝阳区', 178, 28, 34, 2890, 'published');

-- ============ 关注数据 ============
INSERT INTO follows (follower_user_id, following_type, following_id) VALUES
-- 用户1关注
(1, 'store', 1),
(1, 'store', 2),
(1, 'user', 2),
-- 用户2关注
(2, 'store', 2),
(2, 'store', 5),
(2, 'user', 1),
(2, 'user', 4),
-- 用户3关注
(3, 'store', 3),
(3, 'user', 1),
-- 用户4关注
(4, 'store', 2),
(4, 'store', 4),
(4, 'user', 2),
-- 用户5关注
(5, 'store', 5),
(5, 'user', 1);

-- ============ 用户统计数据 ============
INSERT INTO user_stats (user_id, following_count, follower_count, like_count, post_count, collect_count) VALUES
(1, 3, 4, 334, 2, 12),
(2, 4, 2, 234, 1, 18),
(3, 2, 0, 89, 1, 5),
(4, 3, 1, 312, 1, 8),
(5, 2, 0, 0, 0, 3);

-- ============ 消息数据 ============
INSERT INTO messages (receiver_user_id, sender_user_id, type, title, content, related_type, related_id, is_read) VALUES
(1, NULL, 'system', '欢迎使用', '欢迎来到我们的服装小程序！新用户可领取专属优惠券～', NULL, NULL, FALSE),
(1, 2, 'interaction', '收到新点赞', '用户"购物狂李小姐"赞了你的动态', 'post', 1, FALSE),
(2, NULL, 'system', '优惠券即将过期', '您有一张优惠券将于3天后过期，记得使用哦～', 'coupon', 3, FALSE),
(2, 1, 'interaction', '收到新关注', '用户"时尚达人小王"关注了你', 'user', 1, TRUE),
(3, NULL, 'system', '新品上架', '男装绅士馆上新了多款商务休闲装，快来看看吧！', 'store', 3, FALSE);

-- 数据插入完成提示
SELECT '测试数据插入完成！' AS message;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS store_count FROM stores;
SELECT COUNT(*) AS product_count FROM products;
SELECT COUNT(*) AS coupon_count FROM coupons;
SELECT COUNT(*) AS post_count FROM posts;
