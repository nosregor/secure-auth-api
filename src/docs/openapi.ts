import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import config from '../config'
import { registerResponseSchema, registerSchema } from '../schemas/auth/registerSchema'

const API_TAGS = {
  AUTH: 'Authentication',
  USER: 'User',
  SYSTEM: 'System',
}

export const registry = new OpenAPIRegistry()

// Register your routes
registry.registerPath({
  method: 'get',
  path: '/healthz',
  tags: [API_TAGS.SYSTEM],
  description: 'Get health status',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'OK',
                description: 'Service status',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2023-10-01T12:00:00Z',
                description: 'Current server time in ISO format',
              },
            },
            required: ['status', 'timestamp'],
            description: 'Health check response payload',
          },
        },
      },
    },
  },
})

// Register /api/auth/register
registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: [API_TAGS.AUTH],
  description: 'Register a new user',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: registry.register('RegisterRequest', registerSchema),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: registry.register('RegisterResponse', registerResponseSchema),
        },
      },
    },
    400: {
      description: 'Email or mobile already in use',
    },
  },
})

// Generate the OpenAPI document
export const openApiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'API',
    description: 'Secure API with 2FA Authentication',
  },
  servers: [{ url: `http://localhost:${config.port}` }],
  tags: [
    {
      name: API_TAGS.SYSTEM,
      description: 'System health and status',
    },
    {
      name: API_TAGS.AUTH,
      description: 'Authentication endpoints (login, register, 2FA)',
    },

    {
      name: API_TAGS.USER,
      description: 'User management endpoints (profile, password change)',
    },
  ],
})
