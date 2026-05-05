import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  AddToCartRequestSchema,
  DeleteFromCartRequestSchema,
  GetCartQuerySchema,
  UpdateCartRequestSchema,
} from '@/schemas/cart.js';
import { CheckoutReviewRequestSchema } from '@/schemas/checkout.js';
import {
  CreateDiscountRequestSchema,
  GetDiscountAmountRequestSchema,
  GetDiscountCodesQuerySchema,
} from '@/schemas/discount.js';
import {
  ErrorResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  LogoutResponseSchema,
  RefreshTokenResponseSchema,
  SignupRequestSchema,
  SignupResponseSchema,
} from '@/schemas/index.js';
import { InsertInventoryRequestSchema } from '@/schemas/inventory.js';
import {
  CreateProductRequestSchema,
  ProductListQuerySchema,
  ProductSearchQuerySchema,
  ShopProductQuerySchema,
  UpdateProductRequestSchema,
} from '@/schemas/product.js';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// ─── Security schemes ────────────────────────────────────────────────────────
// All four appear in the Swagger UI "Authorize" dialog.
// Set them once and they apply to every request that lists them in `security`.

registry.registerComponent('securitySchemes', 'ApiKeyAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'x-api-key',
  description: 'Required for every endpoint.',
});

registry.registerComponent('securitySchemes', 'ClientIdAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'x-client-id',
  description: 'Shop/User ObjectId — from login response: `metadata.shop._id`',
});

registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Access token — from login response: `metadata.tokens.accessToken`',
});

registry.registerComponent('securitySchemes', 'RefreshTokenAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'x-refresh-token',
  description:
    'Refresh token — from login response: `metadata.tokens.refreshToken`. Used only for the refresh-token endpoint.',
});

// ─── Security shorthand ───────────────────────────────────────────────────────

const publicSecurity = [{ ApiKeyAuth: [] }];
const authSecurity = [{ ApiKeyAuth: [], ClientIdAuth: [], BearerAuth: [] }];
const refreshSecurity = [{ ApiKeyAuth: [], ClientIdAuth: [], RefreshTokenAuth: [] }];

// ─── Register named schemas ───────────────────────────────────────────────────

registry.register('Error', ErrorResponseSchema);
registry.register('SignupRequest', SignupRequestSchema);
registry.register('SignupResponse', SignupResponseSchema);
registry.register('LoginRequest', LoginRequestSchema);
registry.register('LoginResponse', LoginResponseSchema);

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════

