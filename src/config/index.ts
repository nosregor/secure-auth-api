import * as dotenv from 'dotenv'

dotenv.config()

interface IConfig {
  node_env: string
  name: string
  port: string | number
  database: {
    MONGO_URL: string
    REDIS_URL: string
  }
  secret: { JWT_SECRET: string; REFRESH_SECRET: string }
  twilio: { TWILIO_SID: string; TWILIO_TOKEN: string; TWILIO_PHONE: string }
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
const JWT_SECRET = getStringEnv('JWT_SECRET', 'JWT_SECRET')
const REFRESH_SECRET = getStringEnv('REFRESH_SECRET', 'REFRESH_SECRET')

const MONGO_URL = getStringEnv('MONGO_URL', 'mongodb://localhost:27017/test')
const REDIS_URL = getStringEnv('REDIS_URL', 'redis://localhost:6379')
const TWILIO_SID = getStringEnv('TWILIO_SID', 'sid')
const TWILIO_TOKEN = getStringEnv('TWILIO_TOKEN', 'token')
const TWILIO_PHONE = getStringEnv('TWILIO_PHONE', 'phone')

const test: IConfig = {
  node_env: NODE_ENV,
  name: APP_NAME,
  port: PORT,
  database: {
    MONGO_URL: MONGO_URL,
    REDIS_URL: REDIS_URL,
  },
  secret: {
    JWT_SECRET: JWT_SECRET,
    REFRESH_SECRET: REFRESH_SECRET,
  },
  twilio: {
    TWILIO_SID: TWILIO_SID,
    TWILIO_TOKEN: TWILIO_TOKEN,
    TWILIO_PHONE: TWILIO_PHONE,
  },
}

const development: IConfig = {
  node_env: NODE_ENV,
  name: APP_NAME,
  port: PORT,
  database: {
    MONGO_URL: MONGO_URL,
    REDIS_URL: REDIS_URL,
  },
  secret: {
    JWT_SECRET: JWT_SECRET,
    REFRESH_SECRET: REFRESH_SECRET,
  },
  twilio: {
    TWILIO_SID: TWILIO_SID,
    TWILIO_TOKEN: TWILIO_TOKEN,
    TWILIO_PHONE: TWILIO_PHONE,
  },
}

const production: IConfig = {
  node_env: NODE_ENV,
  name: APP_NAME,
  port: PORT,
  database: {
    MONGO_URL: MONGO_URL,
    REDIS_URL: REDIS_URL,
  },
  secret: {
    JWT_SECRET: JWT_SECRET,
    REFRESH_SECRET: REFRESH_SECRET,
  },
  twilio: {
    TWILIO_SID: TWILIO_SID,
    TWILIO_TOKEN: TWILIO_TOKEN,
    TWILIO_PHONE: TWILIO_PHONE,
  },
}

const config: {
  [name: string]: IConfig
} = { test, development, production }

export default config[NODE_ENV]
