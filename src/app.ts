import { checkOverload } from '@/helpers/check.connect.js';
import router from '@/routers/index.js';
import compression from 'compression';
import express from 'express';
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
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  });
});
export default app;
