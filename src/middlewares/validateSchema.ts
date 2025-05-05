import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AnyZodObject, z } from 'zod'
import { AppError } from '../utils/errors'

export const validateSchema =
  (schema: AnyZodObject): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Pass structured validation error to your errorHandler via AppError
        return next(
          new AppError(
            'Validation failed',
            400,
            error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          ),
        )
      }
      // For non-Zod errors, pass it to the error handler
      next(error)
    }
  }
