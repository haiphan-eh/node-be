import type { Express } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Complete API documentation for ecommerce platform',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com',
      },
    },
    servers: [
      {
        url: 'https://ecommerce-be-0yom.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3055',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/docs/schemas/*.yaml', './src/docs/apis/*.yaml'],
};

export const setupSwagger = (app: Express) => {
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
