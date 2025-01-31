'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod';
import { revalidatePath } from 'next/cache';
import { signIn } from '@/lib/auth';
import { InvalidLoginError } from '../errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6,
    "Password should be at least 6 characters long."),
});

type signUpState = { error: null | string, isSignedUp: boolean }

export async function signupUser(_: unknown, data: FormData): Promise<signUpState> {
  try {
    const { email, password } = await signUpSchema.parseAsync({
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('name'),
    });

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    revalidatePath('/');

    await signIn('credentials', {
      email: user.email,
      password: password,
      redirect: false,
    });

    return { error: null, isSignedUp: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message, isSignedUp: false };
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, isSignedUp: false };
    }

    console.error('Signup error', error);
    return { error: 'Signup error', isSignedUp: false };
  }
}

export async function loginWithCredentials(_: unknown, data: FormData) {
  try {
    await signIn('credentials', {
      email: data.get('email'),
      password: data.get('password'),
      redirect: false,
    });

    revalidatePath('/');
    return { error: null, isLoggedIn: true };
  } catch (error) {
    if (error instanceof InvalidLoginError || error instanceof ZodError) {
      return { error: 'Invalid login attempt', isLoggedIn: false };
    }

    console.error('Login error', error);
    return { error: 'Please try again', isLoggedIn: false };
  }
}
