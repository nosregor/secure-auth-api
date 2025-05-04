import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { emailSchema, mobileSchema, nameSchema, passwordSchema } from '../shared/baseSchema'

extendZodWithOpenApi(z)

export const registerSchema = z
  .object({
    name: nameSchema,
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
