import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'
import {
  generateVerificationCode,
  sendVerificationCode,
  storeCode,
  verifyCode,
} from '../services/authService'
import { setRefreshTokenCookie } from '../utils/auth'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, mobile, password } = req.body

    const existingUser = await User.findOne(
      { $or: [{ email }, { mobile }] },
      { password: 0, __v: 0 }, // Exclude sensitive fields
    )

    if (existingUser) {
      res.status(400).json({ message: 'Email or mobile already in use' })
      return
    }

    const user = await User.create({ name, email, mobile, password })

    res.status(201).json({ message: 'User registered successfully', userId: user._id })
  } catch (error) {
    next(error)
  }
}

export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !user.comparePassword(password)) {
      res.status(401).json({ message: 'Invalid credentials', user, password })
      return
    }

    const code = generateVerificationCode()
    await storeCode(user.id, code)
    await sendVerificationCode(user.mobile, code)

    res.status(200).json({ message: 'Verification code sent via SMS', userId: user.id, code: code })
  } catch (error) {
    next(error)
  }
}

export const verify2FA: RequestHandler = async (req: Request, res: Response) => {
  const { userId, code } = req.body

  const isValid = await verifyCode(userId, code)

  if (!isValid) {
    res.status(401).json({ message: 'Invalid or expired 2FA code' })
    return
  }

  // Issue tokens
  const accessToken = signAccessToken({ userId })
  const refreshToken = signRefreshToken({ userId })

  // Set refresh token in HttpOnly cookie
  setRefreshTokenCookie(res, refreshToken)

  res.status(200).json({ accessToken, refreshToken, message: '2FA verified' })
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies

  console.log({ refreshToken })

  if (!refreshToken) {
    res.status(401).json({ message: 'Missing refresh token' })
    return
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as { userId: string }
    if (!decoded?.userId) {
      res.status(403).json({ message: 'Invalid refresh token' })
      return
    }
    const newAccessToken = signAccessToken({ userId: decoded.userId })
    const newRefreshToken = signRefreshToken({ userId: decoded.userId })

    setRefreshTokenCookie(res, newRefreshToken)

    res.status(200).json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' })
    next(error)
  }
}
