import twilio from 'twilio'
import config from '../config'
import { redisClient } from '../lib/redis'

// TODO: move to config
const CODE_TTL = 1000 * 60 * 5 // 5 minutes expiry

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString() // "123456"
}

export const storeCode = async (userId: string, code: string) => {
  return await redisClient.set(`2fa:${userId}`, code, 'EX', CODE_TTL)
  // Store the code in Redis with a TTL
  // logger.info(`2FA code for user ${userId} stored in Redis with key redisKey: ${redisKey}`)
}

export const verifyCode = async (userId: string, code: string): Promise<boolean> => {
  const key = `2fa:${userId}`
  const storedCode = await redisClient.get(key)

  if (!storedCode || storedCode !== code) {
    return false
  }

  await redisClient.del(key) // prevent re-use
  return true
}

export const sendVerificationCode = (to: string, code: string) => {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

  return client.messages.create({
    body: `Your login code is ${code}`,
    from: config.twilio.TWILIO_PHONE,
    to,
  })
}
