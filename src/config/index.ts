import * as dotenv from 'dotenv'

dotenv.config()

interface IConfig {
  node_env: string
  name: string
  port: string | number
  database: {
    POSTGRES_URL: string
    MONGO_URI: string
    REDIS_URL: string
  }
  secret: string
}

function getStringEnv(variable: string, defaultValue?: string): string {
  const val = process.env[variable]
  if (!val) {
    if (defaultValue) {
      return defaultValue
    }
    throw new Error(`${variable} not found. Set ${variable} environment variable.`)
  }
  return val
}

// default values
const NODE_ENV: string = getStringEnv('NODE_ENV', 'development')
const APP_NAME: string = getStringEnv('APP_NAME', 'app name')
const PORT: string | number = getStringEnv('PORT', '3000')
const SECRET = getStringEnv('SECRET', 'TOP_SECRET')
const POSTGRES_URL = getStringEnv(
  'POSTGRES_URL',
  'postgresql://postgres:password@postgres:5432/feebee',
)
const MONGO_URI = getStringEnv('MONGO_URI', 'mongodb://localhost:27017/test')
const REDIS_URL = getStringEnv('REDIS_URL', 'redis://localhost:6379')

const test: IConfig = {
  node_env: NODE_ENV,
  name: APP_NAME,
  port: PORT,
  database: {
    POSTGRES_URL: POSTGRES_URL,
    MONGO_URI: MONGO_URI,
    REDIS_URL: REDIS_URL,
  },
  secret: SECRET,
}

const development: IConfig = {
  node_env: NODE_ENV,
  name: APP_NAME,
  port: PORT,
  database: {
    POSTGRES_URL: POSTGRES_URL,
    MONGO_URI: MONGO_URI,
    REDIS_URL: REDIS_URL,
  },
  secret: SECRET,
}

const production: IConfig = {
  node_env: NODE_ENV,
  name: APP_NAME,
  port: PORT,
  database: {
    POSTGRES_URL: POSTGRES_URL,
    MONGO_URI: MONGO_URI,
    REDIS_URL: REDIS_URL,
  },
  secret: SECRET,
}

const config: {
  [name: string]: IConfig
} = { test, development, production }

export default config[NODE_ENV]
