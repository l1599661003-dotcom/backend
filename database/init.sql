-- 创建数据库
CREATE DATABASE IF NOT EXISTS clothing_mini_program CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE clothing_mini_program;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  openid VARCHAR(100) NOT NULL UNIQUE COMMENT '微信openid',
  unionid VARCHAR(100) DEFAULT NULL COMMENT '微信unionid',
  nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  avatar VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  total_points INT UNSIGNED DEFAULT 0 COMMENT '总积分',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_openid (openid),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 门店表
CREATE TABLE IF NOT EXISTS stores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '门店ID',
  name VARCHAR(100) NOT NULL COMMENT '门店名称',
  logo_url VARCHAR(500) DEFAULT NULL COMMENT 'Logo图片',
  cover_image VARCHAR(500) DEFAULT NULL COMMENT '封面图片/橱窗图',
  address VARCHAR(200) DEFAULT NULL COMMENT '地址',
  latitude DECIMAL(10, 7) DEFAULT NULL COMMENT '纬度',
  longitude DECIMAL(10, 7) DEFAULT NULL COMMENT '经度',
  phone VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  rating DECIMAL(3, 2) DEFAULT 5.00 COMMENT '评分',
  open_hours VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  business_status ENUM('open', 'closed', 'busy') DEFAULT 'open' COMMENT '营业状态：营业中/休息中/繁忙',
  monthly_sales INT UNSIGNED DEFAULT 0 COMMENT '月销量',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_status (status),
  INDEX idx_business_status (business_status),
  INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店表';

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
  store_id INT UNSIGNED NOT NULL COMMENT '所属门店ID',
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  parent_id INT UNSIGNED DEFAULT 0 COMMENT '父分类ID',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store_id (store_id),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
  store_id INT UNSIGNED NOT NULL COMMENT '所属门店ID',
  category_id INT UNSIGNED DEFAULT NULL COMMENT '分类ID',
  title VARCHAR(200) NOT NULL COMMENT '商品标题',
  description TEXT COMMENT '商品描述',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '主图',
  image_list JSON COMMENT '图片列表',
  price DECIMAL(10, 2) NOT NULL COMMENT '现价',
  original_price DECIMAL(10, 2) DEFAULT NULL COMMENT '原价',
  stock INT UNSIGNED DEFAULT 0 COMMENT '库存',
  sales INT UNSIGNED DEFAULT 0 COMMENT '销量',
  sku_info JSON COMMENT '规格信息',
  is_hot TINYINT(1) DEFAULT 0 COMMENT '是否热门',
  is_new TINYINT(1) DEFAULT 0 COMMENT '是否新品',
  is_recommended TINYINT(1) DEFAULT 0 COMMENT '是否推荐',
  status ENUM('on_sale', 'off_sale') DEFAULT 'on_sale' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_store_id (store_id),
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_is_hot (is_hot),
  INDEX idx_is_new (is_new),
  INDEX idx_is_recommended (is_recommended),
  FULLTEXT idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 购物车表
CREATE TABLE IF NOT EXISTS carts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '购物车ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  items JSON COMMENT '购物车项',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
  order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  store_id INT UNSIGNED NOT NULL COMMENT '门店ID',
  total_amount DECIMAL(10, 2) NOT NULL COMMENT '订单总额',
  pay_amount DECIMAL(10, 2) NOT NULL COMMENT '实付金额',
  points_used INT UNSIGNED DEFAULT 0 COMMENT '使用积分',
  status ENUM('pending', 'paid', 'delivering', 'delivered', 'completed', 'cancelled', 'refunding', 'refunded') DEFAULT 'pending' COMMENT '订单状态',
  deliver_type VARCHAR(50) DEFAULT NULL COMMENT '配送方式',
  deliver_time_expected TIMESTAMP NULL DEFAULT NULL COMMENT '预计配送时间',
  receiver_name VARCHAR(50) DEFAULT NULL COMMENT '收货人',
  receiver_phone VARCHAR(20) DEFAULT NULL COMMENT '收货电话',
  receiver_address VARCHAR(200) DEFAULT NULL COMMENT '收货地址',
  remark TEXT COMMENT '备注',
  paid_at TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_store_id (store_id),
  INDEX idx_status (status),
  INDEX idx_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 订单商品表
CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  order_id INT UNSIGNED NOT NULL COMMENT '订单ID',
  product_id INT UNSIGNED NOT NULL COMMENT '商品ID',
  sku_id VARCHAR(50) DEFAULT NULL COMMENT '规格ID',
  product_title VARCHAR(200) NOT NULL COMMENT '商品标题',
  product_image VARCHAR(500) DEFAULT NULL COMMENT '商品图片',
  sku_name VARCHAR(100) DEFAULT NULL COMMENT '规格名称',
  qty INT UNSIGNED NOT NULL COMMENT '数量',
  price DECIMAL(10, 2) NOT NULL COMMENT '单价',
  total_price DECIMAL(10, 2) NOT NULL COMMENT '小计',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单商品表';

-- 配送单表
CREATE TABLE IF NOT EXISTS deliveries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '配送单ID',
  order_id INT UNSIGNED NOT NULL COMMENT '订单ID',
  deliverer_id INT UNSIGNED DEFAULT NULL COMMENT '配送员ID',
  status ENUM('pending', 'picking', 'delivering', 'delivered') DEFAULT 'pending' COMMENT '配送状态',
  pick_time TIMESTAMP NULL DEFAULT NULL COMMENT '取货时间',
  arrive_time TIMESTAMP NULL DEFAULT NULL COMMENT '送达时间',
  tracking_info TEXT COMMENT '跟踪信息',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_deliverer_id (deliverer_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='配送单表';

-- 退货表
CREATE TABLE IF NOT EXISTS returns (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '退货ID',
  order_id INT UNSIGNED NOT NULL COMMENT '订单ID',
  reason VARCHAR(500) DEFAULT NULL COMMENT '退货原因',
  images JSON COMMENT '图片证据',
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending' COMMENT '退货状态',
  apply_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  processed_time TIMESTAMP NULL DEFAULT NULL COMMENT '处理时间',
  refund_amount DECIMAL(10, 2) DEFAULT NULL COMMENT '退款金额',
  admin_remark TEXT COMMENT '管理员备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='退货表';

-- 邀请表
CREATE TABLE IF NOT EXISTS invitations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '邀请ID',
  inviter_user_id INT UNSIGNED NOT NULL COMMENT '邀请人ID',
  invitee_user_id INT UNSIGNED NOT NULL COMMENT '被邀请人ID',
  reward_points INT UNSIGNED DEFAULT 0 COMMENT '奖励积分',
  status ENUM('pending', 'completed') DEFAULT 'pending' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (inviter_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invitee_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_inviter (inviter_user_id),
  INDEX idx_invitee (invitee_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邀请表';

-- 积分流水表
CREATE TABLE IF NOT EXISTS points_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '流水ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  `change` INT NOT NULL COMMENT '积分变化',
  type VARCHAR(50) NOT NULL COMMENT '变化类型',
  `desc` VARCHAR(200) DEFAULT NULL COMMENT '描述',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分流水表';

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID',
  user_id INT UNSIGNED DEFAULT NULL COMMENT '关联用户ID',
  store_id INT UNSIGNED DEFAULT NULL COMMENT '关联门店ID',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  role ENUM('super_admin', 'platform_admin', 'store_admin', 'deliverer') DEFAULT 'store_admin' COMMENT '角色',
  permissions JSON COMMENT '权限列表',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '评价ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  order_id INT UNSIGNED NOT NULL COMMENT '订单ID',
  store_id INT UNSIGNED NOT NULL COMMENT '门店ID',
  product_id INT UNSIGNED NOT NULL COMMENT '商品ID',
  rating INT UNSIGNED DEFAULT 5 COMMENT '评分(1-5)',
  content TEXT COMMENT '评价内容',
  images JSON COMMENT '晒单图片',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_id (order_id),
  INDEX idx_store_id (store_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价表';

-- ============ 新版本2.0新增表 ============

-- 关注表
CREATE TABLE IF NOT EXISTS follows (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '关注ID',
  follower_user_id INT UNSIGNED NOT NULL COMMENT '关注者用户ID',
  following_type ENUM('user', 'store') NOT NULL COMMENT '关注类型',
  following_id INT UNSIGNED NOT NULL COMMENT '被关注对象ID（用户ID或店铺ID）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (follower_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_follow (follower_user_id, following_type, following_id),
  INDEX idx_follower (follower_user_id),
  INDEX idx_following (following_type, following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注表';

-- 动态表
CREATE TABLE IF NOT EXISTS posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '动态ID',
  user_id INT UNSIGNED NOT NULL COMMENT '发布者用户ID',
  content TEXT COMMENT '动态文字内容',
  images JSON COMMENT '图片列表',
  tags JSON COMMENT '话题标签',
  related_product_id INT UNSIGNED DEFAULT NULL COMMENT '关联商品ID',
  location VARCHAR(255) DEFAULT NULL COMMENT '地理位置',
  like_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  comment_count INT UNSIGNED DEFAULT 0 COMMENT '评论数',
  collect_count INT UNSIGNED DEFAULT 0 COMMENT '收藏数',
  view_count INT UNSIGNED DEFAULT 0 COMMENT '浏览数',
  status ENUM('published', 'draft', 'deleted') DEFAULT 'published' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  FULLTEXT idx_content (content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态表';

-- 动态点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  post_id INT UNSIGNED NOT NULL COMMENT '动态ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_post_user (post_id, user_id),
  INDEX idx_post (post_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态点赞表';

-- 动态评论表
CREATE TABLE IF NOT EXISTS post_comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID',
  post_id INT UNSIGNED NOT NULL COMMENT '动态ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  content TEXT NOT NULL COMMENT '评论内容',
  parent_comment_id INT UNSIGNED DEFAULT NULL COMMENT '父评论ID（回复功能）',
  like_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_post (post_id),
  INDEX idx_user (user_id),
  INDEX idx_parent (parent_comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态评论表';

-- 动态收藏表
CREATE TABLE IF NOT EXISTS post_collects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  post_id INT UNSIGNED NOT NULL COMMENT '动态ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_post_user (post_id, user_id),
  INDEX idx_user (user_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态收藏表';

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '消息ID',
  receiver_user_id INT UNSIGNED NOT NULL COMMENT '接收者用户ID',
  sender_user_id INT UNSIGNED DEFAULT NULL COMMENT '发送者用户ID（系统消息为NULL）',
  type ENUM('system', 'order', 'interaction', 'customer_service') NOT NULL COMMENT '消息类型',
  title VARCHAR(255) DEFAULT NULL COMMENT '消息标题',
  content TEXT COMMENT '消息内容',
  related_type VARCHAR(50) DEFAULT NULL COMMENT '关联类型（order/post/comment）',
  related_id INT UNSIGNED DEFAULT NULL COMMENT '关联ID',
  is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (receiver_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_receiver (receiver_user_id, is_read),
  INDEX idx_type (type),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- 活动轮播表
CREATE TABLE IF NOT EXISTS banners (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '轮播ID',
  title VARCHAR(255) NOT NULL COMMENT '标题',
  image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
  link_type ENUM('store', 'product', 'post', 'activity', 'url') NOT NULL COMMENT '链接类型',
  link_id INT UNSIGNED DEFAULT NULL COMMENT '链接ID',
  link_url VARCHAR(500) DEFAULT NULL COMMENT '外部链接',
  sort_order INT DEFAULT 0 COMMENT '排序',
  start_time TIMESTAMP NULL DEFAULT NULL COMMENT '开始时间',
  end_time TIMESTAMP NULL DEFAULT NULL COMMENT '结束时间',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_status (status, sort_order),
  INDEX idx_time (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动轮播表';

-- 用户统计表
CREATE TABLE IF NOT EXISTS user_stats (
  user_id INT UNSIGNED PRIMARY KEY COMMENT '用户ID',
  following_count INT UNSIGNED DEFAULT 0 COMMENT '关注数（关注的店铺+用户）',
  follower_count INT UNSIGNED DEFAULT 0 COMMENT '粉丝数',
  like_count INT UNSIGNED DEFAULT 0 COMMENT '获赞数（动态+评论）',
  post_count INT UNSIGNED DEFAULT 0 COMMENT '动态数',
  collect_count INT UNSIGNED DEFAULT 0 COMMENT '收藏数',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户统计表';

-- ============ 新版本3.0新增表 ============

-- 用户地址表
CREATE TABLE IF NOT EXISTS user_addresses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '地址ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
  province VARCHAR(50) DEFAULT NULL COMMENT '省份',
  city VARCHAR(50) DEFAULT NULL COMMENT '城市',
  district VARCHAR(50) DEFAULT NULL COMMENT '区/县',
  detail VARCHAR(200) NOT NULL COMMENT '详细地址',
  postal_code VARCHAR(20) DEFAULT NULL COMMENT '邮政编码',
  is_default BOOLEAN DEFAULT FALSE COMMENT '是否默认地址',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_default (user_id, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户地址表';

-- 优惠券表
CREATE TABLE IF NOT EXISTS coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '优惠券ID',
  store_id INT UNSIGNED DEFAULT NULL COMMENT '门店ID（NULL表示平台券）',
  name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  type ENUM('full_reduction', 'discount', 'fixed') NOT NULL COMMENT '类型：满减/折扣/固定金额',
  condition_amount DECIMAL(10, 2) DEFAULT 0.00 COMMENT '使用门槛金额',
  discount_value DECIMAL(10, 2) NOT NULL COMMENT '优惠值（满减金额/折扣率/固定金额）',
  max_discount DECIMAL(10, 2) DEFAULT NULL COMMENT '最大优惠金额（折扣券）',
  total_quantity INT UNSIGNED DEFAULT 0 COMMENT '发行总量（0表示无限）',
  received_quantity INT UNSIGNED DEFAULT 0 COMMENT '已领取数量',
  used_quantity INT UNSIGNED DEFAULT 0 COMMENT '已使用数量',
  valid_days INT UNSIGNED DEFAULT NULL COMMENT '有效天数（领取后）',
  start_time TIMESTAMP NULL DEFAULT NULL COMMENT '有效期开始时间',
  end_time TIMESTAMP NULL DEFAULT NULL COMMENT '有效期结束时间',
  color VARCHAR(20) DEFAULT NULL COMMENT '优惠券颜色',
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active' COMMENT '状态',
  description TEXT COMMENT '使用说明',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store (store_id),
  INDEX idx_status (status),
  INDEX idx_time (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';

-- 用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  coupon_id INT UNSIGNED NOT NULL COMMENT '优惠券ID',
  order_id INT UNSIGNED DEFAULT NULL COMMENT '使用的订单ID',
  status ENUM('unused', 'used', 'expired') DEFAULT 'unused' COMMENT '状态',
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
  valid_start TIMESTAMP NULL DEFAULT NULL COMMENT '有效期开始',
  valid_end TIMESTAMP NULL DEFAULT NULL COMMENT '有效期结束',
  used_at TIMESTAMP NULL DEFAULT NULL COMMENT '使用时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_user (user_id, status),
  INDEX idx_coupon (coupon_id),
  INDEX idx_valid (valid_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户优惠券表';

-- 秒杀活动表
CREATE TABLE IF NOT EXISTS seckill_activities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '秒杀活动ID',
  product_id INT UNSIGNED NOT NULL COMMENT '商品ID',
  store_id INT UNSIGNED NOT NULL COMMENT '门店ID',
  title VARCHAR(200) NOT NULL COMMENT '活动标题',
  seckill_price DECIMAL(10, 2) NOT NULL COMMENT '秒杀价',
  original_price DECIMAL(10, 2) NOT NULL COMMENT '原价',
  total_stock INT UNSIGNED NOT NULL COMMENT '秒杀库存',
  sold_count INT UNSIGNED DEFAULT 0 COMMENT '已售数量',
  limit_per_user INT UNSIGNED DEFAULT 1 COMMENT '每人限购数量',
  start_time TIMESTAMP NOT NULL COMMENT '开始时间',
  end_time TIMESTAMP NOT NULL COMMENT '结束时间',
  status ENUM('pending', 'active', 'ended', 'cancelled') DEFAULT 'pending' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_product (product_id),
  INDEX idx_store (store_id),
  INDEX idx_status (status),
  INDEX idx_time (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='秒杀活动表';

-- 秒杀订单记录表
CREATE TABLE IF NOT EXISTS seckill_records (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  seckill_id INT UNSIGNED NOT NULL COMMENT '秒杀活动ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  order_id INT UNSIGNED DEFAULT NULL COMMENT '订单ID',
  quantity INT UNSIGNED NOT NULL COMMENT '购买数量',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (seckill_id) REFERENCES seckill_activities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_seckill_user (seckill_id, user_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='秒杀订单记录表';

-- 拼团活动表
CREATE TABLE IF NOT EXISTS group_buy_activities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '拼团活动ID',
  product_id INT UNSIGNED NOT NULL COMMENT '商品ID',
  store_id INT UNSIGNED NOT NULL COMMENT '门店ID',
  title VARCHAR(200) NOT NULL COMMENT '活动标题',
  group_price DECIMAL(10, 2) NOT NULL COMMENT '拼团价',
  original_price DECIMAL(10, 2) NOT NULL COMMENT '原价',
  required_people INT UNSIGNED NOT NULL COMMENT '成团人数',
  valid_hours INT UNSIGNED NOT NULL COMMENT '拼团有效时长（小时）',
  total_stock INT UNSIGNED DEFAULT NULL COMMENT '总库存',
  sold_count INT UNSIGNED DEFAULT 0 COMMENT '已售数量',
  start_time TIMESTAMP NOT NULL COMMENT '开始时间',
  end_time TIMESTAMP NOT NULL COMMENT '结束时间',
  status ENUM('pending', 'active', 'ended', 'cancelled') DEFAULT 'pending' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_product (product_id),
  INDEX idx_store (store_id),
  INDEX idx_status (status),
  INDEX idx_time (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼团活动表';

-- 拼团团队表
CREATE TABLE IF NOT EXISTS group_buy_teams (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '团队ID',
  group_buy_id INT UNSIGNED NOT NULL COMMENT '拼团活动ID',
  leader_user_id INT UNSIGNED NOT NULL COMMENT '团长用户ID',
  required_people INT UNSIGNED NOT NULL COMMENT '需要人数',
  current_people INT UNSIGNED DEFAULT 1 COMMENT '当前人数',
  status ENUM('in_progress', 'success', 'failed') DEFAULT 'in_progress' COMMENT '状态',
  expire_at TIMESTAMP NOT NULL COMMENT '过期时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (group_buy_id) REFERENCES group_buy_activities(id) ON DELETE CASCADE,
  FOREIGN KEY (leader_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_activity (group_buy_id),
  INDEX idx_leader (leader_user_id),
  INDEX idx_status (status),
  INDEX idx_expire (expire_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼团团队表';

-- 拼团参与记录表
CREATE TABLE IF NOT EXISTS group_buy_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  team_id INT UNSIGNED NOT NULL COMMENT '团队ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  order_id INT UNSIGNED DEFAULT NULL COMMENT '订单ID',
  is_leader BOOLEAN DEFAULT FALSE COMMENT '是否团长',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '参团时间',
  FOREIGN KEY (team_id) REFERENCES group_buy_teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  UNIQUE KEY uk_team_user (team_id, user_id),
  INDEX idx_team (team_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼团参与记录表';

-- 会员卡表
CREATE TABLE IF NOT EXISTS membership_cards (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '会员卡ID',
  store_id INT UNSIGNED DEFAULT NULL COMMENT '门店ID（NULL表示平台会员卡）',
  name VARCHAR(100) NOT NULL COMMENT '会员卡名称',
  level ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond') NOT NULL COMMENT '等级',
  price DECIMAL(10, 2) NOT NULL COMMENT '售价',
  valid_days INT UNSIGNED NOT NULL COMMENT '有效期天数',
  discount_rate DECIMAL(3, 2) DEFAULT NULL COMMENT '折扣率（0.90表示9折）',
  benefits JSON COMMENT '会员权益描述',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store (store_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员卡表';

-- 用户会员卡表
CREATE TABLE IF NOT EXISTS user_memberships (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  card_id INT UNSIGNED NOT NULL COMMENT '会员卡ID',
  order_id INT UNSIGNED DEFAULT NULL COMMENT '购买订单ID',
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active' COMMENT '状态',
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '激活时间',
  expire_at TIMESTAMP NOT NULL COMMENT '过期时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES membership_cards(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_user (user_id, status),
  INDEX idx_card (card_id),
  INDEX idx_expire (expire_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会员卡表';

-- 用户等级表
CREATE TABLE IF NOT EXISTS user_levels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '等级ID',
  level INT UNSIGNED NOT NULL UNIQUE COMMENT '等级数字',
  name VARCHAR(50) NOT NULL COMMENT '等级名称',
  min_points INT UNSIGNED NOT NULL COMMENT '所需最小积分',
  max_points INT UNSIGNED DEFAULT NULL COMMENT '所需最大积分',
  icon_url VARCHAR(500) DEFAULT NULL COMMENT '等级图标',
  benefits JSON COMMENT '等级权益',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_level (level),
  INDEX idx_points (min_points, max_points)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户等级配置表';

-- 商品收藏表
CREATE TABLE IF NOT EXISTS product_collects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  product_id INT UNSIGNED NOT NULL COMMENT '商品ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_product (user_id, product_id),
  INDEX idx_user (user_id),
  INDEX idx_product (product_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品收藏表';
