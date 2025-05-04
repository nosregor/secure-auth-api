import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer
let connectionAttempts: number = 0

/**
 * Connect to the in-memory database.
 */
export const connectTestDatabase = async (): Promise<void> => {
  connectionAttempts++

  if (mongoose.connection.readyState === 1) {
    return
  }
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri, {
    ignoreUndefined: true,
    serverSelectionTimeoutMS: 5000,
  })
}

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeTestDatabase = async (): Promise<void> => {
  connectionAttempts--

  if (connectionAttempts <= 0 && mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    await mongoServer?.stop()
    connectionAttempts = 0
  }
}

/**
 * Remove all the data for all db collections.
 */
export const clearTestDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) return

  const collections = mongoose.connection.collections
  await Promise.all(Object.values(collections).map(collection => collection.deleteMany({})))
}

export const setupTestDatabase = () => {
  beforeAll(async () => await connectTestDatabase())
  afterEach(async () => await clearTestDatabase())
  afterAll(async () => await closeTestDatabase())
}
