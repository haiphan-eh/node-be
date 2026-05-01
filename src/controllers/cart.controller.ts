import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import { CartService } from '@/services/index.js';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';

/* 
  m
*/
export const addProductToCart = async (req: Request, res: Response) => {
  const payload = req.body;
  const { userId, product } = payload;

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  new SuccessResponse({
    message: 'Add product to cart successfully',
    metadata: (await CartService.addProductToCart({ userId, product })) ?? {},
  }).send(res);
};

/* mock data
  {
    "userId": 1,
    "shop_orderIds": [
        {
            "shopId": "64a1c9e5b8d1c0e4f8b4567",
            "item_products": [
                {
                    "productId": "64a1c9e5b8d1c0e4f8b4567",
                    "quantity": 2,
                    "old_quantity": 1
                }
            ]
        }
    ]
  }
*/
export const updateProductQuantity = async (req: Request, res: Response) => {
  const payload = req.body;
  const { userId, shop_orderIds } = payload;

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  new SuccessResponse({
    message: 'Update product quantity successfully',
    metadata: (await CartService.updateProductQuantity({ userId, shop_orderIds })) ?? {},
  }).send(res);
};

export const getListUserCart = async (req: Request, res: Response) => {
  console.log(req.query);
  const userId = req.query.userId as unknown as number;

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  new SuccessResponse({
    message: 'Get list of carts for user successfully',
    metadata:
      (await CartService.getListUserCart({
        userId,
      })) ?? {},
  }).send(res);
};

export const deleteProductFromCart = async (req: Request, res: Response) => {
  const payload = req.body;
  const { userId, productId } = payload;

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  new SuccessResponse({
    message: 'Delete product from cart successfully',
    metadata: await CartService.deleteProductFromCart({
      userId,
      productId,
    }),
  }).send(res);
};
