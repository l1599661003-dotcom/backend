import { Context, Next } from 'koa';

// 自定义错误类
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 错误处理中间件
export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (error: any) {
    // 设置状态码
    ctx.status = error.statusCode || error.status || 500;

    // 错误响应格式
    const errorResponse: any = {
      success: false,
      message: error.message || '服务器内部错误',
      code: ctx.status,
    };

    // 开发环境显示详细错误信息
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
      errorResponse.details = error;
    }

    // 记录错误日志
    console.error('错误详情:', {
      message: error.message,
      status: ctx.status,
      url: ctx.url,
      method: ctx.method,
      ip: ctx.ip,
      stack: error.stack,
    });

    ctx.body = errorResponse;
  }
};

// 404处理
export const notFound = async (ctx: Context): Promise<void> => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: '请求的资源不存在',
    code: 404,
    path: ctx.url,
  };
};
