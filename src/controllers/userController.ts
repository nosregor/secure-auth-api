import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'

import {
  generateVerificationCode,
  sendVerificationCode,
  storeCode,
  verifyCode,
} from '../services/authService'
import { AppError, AuthError, NotFoundError } from '../utils/errors'

export const updateProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new AuthError('Unauthorized')
    }

    const updates = req.body
    if ('mobile' in updates) {
      throw new AppError('Cannot update mobile number', 400)
    }

    await User.findByIdAndUpdate(userId, { $set: updates })
    res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error) {
    next(error)
  }
}

export const requestPasswordChange: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new AuthError('Unauthorized')
    }
    const user = await User.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const code = generateVerificationCode()
    await storeCode(user.id, code)
    await sendVerificationCode(user.mobile, code)

    res.status(200).json({ message: 'Verification code sent', code })
  } catch (error) {
    next(error)
  }
}

export const changePassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new AuthError('Unauthorized')
    }
    const { code, newPassword } = req.body

    const isValid = await verifyCode(userId, code)
    if (!isValid) {
      throw new AuthError('Invalid or expired code')
    }

    await User.findByIdAndUpdate(userId, { password: newPassword })
    res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
}
