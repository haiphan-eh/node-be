import { CheckoutController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

router.post('', asyncHandler(CheckoutController.checkoutReview));

export default router;
