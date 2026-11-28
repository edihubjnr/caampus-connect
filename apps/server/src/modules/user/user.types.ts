import type { User, UserRole } from '../../generated/prisma/client.js';

// Data required when creating a new user.
export type CreateUserInput = {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  department: string;
  password: string;
};

// Data that can be updated on a user's profile.
export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  department?: string;
};

// Public user information.
// Sensitive fields such as passwordHash are excluded.
export type PublicUser = Omit<User, 'passwordHash'>;

// User role type from Prisma.
export type { UserRole };
