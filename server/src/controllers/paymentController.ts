import { Response, Request } from 'express';
import { paymentService } from '../services/paymentService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const paymentController = {
  /**
   * POST /api/payments/create-order
   * Initialize a Razorpay order for a booking reservation
   */
  async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
        return;
      }

      const { bookingId } = req.body;
      if (!bookingId) {
        sendError(res, 'Booking reference ID is required', 400, 'MISSING_BOOKING_ID');
        return;
      }

      const orderData = await paymentService.createOrder({
        bookingId,
        userId: req.user.id,
        userRole: req.user.role,
      });

      sendSuccess(res, orderData, 201, 'Payment order created successfully');
    } catch (err: any) {
      console.error('[PaymentController] createOrder error:', err);
      sendError(
        res,
        err.message || 'Failed to initialize payment order',
        err.statusCode || 500,
        err.code || 'PAYMENT_ORDER_ERROR'
      );
    }
  },

  /**
   * POST /api/payments/verify
   * Verify Razorpay payment signature and confirm booking
   */
  async verifyPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
        return;
      }

      const {
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        sendError(
          res,
          'Incomplete payment verification parameters. All Razorpay credentials are required.',
          400,
          'MISSING_PAYMENT_FIELDS'
        );
        return;
      }

      const result = await paymentService.verifyPayment({
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId: req.user.id,
        userRole: req.user.role,
      });

      sendSuccess(
        res,
        {
          booking: result.booking,
          payment: result.payment,
          alreadyProcessed: result.alreadyProcessed,
        },
        200,
        result.message
      );
    } catch (err: any) {
      console.error('[PaymentController] verifyPayment error:', err);
      sendError(
        res,
        err.message || 'Payment signature verification failed',
        err.statusCode || 400,
        err.code || 'VERIFICATION_ERROR'
      );
    }
  },

  /**
   * GET /api/payments/:paymentId
   * Retrieve safe payment status and details
   */
  async getPaymentStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
        return;
      }

      const { paymentId } = req.params;
      if (!paymentId) {
        sendError(res, 'Payment reference ID is required', 400, 'MISSING_PAYMENT_ID');
        return;
      }

      const payment = await paymentService.getPaymentStatus(
        paymentId,
        req.user.id,
        req.user.role
      );

      sendSuccess(res, payment, 200);
    } catch (err: any) {
      sendError(
        res,
        err.message || 'Payment record not found',
        err.statusCode || 404,
        err.code || 'PAYMENT_NOT_FOUND'
      );
    }
  },

  /**
   * POST /api/payments/webhook
   * Razorpay webhook listener for asynchronous payment events
   */
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = (req.headers['x-razorpay-signature'] as string) || '';
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const result = await paymentService.processWebhook(rawBody, signature);
      res.status(200).json({ ok: true, received: true, ...result });
    } catch (err: any) {
      console.error('[PaymentController] handleWebhook error:', err);
      res.status(err.statusCode || 400).json({
        status: 'error',
        message: err.message || 'Webhook verification failed',
      });
    }
  },
};
