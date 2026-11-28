import { z } from 'zod';

// Validate student registration data.
export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must contain at least 2 characters.')
    .max(50, 'First name cannot exceed 50 characters.'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must contain at least 2 characters.')
    .max(50, 'Last name cannot exceed 50 characters.'),

  studentId: z
    .string()
    .trim()
    .min(3, 'Student ID must contain at least 3 characters.')
    .max(30, 'Student ID cannot exceed 30 characters.'),

  email: z
    .string()
    .trim()
    .email('Please provide a valid email address.')
    .max(254, 'Email address is too long.')
    .transform((value) => value.toLowerCase()),

  department: z
    .string()
    .trim()
    .min(2, 'Department must contain at least 2 characters.')
    .max(100, 'Department cannot exceed 100 characters.'),

  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
});

// Validate profile update data.
export const updateUserSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must contain at least 2 characters.')
      .max(50, 'First name cannot exceed 50 characters.')
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must contain at least 2 characters.')
      .max(50, 'Last name cannot exceed 50 characters.')
      .optional(),

    department: z
      .string()
      .trim()
      .min(2, 'Department must contain at least 2 characters.')
      .max(100, 'Department cannot exceed 100 characters.')
      .optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided for an update.',
  });

// Export inferred TypeScript types from the validation schemas.
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
