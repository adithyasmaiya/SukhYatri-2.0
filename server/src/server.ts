import app from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Trip } from './models/Trip.js';
import { runSeed } from './scripts/seed.js';

let server: any = null;

async function startServer() {
  try {
    // 1. Establish database connection
    await connectDatabase();

    // 2. Safe Database Readiness Check
    const tripCount = await Trip.countDocuments();
    if (tripCount === 0) {
      if (ENV.NODE_ENV === 'production') {
        console.log('[Server] Production database is empty. Running safe production catalog initialization...');
        const { runProductionInit } = await import('./scripts/prodInit.js');
        await runProductionInit(false);
      } else {
        console.log('[Server] Development database is empty. Priming test seed data...');
        await runSeed(false);
      }
    }

    // 2. Start HTTP server
    server = app.listen(ENV.PORT, () => {
      console.log(`\n=================================================`);
      console.log(`  SukhYatri 2.0 Backend Server Active`);
      console.log(`  Port:         ${ENV.PORT}`);
      console.log(`  Environment:  ${ENV.NODE_ENV}`);
      console.log(`  API Base:     http://localhost:${ENV.PORT}/api`);
      console.log(`  Health Check: http://localhost:${ENV.PORT}/api/health`);
      console.log(`=================================================\n`);
    });

    // 3. Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      if (server) {
        server.close(async () => {
          console.log('[Server] HTTP server closed.');
          await disconnectDatabase();
          process.exit(0);
        });
      } else {
        await disconnectDatabase();
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // 4. Production Error Monitoring Hooks
    process.on('unhandledRejection', (reason: any) => {
      console.error('[Process] Unhandled Promise Rejection:', reason?.message || reason);
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('[Process] Uncaught Exception:', error?.message || error);
    });
  } catch (error) {
    console.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
}

startServer();
