import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const userSchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2)
      .openapi({
        example: 'John Doe',
        description: 'Full name of the user',
      }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .openapi({
        example: 'john_doe@meail.com',
        description: 'Email address of the user',
      }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .openapi({
        example: 'Password123',
        description: 'Password with minimum 8 characters, 1 uppercase, 1 lowercase, and 1 number',
      }),
    mobile: z
      .string({ required_error: 'Mobile number is required' })
      .transform(val => val.replace(/\s+/g, ''))
      .refine(
        val => /^\+?[1-9]\d{7,14}$/.test(val), // E.164 format
        'Invalid mobile number format. Use international format (+1234567890)',
      )
      .openapi({
        example: '+1234567890',
        description: 'International phone number format',
      }),
  })
  .openapi('User')

// TypeScript type from schema
export type UserInput = z.infer<typeof userSchema>

export enum UserStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}
export const queryStringValidator = z.object({
  query: z.object({
    // Name is required and must have 4 or more characters
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(4, 'Name must be bigger than 4 characters'),
    // Last name is optional
    lastName: z.string().optional(),
    // Age is required, we expect a number but, because we are receiving values from query string all will be stirngs
    age: z.string({
      required_error: 'Age is required',
    }),
    // Status is required and must one of the value defined in the enum
    status: z.nativeEnum(UserStatus, {
      required_error: 'Status is required',
      invalid_type_error: 'Status is not valid',
    }),
  }),
})

export const queryParamsValidator = z.object({
  params: z.object({
    // User id is required
    userId: z.string({
      required_error: 'User id is required',
    }),
    // Book id is required
    bookId: z.string({
      required_error: 'Book id is required',
    }),
  }),
})
