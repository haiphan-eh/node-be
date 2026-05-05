import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ProductAttributesClothingSchema = z.object({
  brand: z.string().openapi({ example: 'Nike' }),
  size: z.string().optional().openapi({ example: 'M' }),
  material: z.string().optional().openapi({ example: 'Cotton' }),
});

export const ProductAttributesElectronicsSchema = z.object({
  manufacturer: z.string().openapi({ example: 'HP' }),
  model: z.string().optional().openapi({ example: 'XPS 15' }),
  color: z.string().optional().openapi({ example: 'Silver' }),
});

export const ProductAttributesFurnitureSchema = z.object({
  manufacturer: z.string().openapi({ example: 'IKEA' }),
  model: z.string().optional().openapi({ example: 'KALLAX' }),
  color: z.string().optional().openapi({ example: 'White' }),
});

export const CreateProductRequestSchema = z.object({
  product_name: z.string().min(1).openapi({ example: 'Laptop 2' }),
  product_thumb: z.string().openapi({ example: 'product_thumb' }),
  product_description: z.string().optional().openapi({ example: 'High-performance laptop' }),
  product_price: z.number().positive().openapi({ example: 1500 }),
  product_quantity: z.number().int().positive().openapi({ example: 5 }),
  product_type: z.enum(['Electronics', 'Clothing', 'Furniture']).openapi({ example: 'Electronics' }),
  product_attributes: z
    .union([ProductAttributesElectronicsSchema, ProductAttributesClothingSchema, ProductAttributesFurnitureSchema])
    .openapi({
      description: 'Type-specific attributes. Use Electronics fields for Electronics, Clothing for Clothing, etc.',
      example: { manufacturer: 'HP', model: 'XPS 15', color: 'Silver' },
    }),
});

export const UpdateProductRequestSchema = z.object({
  product_name: z.string().min(1).optional().openapi({ example: 'New Jeans 2' }),
  product_thumb: z.string().optional(),
  product_description: z.string().optional(),
  product_price: z.number().positive().optional(),
  product_quantity: z.number().int().positive().optional(),
  product_type: z.enum(['Electronics', 'Clothing', 'Furniture']).optional().openapi({ example: 'Clothing' }),
  product_attributes: z
    .record(z.any())
    .optional()
    .openapi({ example: { color: 'Levi ssssss' } }),
});

export const ProductListQuerySchema = z.object({
  limit: z.string().optional().openapi({ example: '60', description: 'Items per page (default: 60)' }),
  page: z.string().optional().openapi({ example: '1', description: 'Page number (default: 1)' }),
  sort: z.string().optional().openapi({ example: 'ctime', description: 'Sort field: ctime | price' }),
});

export const ShopProductQuerySchema = z.object({
  limit: z.string().optional().openapi({ example: '10', description: 'Items per page (default: 60)' }),
  offset: z.string().optional().openapi({
    example: '0',
    description: 'Number of items to skip (default: 0)',
  }),
});

export const ProductSearchQuerySchema = z.object({
  keySearch: z.string().openapi({ example: 'high', description: 'Search keyword' }),
});
