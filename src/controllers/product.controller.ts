import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import {
  CreateProductRequestSchema,
  ProductListQuerySchema,
  ProductSearchQuerySchema,
  ShopProductQuerySchema,
  UpdateProductRequestSchema,
} from '@/schemas/product.js';
import { ProductService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  const body = await CreateProductRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Create new product successfully',
    metadata: await ProductService.createProduct({
      type: body.product_type,
      payload: { ...body, product_shop: shopId } as any,
    }),
  }).send(res);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  const body = await UpdateProductRequestSchema.parseAsync(req.body);
  if (!body.product_type) throw new BadRequestError('product_type is required');

  new SuccessResponse({
    message: 'Update product successfully',
    metadata: await ProductService.updateProduct({
      type: body.product_type,
      payload: body as any,
      product_shop: shopId,
      productId: productId as string,
    }),
  }).send(res);
};

export const getAllDraftsForShop = async (req: Request, res: Response) => {
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  const { limit, offset } = await ShopProductQuerySchema.parseAsync(req.query);

  new SuccessResponse({
    message: 'Get list of drafts for shop successfully',
    metadata: await ProductService.findAllDraftsForShop({
      product_shop: shopId,
      limit: Number(limit) || 60,
      offset: Number(offset) || 0,
    }),
  }).send(res);
};

export const getAllPublishedForShop = async (req: Request, res: Response) => {
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  const { limit, offset } = await ShopProductQuerySchema.parseAsync(req.query);

  new SuccessResponse({
    message: 'Get list of published products for shop successfully',
    metadata: await ProductService.findAllPublishedForShop({
      product_shop: shopId,
      limit: Number(limit) || 60,
      offset: Number(offset) || 0,
    }),
  }).send(res);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { limit, page, sort } = await ProductListQuerySchema.parseAsync(req.query);

  new SuccessResponse({
    message: 'Get list products successfully',
    metadata: await ProductService.findAllProducts({
      limit: Number(limit) || 60,
      page: Number(page) || 1,
      sort: sort ?? 'ctime',
      filter: {},
      select: [],
    }),
  }).send(res);
};

export const getProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  new SuccessResponse({
    message: 'Get product successfully',
    metadata:
      (await ProductService.findProduct({
        product_id: product_id as string,
      })) ?? {},
  }).send(res);
};

export const publishProductByShop = async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  new SuccessResponse({
    message: 'Publish product successfully',
    metadata: await ProductService.publishProductByShop({
      product_shop: shopId,
      productId,
    }),
  }).send(res);
};

export const unpublishProductByShop = async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  new SuccessResponse({
    message: 'Unpublish product successfully',
    metadata: await ProductService.unpublishProductByShop({
      product_shop: shopId,
      productId,
    }),
  }).send(res);
};

export const searchProductByUser = async (req: Request, res: Response) => {
  const { keySearch } = await ProductSearchQuerySchema.parseAsync(req.query);

  new SuccessResponse({
    message: 'Search products successfully',
    metadata: await ProductService.searchProductByUser({ keySearch }),
  }).send(res);
};
