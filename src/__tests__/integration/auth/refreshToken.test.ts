import request from 'supertest'
import app from '../../../app'
import { AppError } from '../../../utils/errors'
import * as jwt from '../../../utils/jwt'

jest.mock('../../../utils/jwt', () => ({
  signAccessToken: jest.fn(),
  signRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}))

describe('POST /api/auth/refresh-token', () => {
  const endpoint = '/api/auth/refresh-token'
  const userId = 'user123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return new access token', async () => {
    const refreshToken = 'mockRefreshToken'
    const newAccessToken = 'newAccessToken'

    ;(jwt.verifyRefreshToken as jest.Mock).mockReturnValue({ userId })
    ;(jwt.signAccessToken as jest.Mock).mockReturnValue(newAccessToken)
    ;(jwt.signRefreshToken as jest.Mock).mockReturnValue('mockNewRefreshToken')

    const res = await request(app)
      .post(endpoint)
      .set('Cookie', [`refreshToken=${refreshToken}`])

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('accessToken', newAccessToken)

    // Verify that the refresh token was renewed
    expect(res.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken=mockNewRefreshToken')]),
    )
  })

  it('should return 401 if no refresh token is provided', async () => {
    const res = await request(app).post(endpoint)

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid session')
  })

  it('should return 403 if refresh token is invalid', async () => {
    ;(jwt.verifyRefreshToken as jest.Mock).mockImplementation(() => {
      throw new AppError('Invalid refresh token', 403)
    })

    const res = await request(app).post(endpoint).set('Cookie', ['refreshToken=invalidtoken'])

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Invalid refresh token')
  })
})
