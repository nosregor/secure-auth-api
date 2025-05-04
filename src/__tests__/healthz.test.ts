import request from 'supertest'
import app from '../app'

describe('GET /healthz', () => {
  it('should return 200 and health status', async () => {
    const res = await request(app).get('/healthz')

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: 'OK',
        timestamp: expect.any(String),
      }),
    )
  })
})
