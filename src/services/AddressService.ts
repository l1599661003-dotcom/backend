import UserAddress from '../models/UserAddress';

class AddressService {
  /**
   * 获取用户的地址列表
   */
  async getUserAddresses(userId: number) {
    const addresses = await UserAddress.findAll({
      where: { userId },
      order: [
        ['isDefault', 'DESC'], // 默认地址排在前面
        ['createdAt', 'DESC'],
      ],
    });

    return addresses;
  }

  /**
   * 获取地址详情
   */
  async getAddressById(addressId: number, userId: number) {
    const address = await UserAddress.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error('地址不存在');
    }

    return address;
  }

  /**
   * 获取默认地址
   */
  async getDefaultAddress(userId: number) {
    const address = await UserAddress.findOne({
      where: { userId, isDefault: true },
    });

    return address;
  }

  /**
   * 创建地址
   */
  async createAddress(userId: number, addressData: {
    name: string;
    phone: string;
    province?: string;
    city?: string;
    district?: string;
    detail: string;
    postalCode?: string;
    isDefault?: boolean;
  }) {
    // 如果设置为默认地址，先取消其他默认地址
    if (addressData.isDefault) {
      await UserAddress.update(
        { isDefault: false },
        { where: { userId, isDefault: true } }
      );
    } else {
      // 检查是否是第一个地址，如果是则自动设为默认
      const count = await UserAddress.count({ where: { userId } });
      if (count === 0) {
        addressData.isDefault = true;
      }
    }

    const address = await UserAddress.create({
      userId,
      ...addressData,
      isDefault: addressData.isDefault ?? false,
    });

    return address;
  }

  /**
   * 更新地址
   */
  async updateAddress(
    addressId: number,
    userId: number,
    addressData: {
      name?: string;
      phone?: string;
      province?: string;
      city?: string;
      district?: string;
      detail?: string;
      postalCode?: string;
      isDefault?: boolean;
    }
  ) {
    const address = await this.getAddressById(addressId, userId);

    // 如果设置为默认地址，先取消其他默认地址
    if (addressData.isDefault) {
      await UserAddress.update(
        { isDefault: false },
        { where: { userId, isDefault: true, id: { $ne: addressId } as any } }
      );
    }

    await address.update(addressData);

    return address;
  }

  /**
   * 删除地址
   */
  async deleteAddress(addressId: number, userId: number) {
    const address = await this.getAddressById(addressId, userId);

    const wasDefault = address.isDefault;

    await address.destroy();

    // 如果删除的是默认地址，将第一个地址设为默认
    if (wasDefault) {
      const firstAddress = await UserAddress.findOne({
        where: { userId },
        order: [['createdAt', 'ASC']],
      });

      if (firstAddress) {
        await firstAddress.update({ isDefault: true });
      }
    }

    return { success: true };
  }

  /**
   * 设置默认地址
   */
  async setDefaultAddress(addressId: number, userId: number) {
    const address = await this.getAddressById(addressId, userId);

    // 取消其他默认地址
    await UserAddress.update(
      { isDefault: false },
      { where: { userId, isDefault: true } }
    );

    // 设置当前地址为默认
    await address.update({ isDefault: true });

    return address;
  }
}

export default new AddressService();
