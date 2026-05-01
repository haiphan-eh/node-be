import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import type { ProductItem, ProductType } from '@/models/product.model.js';
import { ProductService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  const payload = req.body;
  const { product_type: type } = payload as { product_type: ProductType };
  const product_shop = req.user?.userId;

  if (!product_shop) {
    throw new BadRequestError('Product shop is required');
  }

  payload.product_shop = product_shop;

  new SuccessResponse({
    message: 'Create new product successfully',
    metadata: await ProductService.createProduct({ type, payload }),
  }).send(res);
};

export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId as string;

  if (!productId) {
    throw new BadRequestError('Product ID is required');
  }

  const payload = req.body;
  const { product_type: type } = payload as { product_type: ProductType };
  const product_shop = req.user?.userId;

  if (!type) {
    throw new BadRequestError('Product type is required');
  }

  if (!product_shop) {
    throw new BadRequestError('Product shop is required');
  }

  new SuccessResponse({
    message: 'Update product successfully',
    metadata: await ProductService.updateProduct({ type, payload, product_shop, productId }),
  }).send(res);
};

export const getAllDraftsForShop = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const product_shop = req.user?.userId;

  if (!product_shop) {
    throw new BadRequestError('Product shop is required');
  }

  new SuccessResponse({
    message: 'Get list of drafts for shop successfully',
    metadata: await ProductService.findAllDraftsForShop({
      product_shop,
      limit: Number(limit) || 60,
      offset: Number(offset) || 0,
    }),
  }).send(res);
};

export const getAllPublishedForShop = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const product_shop = req.user?.userId;

  if (!product_shop) {
    throw new BadRequestError('Product shop is required');
  }

  new SuccessResponse({
    message: 'Get list of published products for shop successfully',
    metadata: await ProductService.findAllPublishedForShop({
      product_shop,
      limit: Number(limit) || 60,
      offset: Number(offset) || 0,
    }),
  }).send(res);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { limit, page, sort, filter, select } = req.query as unknown as {
    limit: number;
    sort: string;
    page: number;
    filter: Record<string, any>;
    select: (keyof ProductItem)[];
  };

  new SuccessResponse({
    message: 'Get list products successfully',
    metadata: await ProductService.findAllProducts({ limit, page, sort, filter, select }),
  }).send(res);
};

export const getProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params as unknown as {
    product_id: string;
  };

  if (!product_id) {
    throw new BadRequestError('Product ID is required');
  }

  new SuccessResponse({
    message: 'Get product successfully',
    metadata: (await ProductService.findProduct({ product_id })) ?? {},
  }).send(res);
};

export const publishProductByShop = async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const product_shop = req.user?.userId;

  if (!product_shop || !productId) {
    throw new BadRequestError('Product shop and product ID are required');
  }

  new SuccessResponse({
    message: 'Publish product successfully',
    metadata: await ProductService.publishProductByShop({
      product_shop,
      productId,
    }),
  }).send(res);
};

export const unpublishProductByShop = async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const product_shop = req.user?.userId;

  if (!product_shop || !productId) {
    throw new BadRequestError('Product shop and product ID are required');
  }

  new SuccessResponse({
    message: 'Unpublish product successfully',
    metadata: await ProductService.unpublishProductByShop({
      product_shop,
      productId,
    }),
  }).send(res);
};

export const searchProductByUser = async (req: Request, res: Response) => {
  const { keySearch } = req.query;

  if (!keySearch || typeof keySearch !== 'string') {
    throw new BadRequestError('Key search is required and must be a string');
  }

  new SuccessResponse({
    message: 'Search products successfully',
    metadata: await ProductService.searchProductByUser({ keySearch }),
  }).send(res);
};
