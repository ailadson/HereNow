import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6,
    "Password should be at least 6 characters long.")
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6,
    "Password should be at least 6 characters long."),
});