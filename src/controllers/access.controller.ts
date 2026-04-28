import { CREATED, SuccessResponse } from '@/core/success.response.js';
import { AccessService } from '@/services/index.js';
import type { NextFunction, Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  new SuccessResponse({
    message: 'Shop logged in successfully',
    metadata: await AccessService.login(req.body),
  }).send(res);
};

export const signup = async (req: Request, res: Response) => {
  new CREATED({
    message: 'Shop created successfully',
    metadata: await AccessService.signUp(req.body),
  }).send(res);
};
