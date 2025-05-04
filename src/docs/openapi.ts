import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { userSchema } from '../schemas/userSchema'
import config from '../config'

export const registry = new OpenAPIRegistry()

// Register your routes
registry.registerPath({
  method: 'get',
  path: '/healthz',
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

registry.registerPath({
  method: 'post',
  path: '/body-params',
  description: 'Create a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
    },
  },
})

// Generate the OpenAPI document
export const openApiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'API',
    description: 'Simple REST API with TypeScript and Express',
  },
  servers: [{ url: `http://localhost:${config.port}` }],
})
