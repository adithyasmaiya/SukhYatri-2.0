import { Router } from 'express';
import { reviewController } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, reviewController.createReview);
router.get('/trip/:tripId', reviewController.getReviewsForTrip);

export const reviewRoutes = router;
