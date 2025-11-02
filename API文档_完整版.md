# 本地衣物整合小程序 API 文档（完整版）

**基础URL**: `http://localhost:3000`
**版本**: v1.1
**更新日期**: 2025-10-27

---

## 📝 更新日志

- **v1.1** (2025-10-27): 新增购物车模块和订单模块
- **v1.0** (2025-10-27): 初始版本，包含用户认证、店铺、商品模块

---

## 🎯 核心功能API（已完成）

### ✅ 已实现的模块
1. **用户认证模块** - 5个接口
2. **店铺管理模块** - 3个接口
3. **商品管理模块** - 4个接口
4. **购物车模块** - 7个接口 🆕
5. **订单模块** - 5个接口 🆕

**总计**: **24个API接口**

---

## 📌 四、购物车模块 🆕

### 4.1 获取购物车

**GET** `/api/cart`

**认证**: 需要

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": 1,
        "skuId": "sku001",
        "title": "纯棉T恤 男女同款",
        "mainImage": "https://...",
        "price": 99.00,
        "qty": 2,
        "selected": true,
        "stock": 500
      }
    ],
    "totalCount": 5,
    "selectedCount": 3,
    "totalPrice": 297.00
  }
}
```

---

### 4.2 添加商品到购物车

**POST** `/api/cart`

**认证**: 需要

**请求体**:
```json
{
  "productId": 1,
  "qty": 2,
  "skuId": "sku001"
}
```

**响应**:
```json
{
  "success": true,
  "message": "添加成功",
  "data": {
    "items": [...],
    "totalCount": 5,
    "selectedCount": 3,
    "totalPrice": 297.00
  }
}
```

---

### 4.3 更新购物车商品数量

**PUT** `/api/cart/:productId`

**认证**: 需要

**路径参数**:
- `productId` (number): 商品ID

**请求体**:
```json
{
  "qty": 3,
  "skuId": "sku001"
}
```

**响应**:
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "items": [...],
    "totalCount": 6,
    "selectedCount": 4,
    "totalPrice": 396.00
  }
}
```

---

### 4.4 删除购物车商品

**DELETE** `/api/cart/:productId?skuId=xxx`

**认证**: 需要

**路径参数**:
- `productId` (number): 商品ID

**查询参数**:
- `skuId` (string, 可选): SKU ID

**响应**:
```json
{
  "success": true,
  "message": "删除成功",
  "data": {
    "items": [...],
    "totalCount": 3,
    "selectedCount": 2,
    "totalPrice": 198.00
  }
}
```

---

### 4.5 切换商品选中状态

**PUT** `/api/cart/:productId/select`

**认证**: 需要

**路径参数**:
- `productId` (number): 商品ID

**请求体**:
```json
{
  "selected": true,
  "skuId": "sku001"
}
```

**响应**:
```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    "items": [...],
    "selectedCount": 3,
    "totalPrice": 297.00
  }
}
```

---

### 4.6 全选/全不选

**PUT** `/api/cart/select-all`

**认证**: 需要

**请求体**:
```json
{
  "selected": true
}
```

**响应**:
```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    "items": [...],
    "selectedCount": 5,
    "totalPrice": 495.00
  }
}
```

---

### 4.7 清空购物车

**DELETE** `/api/cart`

**认证**: 需要

**响应**:
```json
{
  "success": true,
  "message": "清空成功",
  "data": {
    "items": [],
    "totalCount": 0,
    "selectedCount": 0,
    "totalPrice": 0
  }
}
```

---

## 📦 五、订单模块 🆕

### 5.1 创建订单

**POST** `/api/orders`

**认证**: 需要

**请求体**:
```json
{
  "storeId": 1,
  "items": [
    {
      "productId": 1,
      "skuId": "sku001",
      "qty": 2
    },
    {
      "productId": 2,
      "qty": 1
    }
  ],
  "deliverType": "当天配送",
  "receiverName": "张三",
  "receiverPhone": "13800138000",
  "receiverAddress": "北京市朝阳区xxx小区xxx号",
  "remark": "请在下午3点前送达",
  "pointsUsed": 50
}
```

**响应**:
```json
{
  "success": true,
  "message": "订单创建成功",
  "data": {
    "orderId": 123,
    "orderNo": "2025102715301234",
    "payAmount": 248.00
  }
}
```

---

### 5.2 获取订单列表

**GET** `/api/orders`

**认证**: 需要

**查询参数**:
- `status` (string, 可选): 订单状态 `pending|paid|delivering|delivered|completed|cancelled|refunding|refunded`
- `page` (number, 可选): 页码，默认1
- `pageSize` (number, 可选): 每页数量，默认20

