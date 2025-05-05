import request from 'supertest'
import app from '../../../app'
import * as authService from '../../../services/authService'
import * as jwt from '../../../utils/jwt'

jest.mock('../../../services/authService', () => ({
  verifyCode: jest.fn(),
}))

jest.mock('../../../utils/jwt', () => ({
  signAccessToken: jest.fn(),
  signRefreshToken: jest.fn(),
}))

describe('POST /api/auth/verify-2fa', () => {
  const endpoint = '/api/auth/verify-2fa'
  const userId = 'user123'
  const code = '123456'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return tokens on successful verification', async () => {
    ;(authService.verifyCode as jest.Mock).mockResolvedValue(true)
    ;(jwt.signAccessToken as jest.Mock).mockReturnValue('mockAccessToken')
    ;(jwt.signRefreshToken as jest.Mock).mockReturnValue('mockRefreshToken')

    const res = await request(app).post(endpoint).send({ userId, code })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      message: '2FA verified',
    })

    expect(res.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken=mockRefreshToken')]),
    )

    expect(authService.verifyCode).toHaveBeenCalledWith(userId, code)
    expect(jwt.signAccessToken).toHaveBeenCalledWith({ userId })
    expect(jwt.signRefreshToken).toHaveBeenCalledWith({ userId })
  })

  it('should return 401 for invalid or expired code', async () => {
    ;(authService.verifyCode as jest.Mock).mockResolvedValue(false)

    const res = await request(app).post(endpoint).send({ userId, code: '888888' })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      status: 'error',
      message: 'Invalid or expired 2FA code',
    })
    expect(jwt.signAccessToken).not.toHaveBeenCalled()
    expect(jwt.signRefreshToken).not.toHaveBeenCalled()
  })
})
