import express from 'express';

import { apiKey, permission } from '@/auth/checkAuth.js';
import accessRoutes from './access/index.js';
import cartRoutes from './cart/index.js';
import checkoutRoutes from './checkout/index.js';
import discountRoutes from './discount/index.js';
import inventoryRoutes from './inventory/index.js';
import productRoutes from './product/index.js';

const router = express.Router();

/* Health check */
router.get('/', (_req, res) => {
  res.json({ message: 'hello world' });
});

/* Middlewares */
router.use(apiKey);
router.use(permission('0000'));

/* Routes */
router.use('/v1/api/inventory', inventoryRoutes);
router.use('/v1/api/checkout', checkoutRoutes);
router.use('/v1/api/discount', discountRoutes);
router.use('/v1/api/cart', cartRoutes);
router.use('/v1/api/product', productRoutes);
router.use('/v1/api', accessRoutes);

export default router;
