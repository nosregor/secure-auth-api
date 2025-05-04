import { Request, Response } from 'express'
import { AppError } from '../utils/errors'
import logger from '../utils/logger'

export function errorHandler(err: Error, req: Request, res: Response): void {
  const isAppError = err instanceof AppError

  const statusCode = isAppError ? err.statusCode : 500
  const message = isAppError ? err.message : 'Something went wrong'

  logger.error(err)

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
