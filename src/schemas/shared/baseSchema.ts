import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

// Common reusable field definitions
export const nameSchema = z
  .string({
    required_error: 'Name is required',
  })
  .min(2)

export const emailSchema = z
  .string({
    required_error: 'Email is required',
  })
  .email('Invalid email format')

export const passwordSchema = z
  .string({
    required_error: 'Password is required',
  })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')

export const mobileSchema = z
  .string({
    required_error: 'Mobile number is required',
  })
  .transform(val => val.replace(/\s+/g, ''))
  .refine(
    val => /^\+?[1-9]\d{7,14}$/.test(val),
    'Invalid mobile number format. Use international format (+1234567890)',
  )
