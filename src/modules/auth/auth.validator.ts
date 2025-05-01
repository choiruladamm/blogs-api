import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  name: z
    .string()
    .max(50, { message: 'Name must be at most 50 characters' })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
