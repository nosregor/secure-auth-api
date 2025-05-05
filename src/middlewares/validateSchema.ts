import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AnyZodObject, z } from 'zod'
import { ValidationError } from '../utils/errors'

export const validateSchema =
  (schema: AnyZodObject): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new ValidationError(
            error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message,
            })),
            'Validation failed',
          ),
        )
      }
      // For non-Zod errors
      next(error)
    }
  }
