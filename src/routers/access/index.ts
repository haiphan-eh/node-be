import { asyncHandler } from '@/auth/checkAuth.js';
import { AccessController } from '@/controllers/index.js';
import express from 'express';

const router = express.Router();

router.post('/shop/signup', asyncHandler(AccessController.signup));

export default router;
