import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/errors'
import logger from '../utils/logger'

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const isAppError = err instanceof AppError

  const statusCode = isAppError ? err.statusCode : 500
  const message = isAppError ? err.message : 'Something went wrong'

  logger.error(err)

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(isAppError &&
      typeof err.errors === 'object' &&
      err.errors !== null && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  })
}
