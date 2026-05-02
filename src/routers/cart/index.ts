import { CartController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

router.get('', asyncHandler(CartController.getListUserCart));
router.post('', asyncHandler(CartController.addProductToCart));
router.put('', asyncHandler(CartController.updateProductQuantity));
router.delete('', asyncHandler(CartController.deleteProductFromCart));

export default router;
