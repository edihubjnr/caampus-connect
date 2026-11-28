import type { Request, Response } from 'express';

import { createUser } from './user.service.js';
import { createUserSchema } from './user.validation.js';

// Register a new student account.
export async function registerUser(req: Request, res: Response) {
  const validatedData = createUserSchema.parse(req.body);

  const user = await createUser(validatedData);

  return res.status(201).json({
    success: true,
    message: 'Your account has been created successfully.',
    data: {
      user,
    },
  });
}
