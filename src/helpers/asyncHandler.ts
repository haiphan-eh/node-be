import type { NextFunction, Request, Response } from 'express';

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
