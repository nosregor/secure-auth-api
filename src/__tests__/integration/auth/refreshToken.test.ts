import request from 'supertest'
import app from '../../../app'
import { signRefreshToken } from '../../../utils/jwt'

describe('POST /api/auth/refresh-token', () => {
  const endpoint = '/api/auth/refresh-token'

  it('should return new access token', async () => {
    const refreshToken = signRefreshToken({ userId: 'user123' })

    const res = await request(app)
      .post(endpoint)
      .set('Cookie', [`refreshToken=${refreshToken}`])

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
  })

  it('should return 401 if no refresh token is provided', async () => {
    const res = await request(app).post(endpoint)

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid session')
  })

  it('should return 403 if refresh token is invalid', async () => {
    const res = await request(app).post(endpoint).set('Cookie', ['refreshToken=invalidtoken'])

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Invalid refresh token')
  })
})
