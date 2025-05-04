import request from 'supertest'
import app from '../../../app'
import User from '../../../models/User'
import { setupTestDatabase } from '../../../utils/testDb'

describe('POST /api/auth/register', () => {
  setupTestDatabase()

  const validPayload = {
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '+1234567890',
    password: 'Password123',
  }

  it('should register a new user with hashed password', async () => {
    const res = await request(app).post('/api/auth/register').send(validPayload)

    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({
      message: 'User registered successfully',
      userId: expect.any(String),
    })

    // Verify user was created with hashed password
    const user = await User.findOne({ email: 'john@example.com' }).lean()
    expect(user).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+1234567890',
    })
  })

  it('should validate required fields', async () => {
    const requiredFields = ['name', 'email', 'mobile', 'password']

    for (const field of requiredFields as (keyof typeof validPayload)[]) {
      const invalidPayload = { ...validPayload }
      delete invalidPayload[field]

      await request(app)
        .post('/api/auth/register')
        .send(invalidPayload)
        .expect(400)
        .then(res => {
          expect(res.body.errors).toContainEqual(
            expect.objectContaining({
              path: field,
              message: expect.stringContaining('required'),
            }),
          )
        })
    }
  })
})
