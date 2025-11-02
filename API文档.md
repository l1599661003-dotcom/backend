# 本地衣物整合小程序 API 文档

**基础URL**: `http://localhost:3000`

**版本**: v1.0

---

## 📌 通用说明

### 请求头

所有需要认证的接口需要在请求头中携带Token：

```
Authorization: Bearer {token}
```

### 响应格式

所有接口统一返回JSON格式：

#### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... },
  "timestamp": "2025-10-27T10:00:00.000Z"
}
```

#### 失败响应
```json
{
  "success": false,
  "message": "错误信息",
  "code": 400,
  "timestamp": "2025-10-27T10:00:00.000Z"
}
```

---

## 🔐 一、用户认证模块

### 1.1 微信登录

**POST** `/api/auth/wx_login`

**描述**: 微信小程序登录，获取用户信息和Token

**请求体**:
```json
{
  "code": "微信登录code",
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "头像URL",
    "openId": "openid"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "openid": "oXXXX...",
      "nickname": "微信用户",
      "avatar": "https://...",
      "phone": null,
      "totalPoints": 50
    }
  }
}
```

---

### 1.2 获取当前用户信息

**GET** `/api/auth/user`

**认证**: 需要

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "openid": "oXXXX...",
    "nickname": "微信用户",
    "avatar": "https://...",
    "phone": "13800138000",
    "totalPoints": 150,
    "createdAt": "2025-10-27T10:00:00.000Z"
  }
}
```

---

### 1.3 更新用户信息

**PUT** `/api/auth/user`

**认证**: 需要

**请求体**:
```json
{
  "nickname": "新昵称",
  "avatar": "新头像URL",
  "phone": "13800138000"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nickname": "新昵称",
    "avatar": "新头像URL",
    "phone": "13800138000",
    "totalPoints": 150
  }
}
```

---

### 1.4 绑定手机号

**POST** `/api/auth/bind-phone`

**认证**: 需要

**请求体**:
```json
{
  "phone": "13800138000"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "phone": "13800138000"
  }
}
```

---

### 1.5 获取用户积分

**GET** `/api/auth/points`

**认证**: 需要

**响应**:
```json
{
  "success": true,
  "data": {
    "totalPoints": 150
  }
}
```

---

## 🏪 二、店铺管理模块

### 2.1 获取店铺列表

**GET** `/api/stores`

**认证**: 可选

**查询参数**:
- `lat` (number, 可选): 用户纬度
- `lng` (number, 可选): 用户经度
- `radius` (number, 可选): 搜索半径（公里），默认10
- `sort` (string, 可选): 排序方式 `distance|rating|newest`，默认distance
- `page` (number, 可选): 页码，默认1
- `pageSize` (number, 可选): 每页数量，默认20

**示例**: `/api/stores?lat=39.9042&lng=116.4074&sort=rating&page=1&pageSize=10`

**响应**:
```json
{
  "success": true,
  "data": {
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "list": [
      {
        "id": 1,
        "name": "优衣库旗舰店",
        "logoUrl": "https://...",
        "address": "北京市朝阳区xxx",
        "phone": "010-12345678",
        "rating": 4.8,
        "openHours": "09:00-22:00",
        "distance": 1.5
      }
    ]
  }
}
```

---

### 2.2 获取店铺详情

**GET** `/api/stores/:id`

**认证**: 可选

**路径参数**:
- `id` (number): 店铺ID

