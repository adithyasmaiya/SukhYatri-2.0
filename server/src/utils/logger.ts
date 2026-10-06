/**
 * Production-grade Structured Logger for SukhYatri
 * Automatically redacts sensitive fields like passwords, secrets, tokens, OTPs, and card info.
 */

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'newpassword',
  'oldpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'secret',
  'jwt_secret',
  'razorpay_key_secret',
  'razorpay_secret',
  'razorpay_webhook_secret',
  'resend_api_key',
  'smtp_pass',
  'otp',
  'verificationtoken',
  'resetpasswordtoken',
  'authorization',
  'cookie',
  'cardnumber',
  'cvv',
  'card',
]);

function redact(obj: any, depth = 0): any {
  if (depth > 5) return '[Truncated]';
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redact(item, depth + 1));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase().replace(/[-_]/g, '');
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = redact(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatLog(level: LogLevel, message: string, meta?: any): string {
  const timestamp = new Date().toISOString();
  const safeMeta = meta ? redact(meta) : undefined;
  const entry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(safeMeta ? { meta: safeMeta } : {}),
  };
  return JSON.stringify(entry);
}

export const logger = {
  info(message: string, meta?: any) {
    console.log(formatLog('info', message, meta));
  },
  warn(message: string, meta?: any) {
    console.warn(formatLog('warn', message, meta));
  },
  error(message: string, meta?: any) {
    console.error(formatLog('error', message, meta));
  },
  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', message, meta));
    }
  },
};
