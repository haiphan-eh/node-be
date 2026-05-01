import { inventoryModel } from '@/models/inventory.model.js';

export const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'Unknown',
}: {
  productId: string;
  shopId: string;
  stock: number;
  location?: string;
}) => {
  return inventoryModel.create({
    inventory_productId: productId,
    inventory_stock: stock,
    inventory_shopId: shopId,
    inventory_location: location,
  });
};
