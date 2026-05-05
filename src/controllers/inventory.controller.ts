import { SuccessResponse } from '@/core/success.response.js';
import { InsertInventoryRequestSchema } from '@/schemas/inventory.js';
import { InventoryService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const insertInventory = async (req: Request, res: Response) => {
  const { productId, shopId, stock, location } = await InsertInventoryRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Inventory insertion successful',
    metadata:
      (await InventoryService.insertInventory({
        productId,
        shopId,
        stock,
        location,
      })) ?? {},
  }).send(res);
};
