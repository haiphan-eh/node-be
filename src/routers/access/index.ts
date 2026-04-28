import { asyncHandler } from '@/auth/checkAuth.js';
import { AccessController } from '@/controllers/index.js';
import express from 'express';

const router = express.Router();

router.post('/shop/signup', asyncHandler(AccessController.signup));
router.post('/shop/login', asyncHandler(AccessController.login));

export default router;
