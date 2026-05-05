/* 
    Cart service
    1. Add product to cart [User]
    2. Increase product quantity in cart [User]
    3. Reduce product quantity in cart [User]
    4. Get list of products in cart [User]
    5. Remove product from cart [User]
    6. Clear cart [User]
*/

import { OrderModel, type OrderType } from '@/models/order.model.js';

export const createOrder = async ({
  order_checkout,
  order_userId,
  order_payment,
  order_products,
  order_shipping,
}: {
  order_userId: OrderType['order_userId'];
  order_checkout: OrderType['order_checkout'];
  order_shipping: OrderType['order_shipping'];
  order_products: OrderType['order_products'];
  order_payment: OrderType['order_payment'];
}) => {
  return OrderModel.create({
    order_userId,
    order_checkout,
    order_shipping,
    order_products,
    order_payment,
  });
};
