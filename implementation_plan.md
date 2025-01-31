# Implementation Plan for Authentication Flow

## Setup Environment
- Ensure Prisma schema for `User`, `Account`, `Session`.
- Install dependencies: `next-auth`, `@auth/prisma-adapter`, `bcryptjs`, `zod`.

## Configure NextAuth
- Create/update config file (e.g., `auth.js` or `auth.ts`) in `/herenow/src/lib`.
- Import modules:
  ```javascript
  import NextAuth from "next-auth";
  import { PrismaAdapter } from "@auth/prisma-adapter";
  import { prisma } from "@/lib/prisma";
  import Credentials from "next-auth/providers/credentials";
  import bcrypt from "bcryptjs";
  import { loginSchema } from "./zod";  // Validation schema
  import { InvalidLoginError } from "./errors";  // Custom errors
  ```

## Define NextAuth Configuration
- Setup `PrismaAdapter` with `prisma`.
- Use `Credentials` provider:
  - Validate credentials with `zod` schema.
  - Fetch user with Prisma.
  - Compare password with `bcrypt`.
  - Return user or throw error.

## Implement Callbacks
- `session` callback: Customize session with user details.
- `jwt` callback: Handle token customization for credential logins.

## JWT Customization
- Implement custom JWT `encode` logic.
- Ensure UUID-based session management.

## Session Management
- Define secure session expiry/management logic.

## Testing & Validation
- Test authentication scenarios.
- Integrate seamlessly with user data and session management.