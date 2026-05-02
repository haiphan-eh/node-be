import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import { InventoryService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const insertInventory = async (req: Request, res: Response) => {
  console.log(req.body);
  const { productId, shopId, stock, location } = req.body;

  if (!productId || !shopId || !stock) throw new BadRequestError('Missing required fields');

  const result = (await InventoryService.insertInventory({ productId, shopId, stock, location })) ?? {};

  new SuccessResponse({
    message: 'Inventory insertion successful',
    metadata: result,
  }).send(res);
};
