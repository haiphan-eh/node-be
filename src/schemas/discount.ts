import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CreateDiscountRequestSchema = z.object({
  code: z.string().min(1).openapi({ example: 'SUMMER201' }),
  name: z.string().openapi({ example: 'Summer Sale 2024' }),
  description: z.string().openapi({ example: '20% off on all products during summer sale' }),
  type: z.enum(['percentage', 'fixed_amount']).openapi({ example: 'percentage' }),
  value: z.number().positive().openapi({
    example: 20,
    description: 'Discount value (percentage or fixed amount)',
  }),
  minOrderValue: z.number().min(0).openapi({ example: 50 }),
  maxUses: z.number().int().positive().openapi({ example: 100 }),
  maxUsesPerUser: z.number().int().positive().openapi({ example: 2 }),
  startDate: z.string().datetime().openapi({ example: '2026-01-01T00:00:00.000Z' }),
  endDate: z.string().datetime().openapi({ example: '2029-07-31T23:59:59.999Z' }),
  isActive: z.boolean().openapi({ example: true }),
  appliesTo: z.enum(['all_products', 'specific_products']).openapi({ example: 'specific_products' }),
  productIds: z
    .array(z.string())
    .optional()
    .openapi({
      example: ['507f1f77bcf86cd799439011'],
      description: 'Required when appliesTo is "specific_products"',
    }),
  maxValue: z.number().optional().openapi({ description: 'Max discount cap for percentage type' }),
});

export const GetDiscountCodesQuerySchema = z.object({
  code: z.string().openapi({ example: 'SUMMER201', description: 'Discount code to look up' }),
  shopId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
});

// passthrough() preserves extra fields from the full product API response
// (service uses _id, product_price, product_quantity)
export const DiscountProductItemSchema = z
  .object({
    _id: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
    product_price: z.number().openapi({ example: 1500 }),
    product_quantity: z.number().int().openapi({ example: 5 }),
    product_name: z.string().optional().openapi({ example: 'Laptop 2' }),
  })
  .passthrough();

export const GetDiscountAmountRequestSchema = z.object({
  shopId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
  code: z.string().openapi({ example: 'SUMMER200' }),
  products: z.array(DiscountProductItemSchema).min(1).openapi({
    description: 'Pass product objects as returned by the product list endpoints',
  }),
});
