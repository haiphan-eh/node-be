import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
/**
 * Generates openapi.json from the Zod registry — no running server required.
 * Run: pnpm generate:spec
 * Then: pnpm generate:types  (produces src/types/api.ts for the frontend)
 */
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from '../src/docs/openapi-registry.js';

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

const outPath = resolve(process.cwd(), 'openapi.json');
writeFileSync(outPath, JSON.stringify(doc, null, 2));
console.log(`✓ OpenAPI spec written to ${outPath}`);
