import { NextFunction, Request, RequestHandler, Response } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export const isAuthenticated: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const accessToken = authHeader.split(' ')[1]

  try {
    const decoded = verifyAccessToken(accessToken) as { userId: string }
    req.user = { userId: decoded.userId }
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' })
    next(err)
  }
}
