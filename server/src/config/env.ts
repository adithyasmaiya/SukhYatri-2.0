import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sukhyatri',
  JWT_SECRET: process.env.JWT_SECRET || 'sukhyatri_jwt_secret_dev_key_2026_secured',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.APP_URL || process.env.CORS_ORIGIN || 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:5173',
  API_URL: process.env.API_URL || 'http://localhost:5000/api',
  ADMIN_NAME: process.env.ADMIN_NAME || 'SukhYatri Admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@sukhyatri.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminPass123!',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_sukhyatri_dev123',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'sukhyatri_dev_rzp_secret_key',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'sukhyatri_webhook_secret_key',
  // Email Notification & Invoice Config
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'console',
  EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY || '',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'concierge@sukhyatri.com',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'SukhYatri Concierge',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  APP_URL: process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:5173',
};

// Production environment sanity check
if (ENV.NODE_ENV === 'production') {
  const missing: string[] = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('dev')) missing.push('JWT_SECRET (must be unique & secure)');
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!process.env.FRONTEND_URL && !process.env.CORS_ORIGIN && !process.env.APP_URL) missing.push('FRONTEND_URL / APP_URL');
  if (!process.env.RAZORPAY_KEY_ID) missing.push('RAZORPAY_KEY_ID');
  if (!process.env.RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) missing.push('RAZORPAY_WEBHOOK_SECRET');
  if (missing.length > 0) {
    console.error(`[Security Warning] Missing or default production environment variables: ${missing.join(', ')}`);
  }
}

