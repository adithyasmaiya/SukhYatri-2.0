import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { User, IUser } from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication token missing or invalid', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      sendError(res, 'User session has expired or no longer exists', 401, 'USER_NOT_FOUND');
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    sendError(res, 'Invalid or expired authentication token', 401, 'INVALID_TOKEN');
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'admin') {
    sendError(res, 'Access forbidden. Administrator privileges required.', 403, 'FORBIDDEN');
    return;
  }
  next();
}
