import app from './app'
import { connectDB, disconnectDB } from './lib/mongo'
import { connectRedis, disconnectRedis } from './lib/redis'
import logger from './utils/logger'

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await connectDB()
    await connectRedis()

    const server = app.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })

    const shutdown = async () => {
      logger.info('Shutting down server...')
      server.close(async () => {
        await Promise.all([
          disconnectDB(),
          disconnectRedis(), // Graceful Redis shutdown
        ])
        logger.info('Server and all database connections closed.')
        process.exit(0)
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

process.on('uncaughtException', error => {
  logger.error(error, 'Uncaught Exception')
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error(reason, 'Unhandled Rejection', { promise })
  process.exit(1)
})

startServer()
