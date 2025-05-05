import request from 'supertest'
import app from '../../../app'
import User from '../../../models/User'
import * as authService from '../../../services/authService'
import { setupTestDatabase } from '../../../utils/testDb'

jest.mock('../../../services/authService', () => ({
  // generateVerificationCode: jest.fn(() => '123456'),
  // storeCode: jest.fn(() => Promise.resolve()),
  // sendVerificationCode: jest.fn(() => Promise.resolve({ sid: 'mockSid' })),

  generateVerificationCode: jest.fn(() => '123456'),
  storeCode: jest.fn().mockResolvedValue(undefined),
  sendVerificationCode: jest.fn().mockResolvedValue(undefined),
}))

describe('POST /api/auth/login', () => {
  const endpoint = '/api/auth/login'

  const testUser = {
    name: 'user123',
    email: 'test@example.com',
    password: 'validPassword123',
    mobile: '+1234567890',
  }

  setupTestDatabase()
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('logs in and returns verification code', async () => {
    const user = await User.create(testUser)
    const res = await request(app)
      .post(endpoint)
      .send({ email: user.email, password: user.password })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      message: 'Verification code sent via SMS',
      // userId: expect.any(String),
    })

    expect(authService.generateVerificationCode).toHaveBeenCalled()
    expect(authService.storeCode).toHaveBeenCalled()
    expect(authService.sendVerificationCode).toHaveBeenCalled()
  })

  it('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('rejects login with unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not@found.com', password: 'whatever' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })
})
