import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import type { ProductItem, ProductKeys, ProductType } from '@/models/product.model.js';
import { DiscountService, ProductService } from '@/services/index.js';
import type { Request, Response } from 'express';

type DiscountItem = {
  code: string;
  startDate: Date;
  endDate: Date;
  type: 'percentage' | 'fixed_amount';
  isActive: boolean;
  shopId: string;
  minOrderValue: number;
  description: string;
  value: number;
  appliesTo: 'all_products' | 'specific_products';
  name: string;
  maxUses: number;
  maxUsesPerUser: number;
  productIds?: string[]; // Optional: Array of product IDs the discount applies to (if appliesTo is 'specific_products')
  maxValue?: number; // Optional: Maximum discount value for percentage type
  useCount?: number; // Optional: Number of times the code has been used
};

/* Mock value 
  const payload: DiscountItem = {
    code: 'SUMMER20',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    type: 'percentage',
    isActive: true,
    shopId: 'shop123',
    minOrderValue: 50,
    description: '20% off on all products during summer sale',
    value: 20,
    appliesTo: 'all_products',
    name: 'Summer Sale 2024',
    maxUses: 100,
    maxUsesPerUser: 2,
  };
*/

export const createDiscountCode = async (req: Request, res: Response) => {
  const payload = req.body as DiscountItem;
  const shopId = req.user?.userId;

  if (!shopId) {
    throw new BadRequestError('Shop ID is required');
  }

  payload.shopId = shopId;

  new SuccessResponse({
    message: 'Create new discount code successfully',
    metadata: await DiscountService.createDiscountCode(payload),
  }).send(res);
};

export const getAllDiscountCodesByShop = async (req: Request, res: Response) => {
  const shopId = req.user?.userId;

  if (!shopId) {
    throw new BadRequestError('Shop ID is required');
  }

  new SuccessResponse({
    message: 'Get all discount codes for shop successfully',
    metadata: await DiscountService.getAllDiscountCodesByShop({ shopId }),
  }).send(res);
};

export const getAllDiscountCodesWithProductsByUser = async (req: Request, res: Response) => {
  const { code, shopId } = req.query as { code?: string; shopId?: string };

  if (!shopId) {
    throw new BadRequestError('Shop ID is required');
  }

  if (!code) {
    throw new BadRequestError('Discount code is required');
  }

  new SuccessResponse({
    message: 'Get all discount codes successfully',
    metadata: await DiscountService.getAllDiscountCodesWithProductsByUser({ code, shopId }),
  }).send(res);
};

export const getDiscountAmount = async (req: Request, res: Response) => {
  const { code, products, shopId } = req.body as { shopId: string; code: string; products: ProductItem[] };

  if (!shopId) {
    throw new BadRequestError('Shop ID is required');
  }

  if (!code) {
    throw new BadRequestError('Discount code is required');
  }

  if (!products || products.length === 0) {
    throw new BadRequestError('Products are required to calculate discount amount');
  }

  new SuccessResponse({
    message: 'Get discount amount successfully',
    metadata: await DiscountService.getDiscountAmount({ code, products, shopId }),
  }).send(res);
};
