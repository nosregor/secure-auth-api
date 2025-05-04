import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { emailSchema } from '../shared/baseSchema'

extendZodWithOpenApi(z)
export const loginSchema = z
  .object({
    email: emailSchema,
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password is required'),
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

// export const loginSchema = userSchema.pick({
//   email: true,
//   password: true
// }).extend({
//   password: z.string().min(1) // Override to remove complexity checks
// })
