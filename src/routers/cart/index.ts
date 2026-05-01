import { authentication } from '@/auth/authUtils.js';
import { CartController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

router.get('', asyncHandler(CartController.getListUserCart));
router.post('', asyncHandler(CartController.addProductToCart));
router.delete('', asyncHandler(CartController.deleteProductFromCart));

router.put('', asyncHandler(CartController.updateProductQuantity));

export default router;
