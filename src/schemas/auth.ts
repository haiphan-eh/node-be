import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schemas
export const SignupRequestSchema = z.object({
  name: z.string().min(1).openapi({ example: 'My Shop' }),
  email: z.string().email().openapi({ example: 'shop@example.com' }),
  password: z.string().min(6).openapi({ example: 'SecurePassword123' }),
});

export const LoginRequestSchema = z.object({
  email: z.string().email().openapi({ example: 'shop@example.com' }),
  password: z.string().min(6).openapi({ example: 'SecurePassword123' }),
  refreshToken: z.string().optional().openapi({ description: 'Optional refresh token' }),
});

export const LogoutRequestSchema = z.object({});

export const RefreshTokenRequestSchema = z.object({});

// Response Schemas
export const ShopSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const SignupResponseSchema = z.object({
  code: z.number().openapi({ example: 201 }),
  message: z.string().openapi({ example: 'Shop created successfully' }),
  metadata: z.object({
    shop: ShopSchema,
    tokens: TokensSchema,
  }),
});

export const LoginResponseSchema = z.object({
  code: z.number().openapi({ example: 200 }),
  message: z.string().openapi({ example: 'Login successful' }),
  metadata: z.object({
    shop: ShopSchema,
    tokens: TokensSchema,
  }),
});

export const LogoutResponseSchema = z.object({
  code: z.number().openapi({ example: 200 }),
  message: z.string().openapi({ example: 'Logout successful' }),
});

export const RefreshTokenResponseSchema = z.object({
  code: z.number().openapi({ example: 200 }),
  message: z.string().openapi({ example: 'Token refreshed successfully' }),
  metadata: z.object({
    tokens: TokensSchema,
  }),
});
