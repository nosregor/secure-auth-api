import { Request, RequestHandler, Response } from 'express'
import User from '../models/User'

import {
  generateVerificationCode,
  sendVerificationCode,
  storeCode,
  verifyCode,
} from '../services/authService'

export const updateProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const updates = req.body
  if ('mobile' in updates) {
    res.status(400).json({ message: 'Cannot update mobile number' })
    return
  }

  await User.findByIdAndUpdate(userId, { $set: updates })
  res.status(200).json({ message: 'Profile updated successfully' })
}

export const requestPasswordChange: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  const user = await User.findById(userId)

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  const code = generateVerificationCode()
  await storeCode(user.id, code)
  await sendVerificationCode(user.mobile, code)

  res.status(200).json({ message: 'Verification code sent', code })
}

export const changePassword: RequestHandler = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  const { code, newPassword } = req.body

  const isValid = await verifyCode(userId, code)
  if (!isValid) {
    res.status(401).json({ message: 'Invalid or expired code' })
    return
  }

  await User.findByIdAndUpdate(userId, { password: newPassword })

  res.status(200).json({ message: 'Password updated successfully' })
}
