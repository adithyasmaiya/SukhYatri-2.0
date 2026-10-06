import { Router } from 'express';
import { tripController } from '../controllers/tripController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', tripController.getAllTrips);
router.get('/:slug', tripController.getTripBySlug);
router.post('/', requireAuth, requireAdmin, tripController.createTrip);
router.patch('/:id', requireAuth, requireAdmin, tripController.updateTrip);

export const tripRoutes = router;
