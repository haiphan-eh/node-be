import { AccessService } from '@/services/index.js';
import type { NextFunction, Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  return res.status(201).json(await AccessService.signUp(req.body));
};