registry.registerPath({
  method: 'post',
  path: '/v1/api/shop/signup',
  tags: ['Auth'],
  summary: 'Sign up',
  description: 'Create a new shop account. Returns tokens and shop info.',
  security: publicSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: SignupRequestSchema } },
    },
  },
  responses: {
    201: {
      description: 'Shop created successfully',
      content: { 'application/json': { schema: SignupResponseSchema } },
    },
    400: {
      description: 'Validation error or email already registered',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/shop/login',
  tags: ['Auth'],
  summary: 'Login',
  description: 'Authenticate a shop and receive access + refresh tokens.',
  security: publicSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: LoginRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: { 'application/json': { schema: LoginResponseSchema } },
    },
    400: {
      description: 'Shop not registered',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Invalid password',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/shop/logout',
  tags: ['Auth'],
  summary: 'Logout',
  description: 'Invalidate the current session. Requires `x-api-key` + `x-client-id` + Bearer token.',
  security: authSecurity,
  responses: {
    200: {
      description: 'Logged out successfully',
      content: { 'application/json': { schema: LogoutResponseSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/shop/refresh-token',
  tags: ['Auth'],
  summary: 'Refresh token',
  description:
    'Rotate tokens using a refresh token. Send `x-refresh-token` header instead of Bearer. The old refresh token is invalidated after use.',
  security: refreshSecurity,
  responses: {
    200: {
      description: 'Tokens refreshed',
      content: { 'application/json': { schema: RefreshTokenResponseSchema } },
    },
    401: {
      description: 'Refresh token expired or already used',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT
// ═══════════════════════════════════════════════════════════════════════════════

registry.registerPath({
  method: 'get',
  path: '/v1/api/product',
  tags: ['Product'],
  summary: 'Get all products',
  description: 'Retrieve published products with optional pagination and sorting.',
  security: publicSecurity,
  request: { query: ProductListQuerySchema },
  responses: { 200: { description: 'Products retrieved successfully' } },
});

registry.registerPath({
  method: 'get',
  path: '/v1/api/product/search/{keySearch}',
  tags: ['Product'],
  summary: 'Search products',
  description: 'Full-text search across product_name and product_description.',
  security: publicSecurity,
  request: {
    params: z.object({
      keySearch: z.string().openapi({ example: 'laptop', description: 'Search keyword' }),
    }),
    query: ProductSearchQuerySchema,
  },
  responses: {
    200: { description: 'Search results' },
    400: {
      description: 'keySearch is required',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/api/product/{product_id}',
  tags: ['Product'],
  summary: 'Get product by ID',
  security: publicSecurity,
  request: {
    params: z.object({
      product_id: z.string().openapi({ example: '69f33c5ff07aeb97d599861e' }),
    }),
  },
  responses: {
    200: { description: 'Product details' },
    404: {
      description: 'Product not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/api/product/drafts/all',
  tags: ['Product'],
  summary: 'Get draft products (shop)',
  description: 'Returns all draft products belonging to the authenticated shop.',
  security: authSecurity,
  request: { query: ShopProductQuerySchema },
  responses: {
    200: { description: 'Draft products retrieved' },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/api/product/published/all',
  tags: ['Product'],
  summary: 'Get published products (shop)',
  description: 'Returns all published products belonging to the authenticated shop.',
  security: authSecurity,
  request: { query: ShopProductQuerySchema },
  responses: {
    200: { description: 'Published products retrieved' },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/product',
  tags: ['Product'],
  summary: 'Create product',
  description: 'Create a new product. `product_shop` is set automatically from the authenticated user.',
  security: authSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: CreateProductRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Product created successfully' },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/v1/api/product/{productId}',
  tags: ['Product'],
  summary: 'Update product',
  description: 'Partially update a product. All body fields are optional.',
  security: authSecurity,
  request: {
    params: z.object({
      productId: z.string().openapi({ example: '69f33c5ff07aeb97d599861e' }),
    }),
    body: {
      required: true,
      content: { 'application/json': { schema: UpdateProductRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Product updated successfully' },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/product/publish/{id}',
  tags: ['Product'],
  summary: 'Publish product',
  description: 'Make a draft product publicly visible.',
  security: authSecurity,
  request: {
    params: z.object({
      id: z.string().openapi({
        example: '69f33c5ff07aeb97d599861e',
        description: 'Product ID',
      }),
    }),
  },
  responses: {
    200: { description: 'Product published' },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/product/unpublish/{id}',
  tags: ['Product'],
  summary: 'Unpublish product',
  description: 'Move a published product back to draft.',
  security: authSecurity,
  request: {
    params: z.object({
      id: z.string().openapi({
        example: '69f33c5ff07aeb97d599861e',
        description: 'Product ID',
      }),
    }),
  },
  responses: {
    200: { description: 'Product unpublished' },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════════════════════════════════════

registry.registerPath({
  method: 'get',
  path: '/v1/api/cart',
  tags: ['Cart'],
  summary: 'Get user cart',
  description: 'Retrieve cart for a given userId. No authentication required.',
  security: publicSecurity,
  request: { query: GetCartQuerySchema },
  responses: {
    200: { description: 'Cart retrieved successfully' },
    400: {
      description: 'userId is required',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/cart',
  tags: ['Cart'],
  summary: 'Add product to cart',
  description: 'Add a product to the cart. Creates a new cart if one does not exist for the userId.',
  security: publicSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: AddToCartRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Product added to cart' },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/v1/api/cart',
  tags: ['Cart'],
  summary: 'Update product quantity in cart',
  description: 'Update quantity of one or more products. Provide both `quantity` (new) and `old_quantity` (current).',
  security: publicSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: UpdateCartRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Cart updated successfully' },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/v1/api/cart',
  tags: ['Cart'],
  summary: 'Remove product from cart',
  security: publicSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: DeleteFromCartRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Product removed from cart' },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// DISCOUNT
// ═══════════════════════════════════════════════════════════════════════════════

registry.registerPath({
  method: 'get',
  path: '/v1/api/discount/list-product-code',
  tags: ['Discount'],
  summary: 'Get products for a discount code (user)',
  description: 'Returns the list of products eligible for a given discount code.',
  security: publicSecurity,
  request: { query: GetDiscountCodesQuerySchema },
  responses: {
    200: { description: 'Products with discount retrieved' },
    400: {
      description: 'shopId or code is missing',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/discount/amount',
  tags: ['Discount'],
  summary: 'Calculate discount amount',
  description: 'Compute the discount for a set of products using a discount code.',
  security: publicSecurity,
  request: {
    body: {
      required: true,
      content: {
        'application/json': { schema: GetDiscountAmountRequestSchema },
      },
    },
  },
  responses: {
    200: { description: 'Discount amount calculated' },
    400: {
      description: 'Invalid code or products',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/api/discount',
  tags: ['Discount'],
  summary: 'Get all discount codes (shop)',
  description: 'Returns all discount codes created by the authenticated shop.',
  security: authSecurity,
  responses: {
    200: { description: 'Discount codes retrieved' },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/api/discount',
  tags: ['Discount'],
  summary: 'Create discount code',
  description: 'Create a new discount code. `shopId` is taken from the authenticated user, not the request body.',
  security: authSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: CreateDiscountRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Discount code created' },
    400: {
      description: 'Validation error or code already exists',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════════

registry.registerPath({
  method: 'post',
  path: '/v1/api/checkout',
  tags: ['Checkout'],
  summary: 'Checkout review',
  description: 'Preview order totals — applies discounts and validates product availability. Does not place an order.',
  security: publicSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: CheckoutReviewRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Checkout review successful' },
    400: {
      description: 'Missing fields, cart not found, or products unavailable',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════════════════════════════

registry.registerPath({
  method: 'post',
  path: '/v1/api/inventory',
  tags: ['Inventory'],
  summary: 'Insert inventory',
  description: 'Add or update stock for a product in the authenticated shop.',
  security: authSecurity,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: InsertInventoryRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Inventory updated successfully' },
    400: {
      description: 'Missing required fields',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});
