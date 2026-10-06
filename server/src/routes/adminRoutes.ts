import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// CRITICAL SECURITY: Every single admin route requires authentication + admin role
router.use(requireAuth as any, requireAdmin as any);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats as any);

// Bookings
router.get('/bookings', adminController.getBookings as any);
router.get('/bookings/:id', adminController.getBookingById as any);
router.post('/bookings/:id/cancel', adminController.cancelBooking as any);

// Packages
router.get('/packages', adminController.getPackages as any);
router.get('/packages/:id', adminController.getPackageById as any);
router.post('/packages', adminController.createPackage as any);
router.put('/packages/:id', adminController.updatePackage as any);
router.patch('/packages/:id/publish', adminController.togglePackagePublish as any);
router.delete('/packages/:id', adminController.deletePackage as any);

// Destinations
router.get('/destinations', adminController.getDestinations as any);
router.get('/destinations/:id', adminController.getDestinationById as any);
router.post('/destinations', adminController.createDestination as any);
router.put('/destinations/:id', adminController.updateDestination as any);
router.patch('/destinations/:id/publish', adminController.toggleDestinationPublish as any);
router.delete('/destinations/:id', adminController.deleteDestination as any);

// Users
router.get('/users', adminController.getUsers as any);
router.get('/users/:id', adminController.getUserDetails as any);
router.patch('/users/:id/role', adminController.updateUserRole as any);
router.patch('/users/:id/status', adminController.updateUserStatus as any);

// Payments
router.get('/payments', adminController.getPayments as any);

// Coupons
router.get('/coupons', adminController.getCoupons as any);
router.post('/coupons', adminController.createCoupon as any);
router.put('/coupons/:id', adminController.updateCoupon as any);
router.patch('/coupons/:id/toggle', adminController.toggleCouponActive as any);
router.delete('/coupons/:id', adminController.deleteCoupon as any);

// Reviews
router.get('/reviews', adminController.getReviews as any);
router.patch('/reviews/:id/status', adminController.updateReviewStatus as any);
router.delete('/reviews/:id', adminController.deleteReview as any);

// Analytics
router.get('/analytics', adminController.getAnalytics as any);

// Settings
router.get('/settings', adminController.getSettings as any);
router.put('/settings', adminController.updateSettings as any);

// Email Template Testing
router.post('/email/test', async (req: any, res: any) => {
  try {
    const { template, to, data } = req.body;
    if (!template) {
      res.status(400).json({ success: false, message: 'Template name is required' });
      return;
    }
    const { emailService } = await import('../services/emailService.js');
    const result = await emailService.testEmailTemplate(
      template,
      to || req.user?.email || 'admin@sukhyatri.com',
      data || {}
    );
    res.status(200).json({ success: true, data: result, message: `Test email for ${template} dispatched` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Email test failed' });
  }
});

export const adminRoutes = router;
