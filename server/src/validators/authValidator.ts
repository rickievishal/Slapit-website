import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(254),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const googleCredentialSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
  audience: z.enum(['admin', 'customer']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
