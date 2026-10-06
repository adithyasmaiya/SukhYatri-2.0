import rateLimit from 'express-rate-limit';

const isQABypass = (req: any): boolean => {
  if (process.env.NODE_ENV === 'production') {
    return false; // STRICTLY DISABLED IN PRODUCTION — All clients must abide by rate limits
  }
  return (
    process.env.NODE_ENV === 'test' ||
    req.headers['x-qa-bypass'] === 'sukhyatri-qa-bypass-key'
  );
};

/**
 * Strict limiter for authentication & security-sensitive endpoints (login, register, OTP verification)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit each IP to 25 requests per window to mitigate brute-force
  standardHeaders: true,
  legacyHeaders: false,
  skip: isQABypass,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Dedicated limiter for payment checkout creation & verification
 */
export const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isQABypass,
  message: {
    success: false,
    message: 'Too many payment requests. Please try again in a few minutes.',
    code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Coupon validation limiter (prevents code brute-forcing / dictionary attacks)
 */
export const couponRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isQABypass,
  message: {
    success: false,
    message: 'Too many coupon check attempts. Please try again later.',
    code: 'COUPON_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Global generous limiter for standard website browsing
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isQABypass,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});
