import type { ErrorResponse } from '@/core/error.response.js';
import { checkOverload } from '@/helpers/check.connect.js';
import router from '@/routers/index.js';
import compression from 'compression';
import express, { type NextFunction, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dbInstance from './dbs/init.mongodb.js';
const app = express();

/* Middleware */
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

/* Routes */
app.use(router);
/* Database */
dbInstance;
checkOverload();

/* Handle Errors */
app.use((error: ErrorResponse, _: unknown, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const errorResponse: {
    status: string;
    code: number;
    message: string;
    stack?: string;
  } = {
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  return res.status(statusCode).json(errorResponse);
});
export default app;
