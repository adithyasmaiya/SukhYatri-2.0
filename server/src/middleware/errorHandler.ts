import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Safe sanitized logging
  const safeLogUrl = req.originalUrl || req.url;
  console.error(`[Server Error] ${req.method} ${safeLogUrl}:`, err.message || err);

  // 1. Mongoose duplicate key error (e.g. unique email or slug)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
      code: 'DUPLICATE_KEY_ERROR',
    });
    return;
  }

  // 2. Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: messages[0] || 'Validation constraints failed.',
      code: 'VALIDATION_ERROR',
      errors: messages,
    });
    return;
  }

  // 3. CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid resource identifier format.',
      code: 'INVALID_ID',
    });
    return;
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Authentication session expired or invalid. Please sign in again.',
      code: 'INVALID_TOKEN',
    });
    return;
  }

  const statusCode = typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600
    ? err.statusCode
    : 500;

  // Never leak internal implementation, database errors, or file paths in production
  let publicMessage = err.message || 'An unexpected internal error occurred.';
  if (statusCode === 500 && ENV.NODE_ENV === 'production') {
    publicMessage = 'An unexpected internal server error occurred. Please contact SukhYatri support.';
  }

  const response: any = {
    success: false,
    message: publicMessage,
    code: err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR'),
  };

  // Stack traces strictly in development only
  if (ENV.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
