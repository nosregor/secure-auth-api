import { connect, connection, ConnectOptions, Mongoose } from 'mongoose'
import config from '../config'
import logger from '../utils/logger'

const MONGO_URI = `${config.database.MONGO_URL}`

const connectOptions: ConnectOptions = {
  retryWrites: true,
}

export async function connectDB(): Promise<Mongoose> {
  try {
    const conn = await connect(MONGO_URI, connectOptions)
    // logger.info(`MongoDB :: connected to ${MONGO_URI}`)
    return conn
  } catch (error) {
    logger.error(error, 'Failed to connect to MongoDB:')
    throw error
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await connection.close()
    logger.info('MongoDB connection closed.')
  } catch (error) {
    logger.error(error, 'Failed to disconnect from MongoDB:')
    throw error
  }
}

// Event handlers for MongoDB connection
connection.on('connecting', () => {
  logger.info('MongoDB :: connecting')
})

connection.on('error', (error: unknown) => {
  logger.error(error, `MongoDB :: connection`)
})

connection.on('connected', () => {
  logger.info(`MongoDB :: connected to ${MONGO_URI}`)
})

connection.on('disconnected', () => {
  logger.warn('MongoDB :: connection disconnected')
})

connection.on('reconnected', () => {
  logger.info('MongoDB :: connection reconnected')
})
