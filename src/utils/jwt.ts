import jwt from 'jsonwebtoken'
import config from '../config'

// TODO: accessTokenTtl and refreshTokenTtl should be in config
export function signAccessToken(payload: object) {
  return jwt.sign(payload, config.secret.JWT_SECRET, { expiresIn: '15m' })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.secret.JWT_SECRET)
}
