import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// Load the environment file from the monorepo root.
dotenv.config({
  path: fileURLToPath(new URL('../../../../.env', import.meta.url)),
});

// Define and validate environment variables.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  CLIENT_URL: z.string().url().default('http://localhost:5173'),

  DATABASE_URL: z.string().url(),
  
});

// Export validated environment configuration.
export const env = envSchema.parse(process.env);
