import { Context, Next } from 'koa';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { AppError } from './errorHandler';

// JWT Token payload接口
export interface JwtPayload {
  userId: number;
  openid: string;
  iat?: number;
  exp?: number;
}

// 扩展Context类型
declare module 'koa' {
  interface Context {
    state: {
      user?: JwtPayload;
    };
  }
}

// 生成Token
export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.secret as string, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

// 验证Token
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret as string) as JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token已过期', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token无效', 401);
    }
    throw new AppError('Token验证失败', 401);
  }
};

// 认证中间件（测试环境默认不需要鉴权）
export const authenticate = async (ctx: Context, next: Next): Promise<void> => {
  // 🔧 优先检查认证开关 - 如果禁用认证，直接放行
  if (process.env.DISABLE_AUTH === 'true') {
    console.log('🚫 认证已禁用 (DISABLE_AUTH=true)，使用默认测试用户');
    ctx.state.user = {
      userId: 1,
      openid: 'test_user_001',
    };
    await next();
    return;
  }

  // 开发环境默认使用测试用户，跳过鉴权
  if (process.env.NODE_ENV !== 'production') {
    // 默认使用管理员用户
    ctx.state.user = {
      userId: 1,
      openid: 'admin_openid',
    };
    await next();
    return;
  }

  // 生产环境需要鉴权
  // 从请求头获取token
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    throw new AppError('未提供认证Token', 401);
  }

  // 格式: Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AppError('Token格式错误', 401);
  }

  const token = parts[1];

  // 验证token
  const payload = verifyToken(token);

  // 将用户信息存储到ctx.state中
  ctx.state.user = payload;

  await next();
};

// 可选认证中间件（即使没有token也放行，但会尝试解析）
export const optionalAuth = async (ctx: Context, next: Next): Promise<void> => {
  const authHeader = ctx.headers.authorization;

  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      try {
        const token = parts[1];
        const payload = verifyToken(token);
        ctx.state.user = payload;
      } catch (error) {
        // 可选认证失败不抛出错误
        console.log('可选认证失败:', error);
      }
    }
  }

  await next();
};
