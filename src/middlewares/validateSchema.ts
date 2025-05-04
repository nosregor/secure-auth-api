import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AnyZodObject, z } from 'zod'

export const validateSchema =
  (schema: AnyZodObject): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Validating request body...')
    try {
      const validatedData = await schema.parseAsync(req.body)
      req.body = validatedData

      next()
    } catch (error) {
      console.error('Validation error:', error)
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(error)
    }
  }
