import config from '../config'

export class AppError extends Error {
  public statusCode: number
  public errors?: unknown
  public stack?: string

  constructor(message: string, statusCode: number = 500, errors?: unknown, stack?: string) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.stack = stack || (config.node_env === 'development' ? new Error().stack : undefined)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}
