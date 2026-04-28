import express from 'express';

import { apiKey, permission } from '@/auth/checkAuth.js';
import accessRoutes from './access/index.js';

const router = express.Router();

/* Middlewares */
router.use(apiKey);
router.use(permission('0000'));

/* Routes */
router.use('/v1/api', accessRoutes);

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello World' });
});

export default router;
