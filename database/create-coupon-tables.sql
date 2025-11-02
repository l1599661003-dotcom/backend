-- 创建优惠券相关表
USE clothing_mini_program;

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
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active' COMMENT '状态',
  description TEXT COMMENT '使用说明',
  color VARCHAR(20) DEFAULT '#e74c3c' COMMENT '颜色',
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
