import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CheckoutProductItemSchema = z.object({
  productId: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
  shopId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
  quantity: z.number().int().positive().openapi({ example: 2 }),
  price: z.number().positive().openapi({ example: 1500 }),
});

export const CheckoutShopOrderSchema = z.object({
  shopId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
  shop_discounts: z.array(z.string()).openapi({
    example: ['SUMMER201'],
    description: 'Array of discount codes to apply for this shop',
  }),
  item_products: z.array(CheckoutProductItemSchema),
});

export const CheckoutReviewRequestSchema = z.object({
  userId: z.number().int().openapi({ example: 1001 }),
  cartId: z.string().openapi({ example: '69f5119a121d3271ece24d26' }),
  shop_orderIds: z.array(CheckoutShopOrderSchema),
});
