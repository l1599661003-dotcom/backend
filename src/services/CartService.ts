import { Cart, Product } from '../models';
import { CartItem } from '../models/Cart';
import { AppError } from '../middlewares/errorHandler';
import ProductService from './ProductService';

/**
 * 购物车服务类
 */
class CartService {
  /**
   * 获取用户购物车
   */
  async getCart(userId: number) {
    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      // 如果购物车不存在，创建一个空购物车
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    // 获取购物车商品的详细信息
    const items = await this.enrichCartItems(cart.items);

    return {
      items,
      totalCount: items.reduce((sum, item) => sum + item.qty, 0),
      selectedCount: items.filter((item) => item.selected).reduce((sum, item) => sum + item.qty, 0),
      totalPrice: items
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.price * item.qty, 0),
    };
  }

  /**
   * 添加商品到购物车
   */
  async addToCart(userId: number, productId: number, qty = 1, skuId?: string) {
    // 检查商品是否存在
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new AppError('商品不存在', 404);
    }

    // 检查库存
    const hasStock = await ProductService.checkStock(productId, qty);
    if (!hasStock) {
      throw new AppError('库存不足', 400);
    }

    // 获取或创建购物车
    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    // 检查购物车中是否已存在该商品
    const items = cart.items || [];
    const existingItemIndex = items.findIndex(
      (item) => item.productId === productId && item.skuId === skuId
    );

    if (existingItemIndex >= 0) {
      // 如果已存在，增加数量
      items[existingItemIndex].qty += qty;
    } else {
      // 如果不存在，添加新商品
      items.push({
        productId,
        skuId,
        title: product.title,
        mainImage: product.mainImage,
        price: Number(product.price),
        qty,
        selected: true,
      });
    }

    // 更新购物车
    await cart.update({ items });

    return this.getCart(userId);
  }

  /**
   * 更新购物车商品数量
   */
  async updateCartItem(userId: number, productId: number, qty: number, skuId?: string) {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw new AppError('购物车不存在', 404);
    }

    const items = cart.items || [];
    const itemIndex = items.findIndex(
      (item) => item.productId === productId && item.skuId === skuId
    );

    if (itemIndex === -1) {
      throw new AppError('购物车中不存在该商品', 404);
    }

    if (qty <= 0) {
      // 如果数量小于等于0，删除该商品
      items.splice(itemIndex, 1);
    } else {
      // 检查库存
      const hasStock = await ProductService.checkStock(productId, qty);
      if (!hasStock) {
        throw new AppError('库存不足', 400);
      }

      // 更新数量
      items[itemIndex].qty = qty;
    }

    await cart.update({ items });

    return this.getCart(userId);
  }

  /**
   * 删除购物车商品
   */
  async removeFromCart(userId: number, productId: number, skuId?: string) {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw new AppError('购物车不存在', 404);
    }

    const items = cart.items || [];
    const newItems = items.filter(
      (item) => !(item.productId === productId && item.skuId === skuId)
    );

    await cart.update({ items: newItems });

    return this.getCart(userId);
  }

  /**
   * 切换商品选中状态
   */
  async toggleSelect(userId: number, productId: number, selected: boolean, skuId?: string) {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw new AppError('购物车不存在', 404);
    }

    const items = cart.items || [];
    const itemIndex = items.findIndex(
      (item) => item.productId === productId && item.skuId === skuId
    );

    if (itemIndex === -1) {
      throw new AppError('购物车中不存在该商品', 404);
    }

    items[itemIndex].selected = selected;

    await cart.update({ items });

    return this.getCart(userId);
  }

  /**
   * 全选/全不选
   */
  async toggleSelectAll(userId: number, selected: boolean) {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw new AppError('购物车不存在', 404);
    }

    const items = cart.items || [];
    items.forEach((item) => {
      item.selected = selected;
    });

    await cart.update({ items });

    return this.getCart(userId);
  }

  /**
   * 清空购物车
   */
  async clearCart(userId: number) {
    const cart = await Cart.findOne({ where: { userId } });

    if (cart) {
      await cart.update({ items: [] });
    }

    return {
      items: [],
      totalCount: 0,
      selectedCount: 0,
      totalPrice: 0,
    };
  }

  /**
   * 获取选中的商品（用于创建订单）
   */
  async getSelectedItems(userId: number): Promise<CartItem[]> {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return [];
    }

    return (cart.items || []).filter((item) => item.selected);
  }

  /**
   * 丰富购物车商品信息（获取最新的价格和库存）
   */
  private async enrichCartItems(items: CartItem[]): Promise<CartItem[]> {
    if (!items || items.length === 0) {
      return [];
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.findAll({
      where: { id: productIds },
      attributes: ['id', 'title', 'mainImage', 'price', 'stock'],
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    return items.map((item) => {
      const product = productMap.get(item.productId);

      if (product) {
        return {
          ...item,
          title: product.title,
          mainImage: product.mainImage,
          price: Number(product.price),
          // 可以添加库存检查
          stock: product.stock,
        } as any;
      }

      return item;
    });
  }
}

export default new CartService();
