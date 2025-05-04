import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { passwordSchema } from '../shared/baseSchema'

extendZodWithOpenApi(z)

export const changePasswordRequestSchema = z.object({
  code: z.string().min(4).max(6),
  newPassword: passwordSchema,
})

export const requestPasswordChangeResponseSchema = z.object({
  message: z.string(),
  code: z.string().min(4),
})

export const changePasswordResponseSchema = z.object({
  message: z.string(),
})
