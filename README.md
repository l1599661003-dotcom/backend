# 本地衣物整合小程序 - 后端服务

基于 Koa + TypeScript + MySQL + Redis 的微信小程序后端服务

## 技术栈

- **框架**: Koa 2.x
- **语言**: TypeScript
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **ORM**: Sequelize
- **认证**: JWT
- **API文档**: 待集成 Swagger

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   ├── index.ts     # 主配置
│   │   ├── database.ts  # 数据库配置
│   │   └── redis.ts     # Redis配置
│   ├── controllers/     # 控制器
│   ├── middlewares/     # 中间件
│   │   ├── auth.ts      # JWT认证
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── response.ts  # 响应格式化
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── services/        # 业务逻辑
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   └── app.ts           # 应用入口
├── .env                 # 环境变量
├── .env.example         # 环境变量示例
├── package.json
└── tsconfig.json

```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

修改 `.env` 文件中的数据库、Redis、微信等配置。

### 3. 创建数据库

```sql
CREATE DATABASE clothing_mini_program CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 可用命令

- `npm run dev` - 启动开发服务器（热重载）
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 代码检查
- `npm run format` - 代码格式化

## API文档

待补充

## 环境要求

- Node.js >= 16.x
- MySQL >= 8.0
- Redis >= 6.0

## 开发进度

- [x] 项目基础架构搭建
- [ ] 数据库模型设计
- [ ] 用户认证模块
- [ ] 店铺管理模块
- [ ] 商品管理模块
- [ ] 购物车模块
- [ ] 订单管理模块
- [ ] 支付集成
- [ ] 配送管理
- [ ] 售后管理
- [ ] 积分系统

## License

MIT
