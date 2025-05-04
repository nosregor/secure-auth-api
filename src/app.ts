import express from 'express'
import pinoHttp from 'pino-http'
import logger from './utils/logger'
import exampleRoutes from './routes/example'
import healthRoutes from './routes/healthz'
import { AppError } from './utils/errors'
import { errorHandler } from './middlewares/errorHandler'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { openApiDocument } from './docs/openapi'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10kb' }))

// logging middleware
// ❗️pinoHttp must be used before any routes
app.use(pinoHttp({ logger, autoLogging: true }))

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))
app.use('/healthz', healthRoutes)
app.use('/api', exampleRoutes)

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`This path ${req.originalUrl} isn't on this server!`, 404))
})

// Global error handling
// ❗️Centralized error handling must come **after** routes
app.use(errorHandler)

export default app
