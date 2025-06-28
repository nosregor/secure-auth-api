import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

// 2FA Verification Schema
export const verify2FASchema = z
  .object({
    userId: z
      .string({
        required_error: 'User ID is required',
      })
      .min(1)
      .openapi({
        example: '507f1f77bcf86cd799439011',
        description: 'User ID from the initial login response',
      }),

    code: z
      .string({
        required_error: 'Verification code is required',
      })
      .length(6, 'Code must be 6 digits')
      .regex(/^\d+$/, 'Code must contain only digits')
      .openapi({
        example: '123456',
        description: '6-digit verification code received via SMS/email',
      }),
    // password: passwordSchema,
  })
  .strict()
  .openapi('Verify2FA')

// Response Schema
export const verify2FAResponseSchema = z
  .object({
    accessToken: z.string().openapi({
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      description: 'JWT access token for authenticated requests',
    }),
    message: z.string().openapi({
      example: '2FA verified',
    }),
  })
  .openapi('Verify2FAResponse')

// Error Response Schema
export const verify2FAErrorSchema = z
  .object({
    message: z.string().openapi({
      example: 'Invalid or expired 2FA code',
    }),
  })
  .openapi('Verify2FAError')

// TypeScript Types
export type Verify2FAInput = z.infer<typeof verify2FASchema>
export type Verify2FAResponse = z.infer<typeof verify2FAResponseSchema>
