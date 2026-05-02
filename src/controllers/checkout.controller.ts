import { BadRequestError } from '@/core/error.response.js';
import { SuccessResponse } from '@/core/success.response.js';
import { CheckoutService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const checkoutReview = async (req: Request, res: Response) => {
  console.log(req.body);
  const { cartId, shop_orderIds, userId } = req.body;

  if (!cartId || !shop_orderIds || !userId) throw new BadRequestError('Missing required fields');

  const result = await CheckoutService.checkoutReview({ cartId, userId, shop_orderIds });

  new SuccessResponse({
    message: 'Checkout review successful',
    metadata: result,
  }).send(res);
};
