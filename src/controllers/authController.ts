import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'
import { generateVerificationCode, sendVerificationCode, storeCode } from '../services/authService'

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, mobile, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })
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
