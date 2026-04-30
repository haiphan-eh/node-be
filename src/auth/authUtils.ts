import { HEADER } from '@/auth/constant.js';
import { AuthFailureError, NotFoundError } from '@/core/error.response.js';
import { asyncHandler } from '@/helpers/asyncHandler.js';
import { KeyTokenService } from '@/services/index.js';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';

export const createTokenPair = async ({
  payload,
  publicKey,
  privateKey,
}: { payload: any; publicKey: string; privateKey: string }) => {
  const accessToken = jwt.sign(payload, publicKey, {
    expiresIn: '2 days',
  });
  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: '7 days',
  });

  /* vì đây là cặp keys bất đối xứng, nên có thể sử dụng đẻ mã hoá */
  jwt.verify(accessToken, publicKey, (err, decoded) => {
    if (err) {
      console.error('Access token verification failed:', err);
    } else {
      console.log('Access token decoded successfully:', decoded);
    }
  });
  return { accessToken, refreshToken };
};

export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID] as string | undefined;
  if (!userId) {
    throw new AuthFailureError("Invalid request: Missing 'client-id' header");
  }

  const keyStore = await KeyTokenService.findByUserId(userId.toString());
  if (!keyStore) {
    throw new NotFoundError('Invalid request: No key store found for user');
  }

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString();
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, keyStore.privateKey);
      if (typeof decoded === 'object') {
        if (userId !== decoded.userId) throw new AuthFailureError('Invalid User');
        req.user = decoded;
      }

      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      return next();
    } catch (_error) {
      throw new AuthFailureError('Refresh Token expired or invalid');
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken) {
    throw new AuthFailureError("Invalid request: Missing 'authorization' header");
  }

  try {
    const decoded = jwt.verify(accessToken.toString(), keyStore.publicKey);
    if (typeof decoded === 'object') {
      if (userId !== decoded.userId) throw new AuthFailureError('Invalid request: User ID mismatch');
      req.user = decoded;
    }

    req.keyStore = keyStore;
    next();
  } catch (_error) {
    throw new AuthFailureError('Invalid request: Access token verification failed');
  }
});
