import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const InsertInventoryRequestSchema = z.object({
  productId: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
  shopId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
  stock: z.number().int().positive().openapi({ example: 100 }),
  location: z.string().optional().openapi({ example: 'Hanoi, Vietnam' }),
});
