import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';
import { Prisma } from '../generated/prisma/client.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  // If the response has already started, let Express handle the error.
  if (res.headersSent) {
    return next(error);
  }

  // Handle request validation errors from Zod.
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Request validation failed.',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });

    return;
  }

  // Handle errors intentionally created with AppError.
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
    });

    return;
  }

  // Handle Prisma unique-constraint violations.
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(409).json({
      success: false,
      status: 'fail',
      message: 'A record with this information already exists.',
    });

    return;
  }

  // Handle Prisma record-not-found errors.
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    res.status(404).json({
      success: false,
      status: 'fail',
      message: 'The requested record could not be found.',
    });

    return;
  }

  // Log unexpected errors for debugging.
  console.error('Unexpected error:', error);

  // Avoiding exposed internal error details in production.
  const message =
    env.NODE_ENV === 'development' && error instanceof Error
      ? error.message
      : 'An unexpected error occurred. Please try again later.';

  res.status(500).json({
    success: false,
    status: 'error',
    message,
  });
}
