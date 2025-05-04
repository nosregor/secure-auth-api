import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const refreshTokenCookieSchema = z
  .object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
      description: 'JWT refresh token stored in HttpOnly cookie',
    }),
  })
  .strict()
  .openapi('RefreshTokenCookie')

export const refreshTokenResponseSchema = z
  .object({
    accessToken: z
      .string({
        description: 'New JWT access token',
      })
      .openapi({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }),
    message: z.string().optional().openapi({
      example: 'Access token refreshed successfully',
    }),
  })
  .openapi('RefreshTokenResponse')

export const missingTokenErrorSchema = z
  .object({
    message: z.string().openapi({
      example: 'Missing refresh token',
    }),
  })
  .openapi('MissingTokenError')

export const invalidTokenErrorSchema = z
  .object({
    message: z.string().openapi({
      example: 'Invalid refresh token',
    }),
  })
  .openapi('InvalidTokenError')

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>
