import { Response } from 'express'

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  })
}

export const clearRefreshTokenCookie = (res: Response) => {
  res.cookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}
