import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { emailSchema, passwordSchema } from '../shared/baseSchema'

extendZodWithOpenApi(z)
export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict()
  .openapi('Login')

export const loginResponseSchema = z
  .object({
    message: z.string(),
    userId: z.string(),
    code: z.string(),
  })
  .openapi('LoginResponse')

export type LoginInput = z.infer<typeof loginSchema>
