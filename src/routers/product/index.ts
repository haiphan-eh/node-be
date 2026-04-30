import { authentication } from '@/auth/authUtils.js';
import { ProductController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

router.get('/search/:keySearch', asyncHandler(ProductController.searchProductByUser));
router.get('', asyncHandler(ProductController.getAllProducts));
router.get('/:product_id', asyncHandler(ProductController.getProduct));

router.use(authentication);

router.post('', asyncHandler(ProductController.createProduct));
router.patch('/:productId', asyncHandler(ProductController.updateProduct));
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(ProductController.unpublishProductByShop));

router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(ProductController.getAllPublishedForShop));

export default router;
