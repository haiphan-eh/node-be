import type { IApiKey } from '@/models/apiKey.model.js';
import { findById } from '@/services/apiKey.service.js';
import type { NextFunction, Request, Response } from 'express';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

export const apiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers[HEADER.API_KEY]?.toString();
    if (!apiKey) {
      return res.status(403).json({ message: 'Forbidden Error' });
    }
    // Check if the API key is valid
    const objKey = await findById(apiKey);
    if (!objKey) {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    req.objKey = objKey;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const permission = (permission: IApiKey['permissions'][0]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
