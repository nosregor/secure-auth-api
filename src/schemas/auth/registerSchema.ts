import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { emailSchema, mobileSchema, passwordSchema } from '../shared/baseSchema'

extendZodWithOpenApi(z)

export const registerSchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2),
    email: emailSchema,
    password: passwordSchema,
    mobile: mobileSchema,
  })
  .openapi('User')

export const registerResponseSchema = z
  .object({
    message: z.string(),
    userId: z.string(),
  })
  .openapi('RegisterResponse')

export type UserInput = z.infer<typeof registerSchema>
