import { checkOverload } from '@/helpers/check.connect.js';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dbInstance from './dbs/init.mongodb.js';
const app = express();

/* Middleware */
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

/* Database */
dbInstance;
checkOverload();

export default app;
