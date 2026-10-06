import { Router } from 'express';
import { invoiceController } from '../controllers/invoiceController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Secure authenticated invoice download
router.get('/:bookingId/invoice', requireAuth as any, invoiceController.getInvoicePdf as any);

export const invoiceRoutes = router;
