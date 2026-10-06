import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { destinationRoutes } from './destinationRoutes.js';
import { tripRoutes } from './tripRoutes.js';
import { couponRoutes } from './couponRoutes.js';
import { reviewRoutes } from './reviewRoutes.js';
import { bookingRoutes } from './bookingRoutes.js';
import { paymentRoutes } from './paymentRoutes.js';
import { adminRoutes } from './adminRoutes.js';
import { emailRoutes } from './emailRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', destinationRoutes);
router.use('/trips', tripRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/email', emailRoutes);

export const apiRoutes = router;
