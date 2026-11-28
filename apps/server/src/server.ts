import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

async function startServer() {
  try {
    // Verify the PostgreSQL connection.
    await prisma.$connect();

    console.log('PostgreSQL database connected successfully.');

    // Start the Express server after the database connects.
    const server = app.listen(env.PORT, () => {
      console.log(`Nexlect API is running on http://localhost:${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${env.PORT}/api/v1/health`);
    });

    server.on('error', (error) => {
      console.error('Failed to start Nexlect API:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
