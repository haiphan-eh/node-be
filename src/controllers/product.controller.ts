import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import type { ProductType } from '@/models/product.model.js';
import { ProductService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  const payload = req.body;
  const { product_type: type } = payload as { product_type: ProductType };

  payload.product_shop = req.user?.userId;

  new SuccessResponse({
    message: 'Create new product successfully',
    metadata: await ProductService.createProduct({ type, payload }),
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
