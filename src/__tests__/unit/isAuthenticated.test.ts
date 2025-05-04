import { NextFunction, Request, Response } from 'express'
import { isAuthenticated } from '../../middlewares/isAuthenticated'
import * as jwt from '../../utils/jwt'

jest.mock('../../utils/jwt', () => ({
  verifyAccessToken: jest.fn(),
}))

describe('isAuthenticated middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {
      headers: {} as Record<string, string | undefined>,
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should return 401 if Authorization header is missing', () => {
    isAuthenticated(req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 if token is invalid', () => {
    req.headers = req.headers || {}
    req.headers.authorization = 'Bearer invalid.token'
    ;(jwt.verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error('Token error')
    })

    isAuthenticated(req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' })
    expect(next).toHaveBeenCalled()
  })

  it('should attach user to req and call next if token is valid', () => {
    req.headers = req.headers || {}
    req.headers.authorization = 'Bearer valid.token'
    ;(jwt.verifyAccessToken as jest.Mock).mockReturnValue({ userId: 'abc123' })

    isAuthenticated(req as Request, res as Response, next)

    expect(req.user).toEqual({ userId: 'abc123' })
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
