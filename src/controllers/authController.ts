import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'
import {
  generateVerificationCode,
  sendVerificationCode,
  storeCode,
  verifyCode,
} from '../services/authService'
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils/auth'
import { AuthError, ForbiddenError, NotFoundError, ValidationError } from '../utils/errors'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log(req.body)
    const { name, email, mobile, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })
    console.log(existingUser)
    if (existingUser) {
      throw new ValidationError(undefined, 'Email or mobile already in use')
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

    const pass = await user?.comparePassword(password)
    if (!user || !pass) {
      throw new AuthError('Invalid credentials')
    }

    const code = generateVerificationCode()
    await storeCode(user.id, code)
    await sendVerificationCode(user.mobile, code)

    res.status(200).json({ message: 'Verification code sent via SMS', userId: user.id })
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
    // Add password verification for extra check
    const { userId, code, password } = req.body

    // 1. Fetch user
    const user = await User.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    // 2. Verify 2FA code
    const isCodeValid = await verifyCode(userId, code)
    if (!isCodeValid) {
      throw new AuthError('Invalid or expired 2FA code')
    }

    // 3. Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new AuthError('Invalid password')
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
      clearRefreshTokenCookie(res)
      throw new AuthError('Missing refresh token')
    }

    const decoded = verifyRefreshToken(refreshToken) as { userId: string }
    if (!decoded?.userId) {
      clearRefreshTokenCookie(res)
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
