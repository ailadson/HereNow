# Codebase Documentation for `herenow`

## Code Conventions

### General Structure

- **Framework**: The project utilizes the **Next.js** framework, with a directory structure based on the modern app directory conventions (`/src`, `/app`).
- **Language**: **TypeScript** is employed across the codebase, providing type safety and enhancing code clarity.
- **Styling**: **Tailwind CSS** is used for styling, with utility classes applied to ensure a consistent and maintainable design.

### Directories and Key Files

- **src/lib**:
  - **auth.ts**: Configures NextAuth.js for authentication, with custom session management and JWT handling.
  - **prisma.ts**: Sets up Prisma Client, following a singleton pattern to maintain a single database connection across the app.
  - **zod.ts**: Contains validation schemas using **Zod**, enforcing input validation rules throughout the app.
  - **errors.ts**: Defines custom error classes for consistent error handling, enhancing debugging and user feedback.

- **src/app/login**: Contains components and layouts for user authentication flows, including:
  - **LoginWithCredentials.tsx**: Handles credential-based login with proper state management and redirections.
  - **SignupWithCredentials.tsx**: Manages user registration, ensuring input validation and server communication.
  - **GoogleLoginButton.tsx**: Implements a login button for Google authentication.
  - **layout.tsx**: Checks session status to redirect authenticated users, improves user flow.

- **src/components/ui**: UI components based on `shadcn` imports, offering reusable buttons, inputs, and separators, ensuring a cohesive look and feel.

- **src/app/api/auth**: Sets up dynamic API routes with Next.js App Router, integrating authentication handlers effectively.

- **src/app/page.tsx**: Landing page implementation, conditional rendering for sign-in status and navigation.

### Authentication & State Management

- **NextAuth.js**: Facilitates authentication via credentials and OAuth (Google), configured in `auth.ts`.
- **Session Management**: Custom implementation to manage user sessions, with checks and JWT modifications for security.
- **Server Actions**: Employed for form submissions (sign-up, login), aligning with Next.js recommendations for server-side data operations.

## Insights and Learnings

- **Schema Validation**: Extensive use of **Zod** for defining input schemas, ensuring robust data handling before server processing.
- **Component Reusability**: Consistent design patterns through the use of shared UI components, enhancing maintainability.
- **Error Handling**: Systematic error classes to manage predictable and graceful error states across the app.

## Recommendations for Future Developers

- Familiarize with the **Next.js app router** and **NextAuth.js** for efficient routing and authentication flow understanding.
- Review validation schemas in the `lib/zod.ts` for extending or modifying input validation without code duplication.
- Maintain the use of Tailwind CSS and existing UI components to ensure design consistency and simplicity.
- Pay attention to session and JWT configurations, as these have implications for secure and effective authentication.

## Documentation Links

- **NextAuth.js Adapter**: [NextAuth.js Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma?framework=next-js)
- **Installation**: [NextAuth.js Installation](https://authjs.dev/getting-started/installation?framework=next-js)
- **Database Models**: [NextAuth.js Database Models](https://authjs.dev/getting-started/database#models)
- **Session Management**: [NextAuth.js Session Management](https://authjs.dev/getting-started/session-management/login?framework=next-js)
- **Deployment Guide**: [NextAuth.js Deployment](https://authjs.dev/getting-started/deployment)
- **Google Provider**: [Google OAuth](https://authjs.dev/getting-started/providers/google?framework=next-js)

---