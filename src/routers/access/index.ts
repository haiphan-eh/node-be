import { authentication } from '@/auth/authUtils.js';
import { AccessController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

router.post('/shop/signup', asyncHandler(AccessController.signup));
router.post('/shop/login', asyncHandler(AccessController.login));

router.use(authentication);
router.post('/shop/logout', asyncHandler(AccessController.logout));
router.post('/shop/refresh-token', asyncHandler(AccessController.refreshToken));

export default router;
