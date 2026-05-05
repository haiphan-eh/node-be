import { BadRequestError } from '@/core/error.response.js';
import { CREATED, SuccessResponse } from '@/core/success.response.js';
import { LoginRequestSchema, SignupRequestSchema } from '@/schemas/auth.js';
import { AccessService } from '@/services/index.js';
import type { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  // Validate request with Zod
  const validatedData = await LoginRequestSchema.parseAsync(req.body);
  new SuccessResponse({
    message: 'Shop logged in successfully',
    metadata: await AccessService.login(validatedData),
  }).send(res);
};

export const signup = async (req: Request, res: Response) => {
  // Validate request with Zod
  const validatedData = await SignupRequestSchema.parseAsync(req.body);
  new CREATED({
    message: 'Shop created successfully',
    metadata: await AccessService.signUp(validatedData),
  }).send(res);
};

export const logout = async (req: Request, res: Response) => {
  new SuccessResponse({
    message: 'Shop logged out successfully',
    metadata: await AccessService.logout({ userId: req.user?.userId ?? '' }),
  }).send(res);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken, user, keyStore } = req;
  if (!refreshToken || !user || !keyStore) {
    throw new BadRequestError('Invalid request: Missing refresh token, user, or key store');
  }
  new SuccessResponse({
    message: 'Refresh token successfully',
    metadata: await AccessService.refreshToken({ refreshToken, user, keyStore }),
  }).send(res);
};
