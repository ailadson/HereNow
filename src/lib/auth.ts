import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { User } from "@auth/core/types";
import { ZodError } from "zod"
import { v4 as uuid } from "uuid"
import { encode } from "@auth/core/jwt"
import { loginSchema } from "./zod"
import bcrypt from "bcryptjs"
import { InvalidLoginError } from "./errors"

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    }
  }
}

const adapter = PrismaAdapter(prisma)
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials)

          const user = await prisma.user.findFirst({
            where: { email },
          });

          if (!user) {
            throw new InvalidLoginError()
          }

          const isValid = bcrypt.compareSync(password, user.passwordHash);

          if (!isValid) {
            return null
          }

          return { email: user.email, id: user.id } as User
        } catch (error) {
          if (error instanceof ZodError) {
            throw new InvalidLoginError()
          }
          console.error("Unknown error", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const user = await prisma.user.findFirst({
        where: {
          email: session.user.email,
        }
      });

      return {
        ...session,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: user?.name || '',
        }
      };
    },
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true
      }

      return token
    },
  },
  jwt: {
    encode: async (params) => {
      if (params.token?.credentials) {
        const sessionToken = uuid()

        if (!params.token.sub) {
          throw new Error("sub is required")
        }

        const createdSession = await adapter.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Session could not be created")
        }

        return sessionToken;
      }

      return encode(params);
    }
  }
})