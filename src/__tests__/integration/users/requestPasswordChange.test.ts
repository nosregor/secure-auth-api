import request from 'supertest'
import app from '../../../app'
import User from '../../../models/User'
import {
  generateVerificationCode,
  sendVerificationCode,
  storeCode,
} from '../../../services/authService'
import { signAccessToken } from '../../../utils/jwt'

jest.mock('../../../services/authService', () => ({
  generateVerificationCode: jest.fn(() => '123456'),
  storeCode: jest.fn().mockResolvedValue(undefined),
  sendVerificationCode: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('../../../models/User')

describe('POST /api/users/request-password-change', () => {
  const endpoint = '/api/users/request-password-change'
  const userId = 'mock-user-id'

  const mockUser = {
    id: userId,
    mobile: '+14155552671',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).post(endpoint).send()

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  it('should return 404 if user is not found', async () => {
    ;(User.findById as jest.Mock).mockResolvedValue(null)

    const token = signAccessToken({ userId })
    const res = await request(app).post(endpoint).set('Authorization', `Bearer ${token}`).send()

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User not found')
  })

  it('should generate and send a verification code', async () => {
    // jest.setTimeout(10000) // Increase timeout for this test
    ;(User.findById as jest.Mock).mockResolvedValue(mockUser)

    const token = signAccessToken({ userId })
    const res = await request(app).post(endpoint).set('Authorization', `Bearer ${token}`).send()

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Verification code sent')
    expect(generateVerificationCode).toHaveBeenCalled()
    expect(storeCode).toHaveBeenCalledWith(mockUser.id, '123456')
    expect(sendVerificationCode).toHaveBeenCalledWith(mockUser.mobile, '123456')
  })
})
