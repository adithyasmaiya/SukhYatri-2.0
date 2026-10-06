import { Router } from 'express';
import { destinationController } from '../controllers/destinationController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', destinationController.getAllDestinations);
router.get('/:slug', destinationController.getDestinationBySlug);
router.post('/', requireAuth, requireAdmin, destinationController.createDestination);
router.patch('/:id', requireAuth, requireAdmin, destinationController.updateDestination);

export const destinationRoutes = router;
