/**
 * 数据模型索引文件
 * 负责导出所有模型并建立关联关系
 */

import User from './User';
import Store from './Store';
import Product from './Product';
import Order from './Order';
import OrderItem from './OrderItem';
import Cart from './Cart';
import Follow from './Follow';
import UserStats from './UserStats';
import Post from './Post';
import PostLike from './PostLike';
import PostComment from './PostComment';
import PostCollect from './PostCollect';
import Message from './Message';
import Banner from './Banner';
import Coupon from './Coupon';
import UserCoupon from './UserCoupon';

// 建立模型关联关系

// User <-> Order: 一对多
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Cart: 一对一
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Follow: 一对多（用户的关注列表）
User.hasMany(Follow, { foreignKey: 'followerUserId', as: 'following' });
Follow.belongsTo(User, { foreignKey: 'followerUserId', as: 'follower' });

// User <-> UserStats: 一对一
User.hasOne(UserStats, { foreignKey: 'userId', as: 'stats' });
UserStats.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Store <-> Product: 一对多
Store.hasMany(Product, { foreignKey: 'storeId', as: 'products' });
Product.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Store <-> Order: 一对多
Store.hasMany(Order, { foreignKey: 'storeId', as: 'orders' });
Order.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Order <-> OrderItem: 一对多
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// User <-> Post: 一对多
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post <-> Product: 多对一（动态可以关联商品）
Post.belongsTo(Product, { foreignKey: 'relatedProductId', as: 'relatedProduct' });
Product.hasMany(Post, { foreignKey: 'relatedProductId', as: 'posts' });

// Post <-> PostLike: 一对多
Post.hasMany(PostLike, { foreignKey: 'postId', as: 'likes' });
PostLike.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User <-> PostLike: 一对多
User.hasMany(PostLike, { foreignKey: 'userId', as: 'postLikes' });
PostLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post <-> PostComment: 一对多
Post.hasMany(PostComment, { foreignKey: 'postId', as: 'comments' });
PostComment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User <-> PostComment: 一对多
User.hasMany(PostComment, { foreignKey: 'userId', as: 'postComments' });
PostComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// PostComment <-> PostComment: 自关联（评论回复）
PostComment.hasMany(PostComment, { foreignKey: 'parentCommentId', as: 'replies' });
PostComment.belongsTo(PostComment, { foreignKey: 'parentCommentId', as: 'parentComment' });

// Post <-> PostCollect: 一对多
Post.hasMany(PostCollect, { foreignKey: 'postId', as: 'collects' });
PostCollect.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User <-> PostCollect: 一对多
User.hasMany(PostCollect, { foreignKey: 'userId', as: 'postCollects' });
PostCollect.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Message: 一对多（接收者）
User.hasMany(Message, { foreignKey: 'receiverUserId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiverUserId', as: 'receiver' });

// User <-> Message: 一对多（发送者）
User.hasMany(Message, { foreignKey: 'senderUserId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderUserId', as: 'sender' });

// Store <-> Coupon: 一对多
Store.hasMany(Coupon, { foreignKey: 'storeId', as: 'coupons' });
Coupon.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// User <-> UserCoupon: 一对多
User.hasMany(UserCoupon, { foreignKey: 'userId', as: 'userCoupons' });
UserCoupon.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Coupon <-> UserCoupon: 一对多
Coupon.hasMany(UserCoupon, { foreignKey: 'couponId', as: 'userCoupons' });
UserCoupon.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

// Order <-> UserCoupon: 一对多（订单使用的优惠券）
Order.hasMany(UserCoupon, { foreignKey: 'orderId', as: 'coupons' });
UserCoupon.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// 导出所有模型
export {
  User,
  Store,
  Product,
  Order,
  OrderItem,
  Cart,
  Follow,
  UserStats,
  Post,
  PostLike,
  PostComment,
  PostCollect,
  Message,
  Banner,
  Coupon,
  UserCoupon,
};

// 默认导出对象
export default {
  User,
  Store,
  Product,
  Order,
  OrderItem,
  Cart,
  Follow,
  UserStats,
  Post,
  PostLike,
  PostComment,
  PostCollect,
  Message,
  Banner,
  Coupon,
  UserCoupon,
};
