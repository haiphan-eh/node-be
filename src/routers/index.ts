import express from 'express';

import accessRoutes from './access/index.js';

const router = express.Router();

router.use('/v1/api', accessRoutes);

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello World' });
});

export default router;
