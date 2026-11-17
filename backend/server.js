import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Verify essential environment variables
const validateEnv = () => {
  const missing = [];
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');

  if (missing.length > 0) {
    console.warn(`[Config Warning] Missing recommended environment variables: ${missing.join(', ')}`);
  }
};

let server;

const startServer = async () => {
  try {
    validateEnv();

    // 1. Establish MongoDB connection before accepting HTTP requests
    console.log('[Server] Connecting to MongoDB Atlas...');
    await connectDB();

    // 2. Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  MELD Backend API Server is running!`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Port:        ${PORT}`);
      console.log(`  Base API:    http://localhost:${PORT}/api`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error(`[Server Fatal Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await disconnectDB();
      console.log('[Server] Process exiting gracefully.');
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', error);
  process.exit(1);
});

startServer();

export default app;
