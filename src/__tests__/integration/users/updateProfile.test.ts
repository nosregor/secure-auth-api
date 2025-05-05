import request from 'supertest'
import app from '../../../app'
import User from '../../../models/User'
import { signAccessToken } from '../../../utils/jwt'
import { setupTestDatabase } from '../../../utils/testDb'

setupTestDatabase()

describe('PUT /api/users/profile', () => {
  const endpoint = '/api/users/profile'

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    mobile: '+1234567890',
    password: 'password123',
  }

  let authHeader: string

  beforeEach(async () => {
    const user = await User.create(testUser)
    authHeader = `Bearer ${signAccessToken({ userId: user._id } as any)}`
  })

  it('returns 401 if userId is missing (unauthenticated)', async () => {
    const res = await request(app).patch(endpoint).send({ name: 'New Name' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  it('returns 400 when trying to update mobile number', async () => {
    const res = await request(app)
      .patch(endpoint)
      .set('Authorization', authHeader)
      .send({ mobile: '+1987654321' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Validation failed')
    const expectedError = {
      path: '',
      message: expect.stringContaining(`Only 'name' and 'email' can be updated.`),
    }

    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining(expectedError)]),
    )
  })

  it('successfully updates profile', async () => {
    const res = await request(app)
      .patch(endpoint)
      .set('Authorization', authHeader)
      .send({ name: 'Updated Name' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Profile updated successfully')

    const updatedUser = await User.findOne({ email: testUser.email })
    expect(updatedUser?.name).toBe('Updated Name')
  })
})
