import rateLimit from 'express-rate-limit'

// Prevents brute force attacks
export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many token refresh attempts',
  skipSuccessfulRequests: true, // Only count failed attempts
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => req.ip || 'unknown', // Limit by IP
})

export const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // Limit to 3 attempts
  message: 'Too many password change requests',
  standardHeaders: true,
  legacyHeaders: false,
})
