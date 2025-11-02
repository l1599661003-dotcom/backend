import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import koaJson from 'koa-json';
import koaLogger from 'koa-logger';
import config from './config';
import { testConnection } from './config/database';
import redis from './config/redis';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { responseFormatter } from './middlewares/response';
import router from './routes';
import './models'; // 导入模型关联

// 创建Koa应用
const app = new Koa();

// 全局中间件
app.use(errorHandler); // 错误处理（必须放在最前面）
app.use(koaLogger()); // 请求日志
app.use(cors()); // 跨域
app.use(koaJson({ pretty: false, param: 'pretty' })); // JSON美化
app.use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      maxFileSize: config.upload.maxSize,
    },
  })
); // 请求体解析
app.use(responseFormatter); // 响应格式化

// 根路由
app.use(async (ctx, next) => {
  if (ctx.path === '/') {
    ctx.body = {
      success: true,
      message: '本地衣物整合小程序 API 服务',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  } else {
    await next();
  }
});

// 注册业务路由
app.use(router.routes()).use(router.allowedMethods());

// 404处理（必须放在最后）
app.use(notFound);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();

    // 尝试连接Redis（可选）
    try {
      await redis.connect();
      await redis.ping();
      console.log('✅ Redis连接成功');
    } catch (redisError) {
      console.log('⚠️  Redis连接失败，服务器将在没有Redis缓存的情况下继续运行');
      console.log('💡 提示：Redis用于缓存优化，不影响核心功能');
    }

    // 启动HTTP服务器
    const server = app.listen(config.port, () => {
      console.log('='.repeat(50));
      console.log('🚀 服务器启动成功');
      console.log(`📍 服务地址: http://localhost:${config.port}`);
      console.log(`🌍 运行环境: ${config.nodeEnv}`);
      console.log(`📅 启动时间: ${new Date().toLocaleString('zh-CN')}`);
      console.log('='.repeat(50));
    });

    // 优雅关闭
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n收到 ${signal} 信号，正在优雅关闭...`);

      server.close(async () => {
        console.log('✅ HTTP服务器已关闭');

        try {
          await redis.quit();
          console.log('✅ Redis连接已关闭');
        } catch (error) {
          console.error('❌ Redis关闭失败:', error);
        }

        process.exit(0);
      });

      // 强制关闭超时
      setTimeout(() => {
        console.error('❌ 强制关闭超时，进程退出');
        process.exit(1);
      }, 10000);
    };

    // 监听关闭信号
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 启动应用
startServer();

export default app;
