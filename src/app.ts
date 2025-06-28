import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import swaggerUi from 'swagger-ui-express'
import { openApiDocument } from './docs/openapi'
import { errorHandler } from './middlewares/errorHandler'
import authRoutes from './routes/authRoute'
import healthRoutes from './routes/healthz'
import userRoutes from './routes/userRoute'
import { AppError } from './utils/errors'
import logger from './utils/logger'

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow only this origin
    methods: ['GET', 'POST', 'PATCH'], // Allowed HTTP methods
    credentials: true, // If you need cookies/auth headers
  }),
)
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

// logging middleware
// ❗️pinoHttp must be used before any routes
app.use(pinoHttp({ logger, autoLogging: true }))

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))
app.use('/healthz', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`This path ${req.originalUrl} isn't on this server!`, 404))
})

// Global error handling
// ❗️Centralized error handling must come **after** routes
app.use(errorHandler)

export default app
