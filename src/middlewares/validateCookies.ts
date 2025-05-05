import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AnyZodObject, z } from 'zod'
import config from '../config'
import { AppError } from '../utils/errors'

export const validateCookies =
  (schema: AnyZodObject): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.cookies = await schema.parseAsync(req.cookies)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Clear invalid cookies
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: config.node_env === 'production',
          sameSite: 'strict',
        })

        next(
          new AppError(
            'Invalid session',
            401,
            error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          ),
        )
      }
      next(error)
    }
  }
