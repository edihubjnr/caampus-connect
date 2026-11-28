import argon2 from 'argon2';

import { prisma } from '../../config/database.js';

import type { PublicUser, CreateUserInput, UpdateUserInput } from './user.types.js';

import { AppError } from '../../utils/app-error.js';

// Fields that are safe to return to API consumers.
const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  studentId: true,
  email: true,
  department: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Create a new student account.
export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { studentId: input.studentId }],
    },
    select: {
      email: true,
      studentId: true,
    },
  });

  if (existingUser) {
    if (existingUser.email === input.email) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    throw new AppError('An account with this student ID already exists.', 409);
  }

  // Hash the password before storing it.
  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      studentId: input.studentId,
      email: input.email,
      department: input.department,
      passwordHash,
    },
    select: publicUserSelect,
  });

  return user;
}

// Find a user by email address.
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Find a user by student ID.
export async function findUserByStudentId(studentId: string) {
  return prisma.user.findUnique({
    where: { studentId },
  });
}

// Find a user by ID without exposing the password hash.
export async function findUserById(id: string): Promise<PublicUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
}

// Retrieve all users without exposing password hashes.
export async function findAllUsers(): Promise<PublicUser[]> {
  return prisma.user.findMany({
    select: publicUserSelect,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Update a user's profile.
export async function updateUser(id: string, input: UpdateUserInput): Promise<PublicUser> {
  return prisma.user.update({
    where: { id },
    data: input,
    select: publicUserSelect,
  });
}
