import pino from 'pino'
import config from '../config'

const isTest = config.node_env === 'test'

const logger = pino({
  name: config.name || 'app',
  level: isTest ? 'silent' : config.node_env === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  },
})

export default logger
