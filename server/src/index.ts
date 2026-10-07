import app from './app.js';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';

// Auto-connect to database for Vercel Serverless Function invocations
let isConnecting: Promise<void> | null = null;

const handler = async (req: any, res: any) => {
  if (mongoose.connection.readyState !== 1) {
    if (!isConnecting) {
      isConnecting = connectDatabase().finally(() => {
        isConnecting = null;
      });
    }
    try {
      await isConnecting;
    } catch (err: any) {
      console.error('[Serverless Handler] Database auto-connect failed:', err?.message || err);
    }
  }
  return app(req, res);
};

export default handler;
