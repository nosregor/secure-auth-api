import request from 'supertest'
import app from '../app'

describe('POST /api/body-params', () => {
  const validPayload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePassword123',
    mobile: '+1234567890',
  }

  it('should return 200 with validated data for valid request', async () => {
    const response = await request(app).post('/api/body-params').send(validPayload).expect(200)

    expect(response.body).toEqual(validPayload)
  })

  it('should return 400 for missing email', async () => {
    const { email, ...invalidPayload } = validPayload
    const response = await request(app).post('/api/body-params').send(invalidPayload).expect(400)

    expect(response.body).toEqual({
      message: 'Validation failed',
      errors: expect.arrayContaining([
        expect.objectContaining({
          path: 'email',
          message: 'Email is required',
        }),
      ]),
    })
  })

  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/api/body-params')
      .send({ ...validPayload, email: 'invalid-email' })
      .expect(400)

    expect(response.body).toEqual({
      message: 'Validation failed',
      errors: expect.arrayContaining([
        expect.objectContaining({
          path: 'email',
          message: 'Invalid email format',
        }),
      ]),
    })
  })

  it('should return 400 for weak password', async () => {
    const response = await request(app)
      .post('/api/body-params')
      .send({ ...validPayload, password: 'weak' })
      .expect(400)

    expect(response.body).toEqual({
      message: 'Validation failed',
      errors: expect.arrayContaining([
        expect.objectContaining({
          path: 'password',
          message: 'Password must be at least 8 characters',
        }),
      ]),
    })
  })

  it('should return 400 for invalid mobile format', async () => {
    const response = await request(app)
      .post('/api/body-params')
      .send({ ...validPayload, mobile: 'invalid-format' })
      .expect(400)

    expect(response.body).toEqual({
      message: 'Validation failed',
      errors: expect.arrayContaining([
        expect.objectContaining({
          path: 'mobile',
          message: 'Invalid mobile number format. Use international format (+1234567890)',
        }),
      ]),
    })
  })

  it('should normalize mobile number by removing whitespace', async () => {
    const response = await request(app)
      .post('/api/body-params')
      .send({ ...validPayload, mobile: '+1 234 567 890' })
      .expect(200)

    expect(response.body.mobile).toBe('+1234567890')
  })

  it('should reject invalid mobile number', async () => {
    const invalidNumbers = [
      'abc',
      '+123',
      '1234567890123456', // Too long
      '++1234567890', // Double plus
    ]

    for (const number of invalidNumbers) {
      const response = await request(app)
        .post('/api/body-params')
        .send({ ...validPayload, mobile: number })
        .expect(400)

      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          path: 'mobile',
          message: 'Invalid mobile number format. Use international format (+1234567890)',
        }),
      )
    }
  })
})
