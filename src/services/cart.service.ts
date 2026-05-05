/* 
    Cart service
    1. Add product to cart [User]
    2. Increase product quantity in cart [User]
    3. Reduce product quantity in cart [User]
    4. Get list of products in cart [User]
    5. Remove product from cart [User]
    6. Clear cart [User]
*/

import { BadRequestError } from '@/core/error.response.js';
import { CartModel, type CartProduct } from '@/models/cart.model.js';
import { CartRepository, ProductRepository } from '@/models/repositories/index.js';

export const addProductToCart = async ({
  userId,
  product,
}: { userId: number; product: CartProduct & { productId: string } }) => {
  // 1. Check if cart exists for user
  const cart = await CartModel.findOne({ cart_userId: userId });

  if (!cart) return CartRepository.createCart({ userId, product });

  // 2. If cart exists, but no products, add product to cart
  if (!cart.cart_products.length) {
    return CartRepository.pushProductToCart({ userId, product });
  }

  // TODO: Logic chỗ này khác với video
  // 3. If cart exists, and has products
  // 3.1 Check if product already exists in cart
  const existingProduct = cart.cart_products.find((p: any) => p.productId.toString() === product.productId);
  if (existingProduct) {
    return CartRepository.updateProductQuantity({ userId, productId: product.productId.toString(), quantity: 1 });
  }

  // 3.2 If product does not exist in cart, add product to cart
  return CartRepository.pushProductToCart({ userId, product });
};

export const updateProductQuantity = async ({
  userId,
  shop_orderIds,
}: {
  userId: number;
  shop_orderIds: {
    shopId: string;
    item_products: (CartProduct & { old_quantity: number })[];
  }[];
}) => {
  const { productId, quantity, old_quantity } = shop_orderIds[0].item_products[0];

  const foundProduct = await ProductRepository.findProduct({ product_id: productId.toString(), unSelect: [] });
  if (!foundProduct) throw new Error('Product not found');
  if (foundProduct.product_shop.toString() !== shop_orderIds[0].shopId) {
    throw new BadRequestError('Product does not belong to the shop');
  }

  if (quantity === 0) {
    // Delete product from cart
    return CartRepository.deleteProductFromCart({ userId, productId: productId.toString() });
  }

  // TODO: Khác với logic ở video -> Check if old_quantity matches the quantity in cart
  // Update product quantity in cart
  const updatedCart = await CartRepository.updateProductQuantity({
    userId,
    productId: productId.toString(),
    quantity: quantity - old_quantity, //TODO: vì repo logic dùng $inc, nên cần truyền quantity, not a new volume
    old_quantity,
  });

  // Nếu updatedCart = null, nghĩa là old_quantity bị sai hoặc giỏ hàng không tồn tại
  if (!updatedCart) {
    throw new BadRequestError('Product quantity has been changed by another process. Please refresh!');
  }

  return updatedCart;
};

export const getListUserCart = async ({ userId }: { userId: number }) => {
  return CartRepository.getListUserCart({ userId });
};

export const deleteProductFromCart = async ({ userId, productId }: { userId: number; productId: string }) => {
  return CartRepository.deleteProductFromCart({ userId, productId });
};
