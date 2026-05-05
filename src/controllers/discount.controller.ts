import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import {
  CreateDiscountRequestSchema,
  GetDiscountAmountRequestSchema,
  GetDiscountCodesQuerySchema,
} from '@/schemas/discount.js';
import { DiscountService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const createDiscountCode = async (req: Request, res: Response) => {
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  const body = await CreateDiscountRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Create new discount code successfully',
    metadata: await DiscountService.createDiscountCode({
      ...body,
      shopId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    }),
  }).send(res);
};

export const getAllDiscountCodesByShop = async (req: Request, res: Response) => {
  const shopId = req.user?.userId;
  if (!shopId) throw new BadRequestError('Shop ID is required');

  new SuccessResponse({
    message: 'Get all discount codes for shop successfully',
    metadata: await DiscountService.getAllDiscountCodesByShop({ shopId }),
  }).send(res);
};

export const getAllDiscountCodesWithProductsByUser = async (req: Request, res: Response) => {
  const { code, shopId } = await GetDiscountCodesQuerySchema.parseAsync(req.query);

  new SuccessResponse({
    message: 'Get all discount codes successfully',
    metadata: await DiscountService.getAllDiscountCodesWithProductsByUser({
      code,
      shopId,
    }),
  }).send(res);
};

export const getDiscountAmount = async (req: Request, res: Response) => {
  const { code, products, shopId } = await GetDiscountAmountRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Get discount amount successfully',
    metadata: await DiscountService.getDiscountAmount({
      code,
      products: products as any,
      shopId,
    }),
  }).send(res);
};
