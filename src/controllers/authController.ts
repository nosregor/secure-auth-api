import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'

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
