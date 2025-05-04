# ts-starter

This is a **node.js, express, typescript** starter with minimal setup to get you up and running!

## Technical Features

- Express.js + TypeScript
- Request Validation with Zod
- Linting and formatting (eslint, prettier)
- Testing: unit tests (Jest), integration (supertest)
- Logger (Pino)
- Global Error handling
- API documentation (swagger)

## 📁 Project Structure

```bash
src/
├── config/
│   └── index.ts
├── docs/
│   └── openapi.ts
├── middleware/
│   └── errorHandler.ts
│   └── validate.ts       # Zod validation middleware
├── routes/
│   └── example.ts
│   └── users.ts
├── schemas/           # New Zod schemas directory
│   └── userSchema.ts
├── utils/
│   └── errors.ts
│   └── logger.ts
├── app.ts
├── server.ts
.env
```

### Deployment considerations

When preparing your API for production, keep in mind the following best practices:

Disable automatic schema synchronization by setting synchronize to false in your TypeORM configuration.
Configure secure HTTP headers and rate limiting.
Use environment variables to manage sensitive configurations and credentials.
Thoroughly test your API using unit and integration tests.

A good API document must provide detailed information about each endpoint, including:
HTTP method (GET, POST, PUT, DELETE, etc.).
URL paths and any required/optional parameters.
Request and response formats, including expected headers and body contents.
Error handling, including error codes and messages for different failure scenarios.
Examples of typical requests and responses to illustrate how the API works in practice.

Disable automatic schema synchronization

Configure secure HTTP headers and rate limiting

Use environment variables for sensitive data

Add validation tests for all endpoints

Document validation requirements in your API docs

## Old eslint config

Double check linter rules

```bash
{
  "env": {
    "es2021": true
  },
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

Ref:

- https://medium.com/@gabrieldrouin/node-js-2025-guide-how-to-setup-express-js-with-typescript-eslint-and-prettier-b342cd21c30d#e155
- https://transloadit.com/devtips/building-restful-apis-with-node-js-express-and-typescript/
- https://greenydev.com/blog/zod-validation/