**示例**: `/api/orders?status=pending&page=1&pageSize=10`

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
        "id": 123,
        "orderNo": "2025102715301234",
        "status": "pending",
        "totalAmount": 298.00,
        "payAmount": 248.00,
        "pointsUsed": 50,
        "deliverType": "当天配送",
        "receiverName": "张三",
        "receiverPhone": "13800138000",
        "receiverAddress": "北京市朝阳区xxx",
        "createdAt": "2025-10-27T15:30:00.000Z",
        "store": {
          "id": 1,
          "name": "优衣库旗舰店",
          "logoUrl": "https://..."
        },
        "items": [
          {
            "id": 1,
            "productId": 1,
            "productTitle": "纯棉T恤",
            "productImage": "https://...",
            "qty": 2,
            "price": 99.00,
            "totalPrice": 198.00
          }
        ]
      }
    ]
  }
}
```

---

### 5.3 获取订单详情

**GET** `/api/orders/:id`

**认证**: 需要

**路径参数**:
- `id` (number): 订单ID

**示例**: `/api/orders/123`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "orderNo": "2025102715301234",
    "status": "pending",
    "totalAmount": 298.00,
    "payAmount": 248.00,
    "pointsUsed": 50,
    "deliverType": "当天配送",
    "deliverTimeExpected": "2025-10-27T18:00:00.000Z",
    "receiverName": "张三",
    "receiverPhone": "13800138000",
    "receiverAddress": "北京市朝阳区xxx小区xxx号",
    "remark": "请在下午3点前送达",
    "paidAt": null,
    "createdAt": "2025-10-27T15:30:00.000Z",
    "updatedAt": "2025-10-27T15:30:00.000Z",
    "store": {
      "id": 1,
      "name": "优衣库旗舰店",
      "logoUrl": "https://...",
      "phone": "010-12345678",
      "address": "北京市朝阳区xxx"
    },
    "items": [
      {
        "id": 1,
        "productId": 1,
        "skuId": "sku001",
        "productTitle": "纯棉T恤 男女同款",
        "productImage": "https://...",
        "skuName": "白色/M",
        "qty": 2,
        "price": 99.00,
        "totalPrice": 198.00
      }
    ]
  }
}
```

---

### 5.4 支付订单

**POST** `/api/orders/:id/pay`

**认证**: 需要

**路径参数**:
- `id` (number): 订单ID

**示例**: `/api/orders/123/pay`

**响应**:
```json
{
  "success": true,
  "message": "支付成功",
  "data": {
    "orderId": 123,
    "orderNo": "2025102715301234",
    "status": "paid"
  }
}
```

**注意**: 当前为模拟支付，后续需集成微信支付。

---

### 5.5 取消订单

**POST** `/api/orders/:id/cancel`

**认证**: 需要

**路径参数**:
- `id` (number): 订单ID

**示例**: `/api/orders/123/cancel`

**响应**:
```json
{
  "success": true,
  "message": "订单已取消",
  "data": {
    "id": 123,
    "orderNo": "2025102715301234",
    "status": "cancelled"
  }
}
```

**注意**: 只有`pending`（待支付）状态的订单才能取消。

---

## 📊 订单状态说明

| 状态 | 值 | 说明 |
|-----|---|------|
| 待支付 | pending | 订单已创建，等待支付 |
| 已支付 | paid | 订单已支付，等待配送 |
| 配送中 | delivering | 商品正在配送 |
| 已送达 | delivered | 商品已送达 |
| 已完成 | completed | 订单完成 |
| 已取消 | cancelled | 订单已取消 |
| 退款中 | refunding | 正在退款 |
| 已退款 | refunded | 已退款 |

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

## 💡 业务规则

### 购物车规则
1. 同一商品（相同SKU）多次添加会累加数量
2. 购物车数据实时与商品库存同步
3. 商品价格从数据库实时获取，确保准确性

### 订单规则
1. **积分抵扣**：最多可抵扣订单金额的20%
2. **库存扣减**：创建订单时立即扣减库存
3. **订单取消**：只有待支付状态可取消，取消后恢复库存和积分
4. **订单状态流转**：pending → paid → delivering → delivered → completed

---

## 📝 API使用示例

### 完整购物流程示例

```javascript
// 1. 用户登录
const loginRes = await axios.post('/api/auth/wx_login', {
  code: 'wx_login_code'
});
const token = loginRes.data.token;

// 2. 浏览商品
const productsRes = await axios.get('/api/stores/1/products');

// 3. 添加到购物车
await axios.post('/api/cart', {
  productId: 1,
  qty: 2,
  skuId: 'sku001'
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 4. 查看购物车
const cartRes = await axios.get('/api/cart', {
  headers: { Authorization: `Bearer ${token}` }
});

// 5. 创建订单
const orderRes = await axios.post('/api/orders', {
  storeId: 1,
  items: [
    { productId: 1, skuId: 'sku001', qty: 2 }
  ],
  deliverType: '当天配送',
  receiverName: '张三',
  receiverPhone: '13800138000',
  receiverAddress: '北京市朝阳区xxx',
  pointsUsed: 50
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 6. 支付订单
await axios.post(`/api/orders/${orderRes.data.orderId}/pay`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 7. 查看订单详情
const orderDetail = await axios.get(`/api/orders/${orderRes.data.orderId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## 🚧 待开发模块

以下模块计划在后续版本开发：

### 1. 微信支付集成
- POST `/api/payment/unifiedorder` - 统一下单
- POST `/api/payment/notify` - 支付回调
- POST `/api/payment/refund` - 申请退款

### 2. 配送管理
- POST `/api/delivery` - 创建配送单
- PUT `/api/delivery/:id/status` - 更新配送状态
- GET `/api/delivery/:orderId` - 查询配送信息

### 3. 退货售后
- POST `/api/returns` - 申请退货
- GET `/api/returns/:orderId` - 查询退货状态
- PUT `/api/returns/:id/process` - 处理退货

### 4. 积分与邀请
- GET `/api/points/log` - 积分流水
- POST `/api/invite` - 生成邀请
- GET `/api/invite/list` - 邀请列表

---

**更新时间**: 2025-10-27
**文档状态**: 核心电商功能已完成 ✅
