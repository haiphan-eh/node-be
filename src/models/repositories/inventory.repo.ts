import { InventoryModel, type InventoryType } from '@/models/inventory.model.js';
import type { QueryFilter, UpdateQuery } from 'mongoose';

export const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'Testing location',
}: {
  productId: string;
  shopId: string;
  stock: number;
  location?: string;
}) => {
  const query: QueryFilter<InventoryType> = {
    inventory_productId: productId,
    inventory_shopId: shopId,
  };
  const update: UpdateQuery<InventoryType> = {
    $inc: {
      inventory_stock: stock,
    },
    $set: {
      inventory_location: location,
    },
  };

  const options = { upsert: true, new: true };
  return InventoryModel.findOneAndUpdate(query, update, options);
};

export const reservationInventory = async ({
  productId,
  quantity,
  cartId,
}: { productId: string; quantity: number; cartId: string }) => {
  const query: QueryFilter<InventoryType> = {
    inventory_productId: productId,
    inventory_stock: { $gte: quantity },
  };
  const update: UpdateQuery<InventoryType> = {
    $inc: {
      inventory_stock: -quantity,
    },
    $push: {
      inventory_reservations: {
        quantity,
        cartId,
      },
    },
  };

  return InventoryModel.updateOne(query, update);
};
