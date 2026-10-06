import { Router } from 'express';
import { bookingController } from '../controllers/bookingController.js';
import { invoiceController } from '../controllers/invoiceController.js';
import { reviewController } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth); // All booking routes require authentication

router.post('/', bookingController.createBooking);
router.get('/my', bookingController.getMyBookings);
router.get('/:bookingId/invoice', invoiceController.getInvoicePdf as any);
router.get('/:id', bookingController.getBookingById);
router.post('/:id/cancel', bookingController.cancelBooking);
router.post('/:id/review', reviewController.createReview);

export const bookingRoutes = router;
