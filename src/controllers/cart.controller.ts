import { SuccessResponse } from '@/core/success.response.js';
import {
  AddToCartRequestSchema,
  DeleteFromCartRequestSchema,
  GetCartQuerySchema,
  UpdateCartRequestSchema,
} from '@/schemas/cart.js';
import { CartService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const addProductToCart = async (req: Request, res: Response) => {
  const { userId, product } = await AddToCartRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Add product to cart successfully',
    metadata:
      (await CartService.addProductToCart({
        userId,
        product: product as any,
      })) ?? {},
  }).send(res);
};

export const updateProductQuantity = async (req: Request, res: Response) => {
  const { userId, shop_orderIds } = await UpdateCartRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Update product quantity successfully',
    metadata:
      (await CartService.updateProductQuantity({
        userId,
        shop_orderIds: shop_orderIds as any,
      })) ?? {},
  }).send(res);
};

export const getListUserCart = async (req: Request, res: Response) => {
  const { userId } = await GetCartQuerySchema.parseAsync(req.query);

  new SuccessResponse({
    message: 'Get list of carts for user successfully',
    metadata: (await CartService.getListUserCart({ userId: Number(userId) })) ?? {},
  }).send(res);
};

export const deleteProductFromCart = async (req: Request, res: Response) => {
  const { userId, productId } = await DeleteFromCartRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Delete product from cart successfully',
    metadata: await CartService.deleteProductFromCart({ userId, productId }),
  }).send(res);
};
