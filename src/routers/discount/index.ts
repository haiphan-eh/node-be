import { authentication } from '@/auth/authUtils.js';
import { DiscountController, ProductController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

// For users
router.get('/list-product-code', asyncHandler(DiscountController.getAllDiscountCodesWithProductsByUser));
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount));

router.use(authentication);

// For shops
router.get('', asyncHandler(DiscountController.getAllDiscountCodesByShop));
router.post('', asyncHandler(DiscountController.createDiscountCode));

export default router;
