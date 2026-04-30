import { authentication } from '@/auth/authUtils.js';
import { ProductController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

router.use(authentication);
router.post('', asyncHandler(ProductController.createProduct));

export default router;
