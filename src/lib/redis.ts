import Redis from 'ioredis'
import RedisMock from 'ioredis-mock'
import config from '../config'
import logger from '../utils/logger'

export let redisClient: Redis

export async function connectRedis(): Promise<Redis> {
  try {
    const redisUrl = config.database.REDIS_URL || 'redis://localhost:6379'
    redisClient =
      process.env.NODE_ENV === 'test'
        ? new RedisMock()
        : new Redis(redisUrl, {
            retryStrategy: times => Math.min(times * 50, 2000),
            maxRetriesPerRequest: 3,
          })

    redisClient.on('connect', () => {
      logger.info('🔌 Redis connected')
    })

    redisClient.on('error', err => {
      logger.error('❌ Redis error:', err.message)
    })

    redisClient.on('ready', () => {
      logger.info('✅ Redis ready')
    })

    redisClient.on('reconnecting', () => {
      logger.warn('🔄 Redis reconnecting...')
    })

    // Test connection
    await redisClient.ping()
    logger.info(`Redis :: connected to ${redisUrl}`)
    return redisClient
  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    throw error
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit()
      logger.info('🛑 Redis connection closed')
    } catch (error) {
      logger.error('Failed to disconnect Redis:', error)
      throw error
    }
  }
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized')
  }
  return redisClient
}
