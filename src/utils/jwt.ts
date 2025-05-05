import jwt from 'jsonwebtoken'
import config from '../config'

interface JwtPayload {
  userId: string
  sub?: string // subject, e.g. userId
  email?: string
  role?: 'user' | 'admin'
  fingerprint: string // Based on IP/UA
}

// TODO: accessTokenTtl and refreshTokenTtl should be in config
export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, config.secret.JWT_SECRET, { expiresIn: '15m' })
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, config.secret.REFRESH_SECRET, { expiresIn: '7d' })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.secret.JWT_SECRET)
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.secret.REFRESH_SECRET)
}
