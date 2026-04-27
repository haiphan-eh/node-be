import { AccessController } from '@/controllers/index.js';
import express from 'express';

const router = express.Router();

router.post('/shop/signup', AccessController.signup);

export default router;
