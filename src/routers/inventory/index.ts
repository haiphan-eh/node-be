import { authentication } from '@/auth/authUtils.js';
import { InventoryController } from '@/controllers/index.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import express from 'express';

const router = express.Router();

// For users

router.use(authentication);

// For shops
router.post('', asyncHandler(InventoryController.insertInventory));

export default router;
