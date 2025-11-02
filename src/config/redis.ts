import Redis from 'ioredis';
import config from './index';

// 创建Redis客户端
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  maxRetriesPerRequest: 3, // 限制重试次数
  retryStrategy: (times) => {
    // 最多重试3次
    if (times > 3) {
      console.log('⚠️  Redis连接失败，服务器将在没有Redis的情况下继续运行');
      return null; // 停止重试
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true, // 延迟连接，不阻塞服务器启动
});

// Redis事件监听
redis.on('connect', () => {
  console.log('✅ Redis连接成功');
});

redis.on('error', (err) => {
  console.error('❌ Redis连接错误:', err);
});

redis.on('close', () => {
  console.log('🔌 Redis连接已关闭');
});

// Redis工具函数
export const redisUtils = {
  // 设置缓存
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  },

  // 获取缓存
  async get(key: string): Promise<any> {
    const value = await redis.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },

  // 删除缓存
  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  // 批量删除（通过模式匹配）
  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  // 检查key是否存在
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },

  // 设置过期时间
  async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(key, seconds);
  },

  // 获取剩余过期时间
  async ttl(key: string): Promise<number> {
    return await redis.ttl(key);
  },
};

export default redis;
