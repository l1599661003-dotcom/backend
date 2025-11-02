import { Context } from 'koa';
import AddressService from '../services/AddressService';

class AddressController {
  /**
   * 获取用户的地址列表
   * GET /api/user/addresses
   */
  async getUserAddresses(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const addresses = await AddressService.getUserAddresses(userId);

      ctx.body = {
        code: 200,
        message: 'success',
        data: addresses,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '获取地址列表失败',
      };
    }
  }

  /**
   * 获取地址详情
   * GET /api/user/addresses/:id
   */
  async getAddressById(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { id } = ctx.params;

      const address = await AddressService.getAddressById(parseInt(id), userId);

      ctx.body = {
        code: 200,
        message: 'success',
        data: address,
      };
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: error.message || '地址不存在',
      };
    }
  }

  /**
   * 获取默认地址
   * GET /api/user/addresses/default
   */
  async getDefaultAddress(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const address = await AddressService.getDefaultAddress(userId);

      ctx.body = {
        code: 200,
        message: 'success',
        data: address,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '获取默认地址失败',
      };
    }
  }

  /**
   * 创建地址
   * POST /api/user/addresses
   */
  async createAddress(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { name, phone, province, city, district, detail, postalCode, isDefault } = ctx.request.body as any;

      if (!name || !phone || !detail) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: '收货人姓名、电话和详细地址不能为空',
        };
        return;
      }

      const address = await AddressService.createAddress(userId, {
        name,
        phone,
        province,
        city,
        district,
        detail,
        postalCode,
        isDefault,
      });

      ctx.body = {
        code: 200,
        message: '创建成功',
        data: address,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '创建地址失败',
      };
    }
  }

  /**
   * 更新地址
   * PUT /api/user/addresses/:id
   */
  async updateAddress(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { id } = ctx.params;
      const { name, phone, province, city, district, detail, postalCode, isDefault } = ctx.request.body as any;

      const address = await AddressService.updateAddress(parseInt(id), userId, {
        name,
        phone,
        province,
        city,
        district,
        detail,
        postalCode,
        isDefault,
      });

      ctx.body = {
        code: 200,
        message: '更新成功',
        data: address,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '更新地址失败',
      };
    }
  }

  /**
   * 删除地址
   * DELETE /api/user/addresses/:id
   */
  async deleteAddress(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { id } = ctx.params;

      await AddressService.deleteAddress(parseInt(id), userId);

      ctx.body = {
        code: 200,
        message: '删除成功',
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '删除地址失败',
      };
    }
  }

  /**
   * 设置默认地址
   * PUT /api/user/addresses/:id/default
   */
  async setDefaultAddress(ctx: Context) {
    try {
      const userId = ctx.state.user?.userId;

      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录',
        };
        return;
      }

      const { id } = ctx.params;

      const address = await AddressService.setDefaultAddress(parseInt(id), userId);

      ctx.body = {
        code: 200,
        message: '设置成功',
        data: address,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '设置默认地址失败',
      };
    }
  }
}

export default new AddressController();
