import type { ErrorResponse } from '@/core/error.response.js';
import { setupSwagger } from '@/docs/swagger.js';
import { checkOverload } from '@/helpers/check.connect.js';
import router from '@/routers/index.js';
import compression from 'compression';
import cors from 'cors';
import express, { type NextFunction, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { ZodError } from 'zod';
import dbInstance from './dbs/init.mongodb.js';

const app = express();

/* Middleware */
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-api-key',
      'x-client-id',
      'x-refresh-token',
      'x-request-id',
      'cache-control',
    ],
    credentials: true,
  }),
);

/* Swagger */
setupSwagger(app);

/* Routes */
app.use(router);
/* Database */
dbInstance;
checkOverload();

/* Handle Errors */
app.use((error: unknown, _: unknown, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    return res.status(400).json({ status: 'error', code: 400, message });
  }

  const err = error as ErrorResponse;
  const statusCode = err.statusCode || 500;
  const body: {
    status: string;
    code: number;
    message: string;
    stack?: string;
  } = {
    status: 'error',
    code: statusCode,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  return res.status(statusCode).json(body);
});
export default app;
