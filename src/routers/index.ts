import express from 'express';

import { apiKey, permission } from '@/auth/checkAuth.js';
import accessRoutes from './access/index.js';
import productRoutes from './product/index.js';

const router = express.Router();

/* Middlewares */
router.use(apiKey);
router.use(permission('0000'));

/* Routes */
router.use('/v1/api', accessRoutes);
router.use('/v1/api/product', productRoutes);

export default router;
