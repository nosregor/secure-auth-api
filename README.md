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

| Threat/Feature             | Status        | Mitigation Strategy                                                |
| -------------------------- | ------------- | ------------------------------------------------------------------ |
| Input validation           | ✅            | Zod validation on all user input (sanitized input)                 |
| SMS interception           | ⚠️            | Codes expire quickly, not reusable; suggest email fallback in prod |
| Replay attacks             | ✅            | Single-use 2FA codes, expire in Redis ((default 5 mins))           |
| Session hijacking          | ✅            | Refresh token rotation with invalidation of old token              |
| Brute-force login attempts | ❌            | Rate limiting planned (e.g., `express-rate-limit`)                 |
| Mobile number change       | 🚫            | Not allowed to prevent account takeovers                           |
| Refresh token persistence  | ✅ (optional) | Stored as HTTP-only secure cookie (optional in this challenge)     |

## 🔄 Token Strategy

- Access Token:

  - Short-lived (e.g., 15 min)
  - Sent in Authorization header for protected routes

- Refresh Token (optional for this challenge):
  - Stored in HTTP-only cookie and valid for 7 days
  - Issued on 2FA success and replaced on every login to invalidate older sessions
  - Enables access token renewal without re-authenticating every time

## 🚧 Production Readiness

Not yet production-ready. Here's what's missing and suggested next steps:

| Area                   | Current Status | Next Step for Production                                                  |
| ---------------------- | -------------- | ------------------------------------------------------------------------- |
| Rate limiting          | ❌             | Use `express-rate-limit` or API Gateway                                   |
| Session hijack defense | ✅             | Use refresh tokens with rotation                                          |
| Logging                | ✅             | Pino logs structured output; can be piped to ELK                          |
| Monitoring             | ❌             | Monitor for repeated attempts with invalid fields and suspicious requests |
| Input sanitization     | ✅ (Zod)       | Consider additional XSS protection if needed use `helmet`                 |
| Deployment             | ❌             | Use Docker + CI/CD pipeline                                               |
| Secrets management     | ❌             | Use Vault, AWS Secrets Manager, or CI-injected                            |
| Email fallback         | ❌             | Implement fallback method for 2FA if SMS fails                            |

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
| **helmet**           | ..                                 |
| **csurf**            | /.                                 |

## 🛡️ Attack Vectors Considered

| Threat                   | Mitigation                                         |
| ------------------------ | -------------------------------------------------- |
| **SMS interception**     | Short expiry and one-time-use codes                |
| **Brute-force login**    | To be mitigated with rate-limiting                 |
| **Session hijacking**    | Refresh token rotation + short-lived access tokens |
| **Replay attacks**       | One-time 2FA codes stored in Redis                 |
| **Mobile number change** | Not allowed to prevent account takeovers           |
| **Input tampering**      | Enforced with Zod schema validation                |

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
