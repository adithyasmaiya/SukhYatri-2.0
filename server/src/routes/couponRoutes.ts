import { Router } from 'express';
import { couponController } from '../controllers/couponController.js';
import { couponRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/validate', couponRateLimiter, couponController.validate);
router.get('/', couponController.getAllCoupons);

export const couponRoutes = router;
