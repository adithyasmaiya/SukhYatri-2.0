import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';
import { paymentRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Order creation requires authentication and rate limiting
router.post('/create-order', requireAuth, paymentRateLimiter, paymentController.createOrder);

// Payment signature verification requires authentication and rate limiting
router.post('/verify', requireAuth, paymentRateLimiter, paymentController.verifyPayment);

// Payment details lookup requires authentication
router.get('/:paymentId', requireAuth, paymentController.getPaymentStatus);

// Webhook listener (Public endpoint, signature verified via x-razorpay-signature)
router.post('/webhook', paymentController.handleWebhook);

export const paymentRoutes = router;
