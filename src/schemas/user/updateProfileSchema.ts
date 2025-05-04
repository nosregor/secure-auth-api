import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { emailSchema, nameSchema } from '../shared/baseSchema'

extendZodWithOpenApi(z)

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
})

export const updateProfileResponseSchema = z.object({
  message: z.string(),
})
