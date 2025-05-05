import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'
import {
  generateVerificationCode,
  sendVerificationCode,
  storeCode,
  verifyCode,
} from '../services/authService'
import { setRefreshTokenCookie } from '../utils/auth'
import { AuthError, ForbiddenError, ValidationError } from '../utils/errors'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, mobile, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })

    if (existingUser) {
      if (existingUser) {
        throw new ValidationError(undefined, 'Email or mobile already in use')
      }
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
      throw new AuthError('Invalid credentials')
    }

    const code = generateVerificationCode()
    await storeCode(user.id, code)
    await sendVerificationCode(user.mobile, code)

    res.status(200).json({ message: 'Verification code sent via SMS' })
  } catch (error) {
    next(error)
  }
}

export const verify2FA: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, code } = req.body
    const isValid = await verifyCode(userId, code)

    if (!isValid) {
      throw new AuthError('Invalid or expired 2FA code')
    }

    const accessToken = signAccessToken({ userId })
    const refreshToken = signRefreshToken({ userId })

    setRefreshTokenCookie(res, refreshToken)
    res.status(200).json({ accessToken, refreshToken, message: '2FA verified' })
  } catch (error) {
    next(error)
  }
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      throw new AuthError('Missing refresh token')
    }

    const decoded = verifyRefreshToken(refreshToken) as { userId: string }
    if (!decoded?.userId) {
      throw new ForbiddenError('Invalid refresh token')
    }

    const newAccessToken = signAccessToken({ userId: decoded.userId })
    const newRefreshToken = signRefreshToken({ userId: decoded.userId })

    setRefreshTokenCookie(res, newRefreshToken)
    res.status(200).json({ accessToken: newAccessToken })
  } catch (error) {
    next(error)
  }
}
