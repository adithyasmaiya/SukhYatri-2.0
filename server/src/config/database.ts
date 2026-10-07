import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;
let memoryServerInstance: any = null;

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (isConnected) return;

  const mongoUri = ENV.MONGODB_URI;

  try {
    // Attempt connecting to the configured MongoDB URI
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    const sanitizedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`[Database] Successfully connected to MongoDB: ${sanitizedUri}`);
  } catch (err: any) {
    if (ENV.NODE_ENV === 'development') {
      console.warn(`[Database] Could not connect to primary MongoDB URI (${err.message}).`);
      console.log(`[Database] Initializing in-memory MongoDB instance for local development...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const memUri = memoryServerInstance.getUri();
        await mongoose.connect(memUri);
        isConnected = true;
        console.log(`[Database] Connected to Development In-Memory MongoDB.`);
      } catch (memErr: any) {
        console.error(`[Database] Failed to launch in-memory MongoDB:`, memErr);
        throw memErr;
      }
    } else {
      console.error(`[Database] MongoDB connection error in production:`, err.message);
      throw err;
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error(`[Database] Runtime MongoDB connection error:`, err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn(`[Database] MongoDB disconnected.`);
    isConnected = false;
  });
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log(`[Database] MongoDB connection closed.`);
  }

  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
    console.log(`[Database] In-memory MongoDB stopped.`);
  }
}
