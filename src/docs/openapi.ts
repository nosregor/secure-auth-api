import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import config from '../config'
import {
  verify2FAErrorSchema,
  verify2FAResponseSchema,
  verify2FASchema,
} from '../schemas/auth/2faSchema'
import { loginResponseSchema, loginSchema } from '../schemas/auth/loginSchema'
import { registerResponseSchema, registerSchema } from '../schemas/auth/registerSchema'
import {
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  requestPasswordChangeResponseSchema,
  requestPasswordChangeSchema,
} from '../schemas/user/changePasswordSchema'
import {
  updateProfileResponseSchema,
  updateProfileSchema,
} from '../schemas/user/updateProfileSchema'

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

// Register
registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: [API_TAGS.AUTH],
  summary: 'User registration',
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

// Register
registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: [API_TAGS.AUTH],
  summary: 'User login',
  description: 'Login and receive 2FA code',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: registry.register('LoginRequest', loginSchema),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Verification code sent',
      content: {
        'application/json': {
          schema: registry.register('LoginResponse', loginResponseSchema),
        },
      },
    },
    401: {
      description: 'Invalid credentials',
    },
  },
})

// 2FA Verification
registry.registerPath({
  method: 'post',
  path: '/api/auth/verify-2fa',
  tags: [API_TAGS.AUTH],
  description: 'Verify 2FA code and get access tokens',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: registry.register('Verify2FARequest', verify2FASchema),
        },
      },
    },
  },
  responses: {
    200: {
      description: '2FA verified and tokens issued',
      content: {
        'application/json': {
          schema: registry.register('Verify2FAResponse', verify2FAResponseSchema),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Validation failed' },
              errors: { type: 'array' },
            },
          },
        },
      },
    },
    401: {
      description: 'Invalid or expired 2FA code',
      content: {
        'application/json': {
          schema: registry.register('Verify2FAError', verify2FAErrorSchema),
        },
      },
    },
  },
})

// Update profile
registry.registerPath({
  method: 'patch',
  path: '/api/users/profile',
  description: 'Update user profile (name, email only)',
  summary: 'Update profile',
  tags: [API_TAGS.USER],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: updateProfileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile updated successfully',
      content: {
        'application/json': {
          schema: updateProfileResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid update (e.g., attempting to change mobile)',
    },
    401: {
      description: 'Unauthorized',
    },
  },
})

// Request password change
registry.registerPath({
  method: 'post',
  path: '/api/users/request-password-change',
  summary: 'Request password change via SMS verification code',
  description: 'Sends a 2FA code via SMS to allow password reset',
  tags: [API_TAGS.USER],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: requestPasswordChangeSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Verification code sent successfully',
      content: {
        'application/json': {
          schema: requestPasswordChangeResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized - user not authenticated',
    },
    404: {
      description: 'User not found',
    },
  },
})

// Change password after verifying code
registry.registerPath({
  method: 'post',
  path: '/api/users/change-password',
  summary: 'Change user password after verifying code',
  description:
    'Allows an authenticated user to change their password after entering a valid SMS verification code',
  tags: [API_TAGS.USER],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: changePasswordRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password changed successfully',
      content: {
        'application/json': {
          schema: changePasswordResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized or invalid verification code',
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
