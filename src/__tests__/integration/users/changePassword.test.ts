import request from 'supertest'
import app from '../../../app'
import User from '../../../models/User'
import { verifyCode } from '../../../services/authService'

import { signAccessToken } from '../../../utils/jwt'

jest.mock('../../../models/User')
jest.mock('../../../services/authService')

const userId = '507f1f77bcf86cd799439011'
const token = signAccessToken({ userId })
const mockPassword = 'newPassword123!'
const mockCode = '123456'

const mockUser = {
  id: userId,
  email: 'test@example.com',
  password: 'hashed-oldPassword123!',
}

describe('POST /api/users/change-password', () => {
  const endpoint = '/api/users/change-password'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser)
  })

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({ code: mockCode, newPassword: mockPassword })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  it('should return 401 if verification code is invalid', async () => {
    ;(verifyCode as jest.Mock).mockResolvedValue(false)

    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'wrong-code', newPassword: mockPassword })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid or expired code')
    expect(verifyCode).toHaveBeenCalledWith(userId, 'wrong-code')
  })

  it('should update password when code is valid', async () => {
    ;(verifyCode as jest.Mock).mockResolvedValue(true)
    ;(User.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({})

    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ code: mockCode, newPassword: mockPassword })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Password updated successfully')
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
      password: mockPassword,
    })
  })
})
