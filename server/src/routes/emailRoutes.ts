import { Router, Response } from 'express';
import { emailService } from '../services/emailService.js';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import { ENV } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const router = Router();

// Middleware ensuring endpoint is restricted:
// In development, accessible to authenticated users or admin; in production, STRICTLY ADMIN ONLY.
const testAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: any) => {
  if (ENV.NODE_ENV === 'production' && req.user?.role !== 'admin') {
    sendError(res, 'Access denied. Email testing is restricted in production.', 403, 'FORBIDDEN');
    return;
  }
  next();
};

/**
 * POST /api/email/test
 * Test email sending for any of the 8 templates
 */
router.post(
  '/test',
  requireAuth as any,
  testAuthMiddleware as any,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { template, to, data } = req.body;

      if (!template) {
        sendError(res, 'Template name is required (e.g. welcome, booking-confirmation, etc.)', 400);
        return;
      }

      const recipient = to || req.user?.email || 'test@sukhyatri.in';

      const result = await emailService.testEmailTemplate(template, recipient, data || {});

      sendSuccess(
        res,
        {
          template,
          recipient,
          messageId: result.messageId,
          provider: ENV.EMAIL_PROVIDER,
          htmlPreview: result.html,
        },
        200,
        `Test email for template '${template}' processed successfully`
      );
    } catch (err: any) {
      console.error('[EmailRoutes] Test dispatch error:', err);
      sendError(res, err.message || 'Failed to dispatch test email', 500);
    }
  }
);

/**
 * GET /api/email/preview/:template
 * Direct HTML preview for visual inspection
 */
router.get(
  '/preview/:template',
  requireAuth as any,
  testAuthMiddleware as any,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { template } = req.params;
      const result = await emailService.testEmailTemplate(template, 'preview@sukhyatri.in', req.query);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(result.html);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to generate preview', 500);
    }
  }
);

export const emailRoutes = router;
