import { SuccessResponse } from '@/core/success.response.js';
import { CheckoutReviewRequestSchema } from '@/schemas/checkout.js';
import { CheckoutService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const checkoutReview = async (req: Request, res: Response) => {
  const { cartId, userId, shop_orderIds } = await CheckoutReviewRequestSchema.parseAsync(req.body);

  new SuccessResponse({
    message: 'Checkout review successful',
    metadata: await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_orderIds: shop_orderIds as any,
    }),
  }).send(res);
};
