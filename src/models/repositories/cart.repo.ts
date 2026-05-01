import { CartModel, type CartProduct, type CartType } from '@/models/cart.model.js';
import { getSelectData } from '@/utils/index.js';
import type { QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

export const createCart = async ({ userId, product }: { userId: number; product: CartProduct }) => {
  const query: QueryFilter<CartType> = {
    cart_userId: userId,
    cart_state: 'active',
  };

  const update: UpdateQuery<CartType> = {
    $addToSet: {
      cart_products: product,
    },
  };

  const options: QueryOptions<CartType> = {
    upsert: true,
    new: true,
  };

  return CartModel.findOneAndUpdate(query, update, options);
};

// 2. Cập nhật số lượng cho sản phẩm ĐÃ TỒN TẠI trong giỏ hàng
export const updateProductQuantity = async ({
  userId,
  productId,
  quantity,
  old_quantity,
}: {
  userId: number;
  productId: string;
  quantity: number;
  old_quantity?: number;
}) => {
  const query: QueryFilter<CartType> = {
    cart_userId: userId,
    cart_state: 'active',
    cart_products: {
      $elemMatch: {
        productId: productId,
        ...(old_quantity !== undefined ? { quantity: old_quantity } : {}),
      },
    },
  };

  const update: UpdateQuery<CartType> = {
    $inc: {
      'cart_products.$.quantity': quantity,
    },
  };

  const options: QueryOptions<CartType> = {
    new: true,
  };

  return CartModel.findOneAndUpdate(query, update, options);
};

// 3. Thêm một sản phẩm MỚI vào giỏ hàng ĐÃ TỒN TẠI
export const pushProductToCart = async ({ userId, product }: { userId: number; product: CartProduct }) => {
  const query = { cart_userId: userId, cart_state: 'active' };
  const update = {
    $push: { cart_products: product },
  };
  const options = { new: true };
  return CartModel.findOneAndUpdate(query, update, options);
};

export const deleteProductFromCart = async ({ userId, productId }: { userId: number; productId: string }) => {
  const query = { cart_userId: userId, cart_state: 'active' };
  const update = {
    $pull: {
      cart_products: { productId: productId },
    },
  };

  return CartModel.updateOne(query, update);
};

export const getListUserCart = async ({ userId }: { userId: number }) => {
  const query = { cart_userId: userId, cart_state: 'active' };

  const select = getSelectData<keyof CartType>(['cart_products']);

  return CartModel.findOne(query).select(select);
};
