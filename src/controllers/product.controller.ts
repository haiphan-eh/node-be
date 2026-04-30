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
