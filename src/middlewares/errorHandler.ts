import { NextFunction, Request, Response } from 'express'
import config from '../config'
import { AppError } from '../utils/errors'
import logger from '../utils/logger'

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  const isAppError = err instanceof AppError

  // Set the default status code and message
  const statusCode = isAppError ? err.statusCode : 500
  const message = isAppError ? err.message : 'Something went wrong'

  // Log detailed error info
  logger.error({
    message,
    statusCode,
    stack: err.stack, // Log stack trace if available
    ...(isAppError && err.errors ? { errors: err.errors } : {}),
  })

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(isAppError && err.errors ? { errors: err.errors } : {}),
    ...(config.node_env === 'development' && { stack: err.stack }),
  })
}
