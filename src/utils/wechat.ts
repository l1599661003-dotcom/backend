import axios from 'axios';
import config from '../config';

/**
 * 微信API工具类
 */

// 微信登录返回数据接口
export interface WxLoginResponse {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

// 微信用户信息接口
export interface WxUserInfo {
  openId: string;
  nickName: string;
  gender: number;
  language: string;
  city: string;
  province: string;
  country: string;
  avatarUrl: string;
}

/**
 * 微信小程序登录 - code换取openid和session_key
 */
export async function wxLogin(code: string): Promise<WxLoginResponse> {
  const url = 'https://api.weixin.qq.com/sns/jscode2session';

  try {
    const response = await axios.get<WxLoginResponse>(url, {
      params: {
        appid: config.wechat.appId,
        secret: config.wechat.secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    });

    const data = response.data;

    // 检查是否有错误
    if (data.errcode) {
      throw new Error(data.errmsg || '微信登录失败');
    }

    return data;
  } catch (error: any) {
    console.error('微信登录错误:', error);
    throw new Error(error.message || '调用微信接口失败');
  }
}

/**
 * 获取微信Access Token（用于其他接口调用）
 */
export async function getAccessToken(): Promise<string> {
  const url = 'https://api.weixin.qq.com/cgi-bin/token';

  try {
    const response = await axios.get(url, {
      params: {
        grant_type: 'client_credential',
        appid: config.wechat.appId,
        secret: config.wechat.secret,
      },
    });

    const data = response.data;

    if (data.errcode) {
      throw new Error(data.errmsg || '获取AccessToken失败');
    }

    return data.access_token;
  } catch (error: any) {
    console.error('获取AccessToken错误:', error);
    throw new Error('获取微信AccessToken失败');
  }
}

/**
 * 发送订阅消息
 */
export async function sendSubscribeMessage(
  openid: string,
  templateId: string,
  data: any,
  page?: string
): Promise<void> {
  const accessToken = await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;

  try {
    const response = await axios.post(url, {
      touser: openid,
      template_id: templateId,
      page: page || 'pages/index/index',
      data,
    });

    if (response.data.errcode !== 0) {
      throw new Error(response.data.errmsg || '发送订阅消息失败');
    }
  } catch (error: any) {
    console.error('发送订阅消息错误:', error);
    throw new Error('发送订阅消息失败');
  }
}

/**
 * 生成小程序二维码
 */
export async function generateQRCode(
  scene: string,
  page?: string,
  width = 430
): Promise<Buffer> {
  const accessToken = await getAccessToken();
  const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;

  try {
    const response = await axios.post(
      url,
      {
        scene,
        page: page || 'pages/index/index',
        width,
        auto_color: false,
        line_color: { r: 0, g: 0, b: 0 },
      },
      {
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error: any) {
    console.error('生成二维码错误:', error);
    throw new Error('生成小程序二维码失败');
  }
}

export default {
  wxLogin,
  getAccessToken,
  sendSubscribeMessage,
  generateQRCode,
};
