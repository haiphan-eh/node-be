import { HEADER } from '@/auth/constant.js';
import { AuthFailureError } from '@/core/error.response.js';
import type { IApiKey } from '@/models/apiKey.model.js';
import { findById } from '@/services/apiKey.service.js';
import type { NextFunction, Request, Response } from 'express';

export const apiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers[HEADER.API_KEY]?.toString();
  if (!apiKey) {
    throw new AuthFailureError('Forbidden Error');
  }

  /* TODO: remove later */
  // await ApiKeyService.createKey({
  //   key: apiKey,
  //   permissions: ['0000'],
  // });

  const objKey = await findById(apiKey);
  if (!objKey) {
    throw new AuthFailureError('Invalid API key');
  }
  req.objKey = objKey;
  next();
};

export const permission = (permission: IApiKey['permissions'][0]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions) {
      throw new AuthFailureError('Permission denied');
    }

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      throw new AuthFailureError('Permission denied');
    }
    next();
  };
};