**示例**: `/api/stores/1`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "优衣库旗舰店",
    "logoUrl": "https://...",
    "address": "北京市朝阳区xxx",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "phone": "010-12345678",
    "rating": 4.8,
    "openHours": "09:00-22:00",
    "productCount": 156
  }
}
```

---

### 2.3 搜索店铺

**GET** `/api/stores/search`

**认证**: 可选

**查询参数**:
- `q` (string, 必需): 搜索关键词
- `page` (number, 可选): 页码，默认1
- `pageSize` (number, 可选): 每页数量，默认20

**示例**: `/api/stores/search?q=优衣库&page=1`

**响应**:
```json
{
  "success": true,
  "data": {
    "total": 3,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "list": [
      {
        "id": 1,
        "name": "优衣库旗舰店",
        "logoUrl": "https://...",
        "address": "北京市朝阳区xxx",
        "rating": 4.8
      }
    ]
  }
}
```

---

## 👔 三、商品管理模块

### 3.1 获取店铺商品列表

**GET** `/api/stores/:storeId/products`

**认证**: 可选

**路径参数**:
- `storeId` (number): 店铺ID

**查询参数**:
- `categoryId` (number, 可选): 分类ID
- `q` (string, 可选): 搜索关键词
- `sort` (string, 可选): 排序方式 `newest|price_asc|price_desc|sales`，默认newest
- `page` (number, 可选): 页码，默认1
- `pageSize` (number, 可选): 每页数量，默认20

**示例**: `/api/stores/1/products?sort=sales&page=1`

**响应**:
```json
{
  "success": true,
  "data": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "list": [
      {
        "id": 1,
        "storeId": 1,
        "title": "纯棉T恤 男女同款",
        "mainImage": "https://...",
        "price": 99.00,
        "originalPrice": 129.00,
        "stock": 500,
        "sales": 1200
      }
    ]
  }
}
```

---

### 3.2 获取商品详情

**GET** `/api/products/:id`

**认证**: 可选

**路径参数**:
- `id` (number): 商品ID

**示例**: `/api/products/1`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "storeId": 1,
    "categoryId": 10,
    "title": "纯棉T恤 男女同款",
    "description": "100%纯棉，舒适透气...",
    "mainImage": "https://...",
    "imageList": [
      "https://...",
      "https://..."
    ],
    "price": 99.00,
    "originalPrice": 129.00,
    "stock": 500,
    "sales": 1200,
    "skuInfo": [
      {
        "name": "颜色",
        "value": "白色",
        "price": 99.00,
        "stock": 200
      },
      {
        "name": "尺码",
        "value": "M",
        "price": 99.00,
        "stock": 150
      }
    ],
    "store": {
      "id": 1,
      "name": "优衣库旗舰店",
      "logoUrl": "https://...",
      "rating": 4.8
    }
  }
}
```

---

### 3.3 搜索商品

**GET** `/api/products/search`

**认证**: 可选

**查询参数**:
- `q` (string, 必需): 搜索关键词
- `page` (number, 可选): 页码，默认1
- `pageSize` (number, 可选): 每页数量，默认20

**示例**: `/api/products/search?q=T恤&page=1`

**响应**:
```json
{
  "success": true,
  "data": {
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3,
    "list": [
      {
        "id": 1,
        "storeId": 1,
        "title": "纯棉T恤 男女同款",
        "mainImage": "https://...",
        "price": 99.00,
        "originalPrice": 129.00,
        "sales": 1200
      }
    ]
  }
}
```

---

### 3.4 获取热门商品

**GET** `/api/products/hot`

**认证**: 可选

**查询参数**:
- `limit` (number, 可选): 返回数量，默认10

**示例**: `/api/products/hot?limit=5`

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "纯棉T恤 男女同款",
      "mainImage": "https://...",
      "price": 99.00,
      "sales": 1200
    }
  ]
}
```

---

## 📝 四、待开发模块

### 4.1 购物车模块
- GET `/api/cart` - 获取购物车
- POST `/api/cart` - 添加到购物车
- PUT `/api/cart/:itemId` - 更新购物车项
- DELETE `/api/cart/:itemId` - 删除购物车项

### 4.2 订单模块
- POST `/api/orders` - 创建订单
- GET `/api/orders` - 获取订单列表
- GET `/api/orders/:id` - 获取订单详情
- POST `/api/orders/:id/pay` - 支付订单
- POST `/api/orders/:id/cancel` - 取消订单

### 4.3 微信支付
- POST `/api/payment/unifiedorder` - 统一下单
- POST `/api/payment/notify` - 支付回调
- POST `/api/payment/refund` - 申请退款

### 4.4 配送管理
- POST `/api/delivery` - 创建配送单
- PUT `/api/delivery/:id/status` - 更新配送状态
- GET `/api/delivery/:orderId` - 查询配送信息

### 4.5 退货售后
- POST `/api/returns` - 申请退货
- GET `/api/returns/:orderId` - 查询退货状态
- PUT `/api/returns/:id/process` - 处理退货

### 4.6 积分与邀请
- GET `/api/points/log` - 积分流水
- POST `/api/invite` - 生成邀请
- GET `/api/invite/list` - 邀请列表

---

## 🔧 错误码说明

| 错误码 | 说明 |
|-------|------|
| 400 | 请求参数错误 |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 📚 使用示例

### 使用Axios调用

```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
});

// 请求拦截器 - 添加Token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
instance.interceptors.response.use(
  response => response.data,
  error => {
    console.error('请求失败:', error);
    return Promise.reject(error);
  }
);

// 使用示例
async function login(code) {
  const res = await instance.post('/api/auth/wx_login', { code });
  localStorage.setItem('token', res.data.token);
  return res.data.user;
}

async function getStores() {
  const res = await instance.get('/api/stores', {
    params: { lat: 39.9042, lng: 116.4074 }
  });
  return res.data;
}
```

---

**更新时间**: 2025-10-27
**文档状态**: 核心API已完成，其他模块开发中
