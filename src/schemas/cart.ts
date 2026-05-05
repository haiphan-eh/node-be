import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CartProductSchema = z.object({
  productId: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
  shopId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
  quantity: z.number().int().positive().openapi({ example: 2 }),
  price: z.number().positive().openapi({ example: 1500 }),
});

export const CartItemForUpdateSchema = z.object({
  productId: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
  quantity: z.number().int().min(0).openapi({ example: 10, description: 'New quantity' }),
  old_quantity: z.number().int().min(0).openapi({ example: 2, description: 'Previous quantity in cart' }),
});

export const ShopOrderForUpdateSchema = z.object({
  shopId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
  item_products: z.array(CartItemForUpdateSchema),
});

export const AddToCartRequestSchema = z.object({
  userId: z.number().int().openapi({ example: 1001 }),
  product: CartProductSchema,
});

export const UpdateCartRequestSchema = z.object({
  userId: z.number().int().openapi({ example: 1001 }),
  shop_orderIds: z.array(ShopOrderForUpdateSchema),
});

export const DeleteFromCartRequestSchema = z.object({
  userId: z.number().int().openapi({ example: 1001 }),
  productId: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
});

export const GetCartQuerySchema = z.object({
  userId: z.string().openapi({ example: '1001', description: 'User ID' }),
});
