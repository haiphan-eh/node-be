import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ErrorResponseSchema = z.object({
  status: z.string().openapi({ example: 'error' }),
  code: z.number().openapi({ example: 400 }),
  message: z.string(),
  stack: z.string().optional().openapi({ description: 'Stack trace (development only)' }),
});

export const SuccessResponseSchema = z.object({
  code: z.number().openapi({ example: 200 }),
  message: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});
