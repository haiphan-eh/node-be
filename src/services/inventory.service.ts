import { InventoryRepository } from '@/models/repositories/index.js';
import { ProductService } from '@/services/index.js';

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
  // check if product exist
  const product = await ProductService.findProduct({ product_id: productId });

  if (!product) throw new Error('Product not found');

  return InventoryRepository.insertInventory({
    productId,
    shopId,
    stock,
    location,
  });
};

export const reservationInventory = async ({
  productId,
  quantity,
  cartId,
}: { productId: string; quantity: number; cartId: string }) => {
  return InventoryRepository.reservationInventory({
    productId,
    quantity,
    cartId,
  });
};
