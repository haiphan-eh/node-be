import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { registry } from './openapi-registry.js';

export const setupSwagger = (app: Express) => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const doc = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Complete API documentation for the ecommerce platform',
      contact: { name: 'API Support', email: 'support@ecommerce.com' },
    },
    servers: [
      {
        url: 'https://ecommerce-be-0yom.onrender.com',
        description: 'Production server',
      },
      { url: 'http://localhost:3055', description: 'Development server' },
    ],
    security: [{ ApiKeyAuth: [] }],
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc));

  // Serve raw JSON spec — useful for frontend code generation (openapi-typescript, Orval, etc.)
  app.get('/api-docs.json', (_req, res) => res.json(doc));
};
