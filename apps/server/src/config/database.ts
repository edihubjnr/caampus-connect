import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PrismaClient } from '../generated/prisma/client.js';

import { env } from './env.js';

// Create a PostgreSQL connection pool.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Create the Prisma PostgreSQL adapter.
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the PostgreSQL adapter.
export const prisma = new PrismaClient({
  adapter,
});
