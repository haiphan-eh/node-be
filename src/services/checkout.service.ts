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
import type { CartProduct } from '@/models/cart.model.js';
import { CartRepository, ProductRepository } from '@/models/repositories/index.js';
import { DiscountService, OrderService, RedisService } from '@/services/index.js';

export const checkoutReview = async ({
  cartId,
  userId,
  shop_orderIds,
}: {
  cartId: string;
  userId: number;
  shop_orderIds: {
    shopId: string;
    shop_discounts: string[];
    item_products: CartProduct[];
  }[];
}) => {
  // 1. Check if cart exists for user
  const foundCart = await CartRepository.findCartById({ cartId });

  if (!foundCart) throw new BadRequestError('Cart not found');

  const checkoutOrder = {
    totalPrice: 0,
    totalDiscount: 0,
    feeShip: 0,
    totalPayment: 0,
  };

  const shop_orderIds_new = [];

  for (let i = 0; i < shop_orderIds.length; i++) {
    const { shopId, shop_discounts, item_products } = shop_orderIds[i];
    // 2. Check all products in cart are available and have enough quantity
    if (item_products.length === 0) throw new BadRequestError('No products in cart');
    const foundProducts = await ProductRepository.checkProducts({ products: item_products });

    if (foundProducts.length !== item_products.length) throw new BadRequestError('Some products are not available');

    const totalPrice = foundProducts.reduce((total, product) => {
      return total + (product?.product_quantity || 0) * (product?.product_price || 0);
    }, 0);

    const itemCheckout = {
      shopId,
      shop_discounts,
      totalPrice,
      totalPriceApplyDiscount: totalPrice,
      item_products: foundProducts.map((product) => ({
        productId: product._id,
        quantity: product?.product_quantity || 0,
        price: product?.product_price || 0,
        shopId: product?.product_shop._id.toString(),
      })),
    };

    checkoutOrder.totalPrice += itemCheckout.totalPrice;

    if (shop_discounts.length > 0) {
      const { discountAmount: totalDiscount } = await DiscountService.getDiscountAmount({
        code: shop_discounts[0],
        products: foundProducts,
        shopId,
      });

      itemCheckout.totalPriceApplyDiscount = totalPrice - totalDiscount;
      checkoutOrder.totalDiscount += totalDiscount;
    }

    checkoutOrder.totalPayment += itemCheckout.totalPriceApplyDiscount;
    shop_orderIds_new.push(itemCheckout);
  }

  return {
    shop_orderIds,
    shop_orderIds_new,
    checkoutOrder,
  };
};

export const orderByUser = async ({
  cartId,
  shop_orderIds,
  userId,
  user_payment,
  user_address,
}: {
  shop_orderIds: {
    shopId: string;
    shop_discounts: string[];
    item_products: CartProduct[];
  };
  cartId: string;
  userId: number;
  user_payment: any;
  user_address: any;
}) => {
  const { shop_orderIds_new, checkoutOrder } = await checkoutReview({
    cartId,
    userId,
    shop_orderIds: [],
  });

  const products = shop_orderIds_new.flatMap((order) => order.item_products);
  console.log('products: ', products);
  const acquireProduct = [];

  for (let i = 0; i < products.length; i++) {
    const { productId, quantity, price } = products[i];
    const keyLock = await RedisService.acquireLock({ productId: productId.toString(), quantity, cartId });
    acquireProduct.push(!!keyLock);
    if (keyLock) {
      await RedisService.releaseLock(keyLock);
    }
  }

  // Check nếu có 1 sp hết hàng trong kho
  if (!acquireProduct.includes(false)) {
    throw new BadRequestError('Some products are out of stock');
  }

  // TODO: Tạo order
  const newOrder = await OrderService.createOrder({
    order_userId: userId,
    order_products: products as any, // Cast to any or the expected DocumentArray type
    order_checkout: checkoutOrder,
    order_payment: user_payment,
    order_shipping: user_address,
  });

  if (newOrder) {
    // remove product from cart
  }

  return 'new order';
};

export const getOrdersByUser = async ({ userId }: { userId: number }) => {
  return OrderService.getOrdersByUser({ userId });
};

export const getOneOrderByUser = async ({ userId }: { userId: number }) => {
  return OrderService.getOrdersByUser({ userId });
};

export const cancelOneOrderByUser = async ({ userId }: { userId: number }) => {
  return OrderService.getOrdersByUser({ userId });
};

export const updateOrderStatusByShop = async ({ userId }: { userId: number }) => {
  return OrderService.getOrdersByUser({ userId });
};
