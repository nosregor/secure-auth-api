# 🛡️ Bling Backend Coding Challenge — Secure Auth API

A secure backend authentication API built with **Express.js** and **TypeScript**, featuring:

- User registration & login
- Two-factor authentication (2FA) via SMS (e.g., Twilio)
- Profile update (name & email)
- Password change via SMS verification
- JWT-based access control

## 🔧 Project Setup (boilerplates)

This project was bootstrapped using my own starter template: [ts-starter](https://github.com/nosregor/ts-starter).

## 🚀 Setup Instructions

### Requirements

- Node.js ≥ 18
- MongoDB instance (local or remote)
- Redis instance (local or remote)

### Install dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://localhost:27017/bling_auth
JWT_SECRET=supersecret
REFRESH_SECRET=supersecretjwtkey
REDIS_URL=redis://localhost:6379
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+49123456789
```

### Start the app

```bash
npm run dev
```

### Run tests

```bash
npm run test
```

## 📘 API Documentation

Interactive API documentation is available via **OpenAPI (Swagger)**.

> 🧪 View it in your browser:
> **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

It includes:

- All available endpoints
- Request/response schema
- Authentication headers
- Example payloads

## 🧠 Architecture & Design Decisions

- **Modular structure**: Separation of concerns between routes, controllers, services, utils, and middlewares.
- **Zod** for input validation and schema enforcement.
- **JWT (short-lived)** for stateless session management.
- **Refresh token rotation**: On every successful 2FA verification, a new refresh token is issued, replacing the old one. This mitigates session hijacking.
- **Redis** for storing time-bound verification codes.
- **Twilio** used only for sending SMS — the 2FA logic is implemented internally.
- **Environment-based config** in `config/`.

## 🔐 Security Considerations

- ❗ **Mobile number is immutable** to prevent account takeovers
- ✅ **2FA codes expire** (default 5 mins) and are stored securely in Redis
- 🪪 **JWT tokens are short-lived**, and refresh tokens can be added
- 🧼 **Zod validation** ensures type-safe and sanitized input
- 🧱 **Middleware-protected routes** to ensure only verified users can update profile or password
- ⏱️ Rate-limiting and brute-force protection not implemented but planned (see below) i.e. password change limiter, refresh token limiter etc.
- Monitoring

## 🔄 Token Strategy

- Access Token:

  - Short-lived (e.g., 15 min)
  - Sent in Authorization header for protected routes

- Refresh Token (optional for this challenge):
  - Stored in HTTP-only cookie (could also use Redis) and valid for 7 days
  - Issued on 2FA success and replaced on every login to invalidate older sessions
  - Enables access token renewal without re-authenticating every time

## 🚧 Production Readiness

Not yet production-ready. Here's what's missing and suggested next steps:

| Area                   | Current Status | Next Step for Production                                                  |
| ---------------------- | -------------- | ------------------------------------------------------------------------- |
| Rate limiting          | ❌             | Use `express-rate-limit` or API Gateway                                   |
| Session hijack defense | ⚠️             | Use refresh tokens, device fingerprinting                                 |
| Logging                | ✅             | Pino logs structured output; can be piped to ELK                          |
| Monitoring             | ❌             | Monitor for repeated attempts with invalid fields and suspicious requests |
| Input sanitization     | ✅ (Zod)       | Consider additional XSS protection if needed                              |
| Deployment             | ❌             | Use Docker + CI/CD pipeline + env-based configs                           |
| Secrets management     | ❌             | Use Vault, AWS Secrets Manager, or `.env` via CI                          |
| Email fallback         | ❌             | Allow 2FA via email if SMS fails                                          |

## 🧰 Tools & Libraries Used

| Tool                 | Purpose                            |
| -------------------- | ---------------------------------- |
| **Express.js**       | HTTP server framework              |
| **TypeScript**       | Type-safe development              |
| **Zod**              | Input validation                   |
| **Redis**            | Time-bound storage for 2FA codes   |
| **MongoDB**          | Persistent storage of user data    |
| **JWT**              | Authentication and session control |
| **Twilio**           | Sending SMS messages               |
| **Jest & Supertest** | Testing framework for endpoints    |
| **dotenv**           | Configuring environment variables  |

## 🛡️ Attack Vectors Considered

| Threat                   | Mitigation                                              |
| ------------------------ | ------------------------------------------------------- |
| **SMS interception**     | 2FA codes expire quickly; add email fallback in prod    |
| **Brute-force login**    | Rate limiting (planned); consider CAPTCHA or throttling |
| **Session hijacking**    | Short-lived JWTs; refresh tokens; token bindings        |
| **Replay attacks**       | Time-bound Redis codes, single-use                      |
| **Mobile number change** | Not allowed to prevent account takeovers                |
| **Tampered input**       | Strong Zod validation across all routes                 |

## 🧪 How to Test

You can use Postman or run the included `Jest` tests:

```bash
npm run test
```

Manual test flow:

1. Register a user (/api/auth/register)
2. Login (/api/auth/login)
3. Call /api/auth/verify-2fa with the received code
4. Use the returned access token to:
   - Access /api/user/profile (GET, PUT)
   - Request password change
   - Submit password change with SMS code
