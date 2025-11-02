import { Context, Next } from 'koa';

// 扩展Context类型
declare module 'koa' {
  interface Context {
    success: (data?: any, message?: string) => void;
    fail: (message: string, code?: number) => void;
  }
}

// 响应格式化中间件
export const responseFormatter = async (ctx: Context, next: Next): Promise<void> => {
  // 成功响应
  ctx.success = (data: any = null, message = '操作成功') => {
    ctx.body = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  };

  // 失败响应
  ctx.fail = (message = '操作失败', code = 400) => {
    ctx.status = code;
    ctx.body = {
      success: false,
      message,
      code,
      timestamp: new Date().toISOString(),
    };
  };

  await next();
};
