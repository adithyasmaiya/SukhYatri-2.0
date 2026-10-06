import { Response } from 'express';
import { adminService } from '../services/adminService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { toCsvString } from '../utils/csvHelper.js';

export const adminController = {
  // 1. Dashboard Stats
  async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const range = (req.query.range as any) || '30d';
      const stats = await adminService.getDashboardStats(range);
      sendSuccess(res, stats, 200, 'Dashboard metrics retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 2. Bookings Management
  async getBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const isExport = req.query.export === 'csv';
      const query = {
        ...req.query,
        limit: isExport ? 5000 : req.query.limit,
      };

      const result = await adminService.getBookings(query);

      if (isExport) {
        const headers = [
          { key: 'bookingId', label: 'Booking ID' },
          { key: 'primaryTraveller.name', label: 'Customer Name' },
          { key: 'primaryTraveller.email', label: 'Customer Email' },
          { key: 'primaryTraveller.phone', label: 'Customer Phone' },
          { key: 'tripSnapshot.title', label: 'Trip Title' },
          { key: 'destinationName', label: 'Destination' },
          { key: 'travelDate', label: 'Travel Date' },
          { key: 'travellers', label: 'Travellers' },
          { key: 'pricing.totalAmount', label: 'Total Amount (INR)' },
          { key: 'amountPaid', label: 'Amount Paid (INR)' },
          { key: 'paymentStatus', label: 'Payment Status' },
          { key: 'bookingStatus', label: 'Booking Status' },
          { key: 'createdAt', label: 'Booking Created Date' },
        ];
        const csv = toCsvString(headers, result.bookings);
        const filename = `sukhyatri_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(csv);
        return;
      }

      sendSuccess(res, result, 200, 'Bookings retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async getBookingById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await adminService.getBookingById(id);
      sendSuccess(res, data, 200, 'Booking details retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const updated = await adminService.cancelBooking(id, reason, req.user!._id.toString());
      sendSuccess(res, updated, 200, 'Booking cancelled successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 3. Package Management
  async getPackages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await adminService.getPackages(req.query);
      sendSuccess(res, result, 200, 'Packages retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async getPackageById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pkg = await adminService.getPackageById(id);
      sendSuccess(res, pkg, 200, 'Package details retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async createPackage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const created = await adminService.createPackage(req.body, req.user!._id.toString());
      sendSuccess(res, created, 201, 'Package created successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async updatePackage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await adminService.updatePackage(id, req.body, req.user!._id.toString());
      sendSuccess(res, updated, 200, 'Package updated successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async togglePackagePublish(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await adminService.togglePackagePublish(id, req.user!._id.toString());
      sendSuccess(res, updated, 200, `Package status updated to ${updated.isPublished ? 'Published' : 'Draft'}`);
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async deletePackage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await adminService.deletePackage(id, req.user!._id.toString());
      sendSuccess(res, result, 200, 'Package deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 4. Destination Management
  async getDestinations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await adminService.getDestinations(req.query);
      sendSuccess(res, result, 200, 'Destinations retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async getDestinationById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dest = await adminService.getDestinationById(id);
      sendSuccess(res, dest, 200, 'Destination details retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async createDestination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const created = await adminService.createDestination(req.body, req.user!._id.toString());
      sendSuccess(res, created, 201, 'Destination created successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async updateDestination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await adminService.updateDestination(id, req.body, req.user!._id.toString());
      sendSuccess(res, updated, 200, 'Destination updated successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async toggleDestinationPublish(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await adminService.toggleDestinationPublish(id, req.user!._id.toString());
      sendSuccess(res, updated, 200, `Destination status updated to ${updated.isPublished ? 'Published' : 'Draft'}`);
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async deleteDestination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await adminService.deleteDestination(id, req.user!._id.toString());
      sendSuccess(res, result, 200, 'Destination deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 5. User Management
  async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const isExport = req.query.export === 'csv';
      const query = {
        ...req.query,
        limit: isExport ? 5000 : req.query.limit,
      };

      const result = await adminService.getUsers(query);

      if (isExport) {
        const headers = [
          { key: '_id', label: 'User ID' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Account Status' },
          { key: 'emailVerified', label: 'Email Verified' },
          { key: 'bookingCount', label: 'Bookings Count' },
          { key: 'totalSpent', label: 'Total Spent (INR)' },
          { key: 'createdAt', label: 'Joined Date' },
        ];
        const csv = toCsvString(headers, result.users);
        const filename = `sukhyatri_users_${new Date().toISOString().slice(0, 10)}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(csv);
        return;
      }

      sendSuccess(res, result, 200, 'Users retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async getUserDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await adminService.getUserDetails(id);
      sendSuccess(res, data, 200, 'User details retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const updated = await adminService.updateUserRole(id, role, req.user!._id.toString());
      sendSuccess(res, updated, 200, 'User role updated');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async updateUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await adminService.updateUserStatus(id, status, req.user!._id.toString());
      sendSuccess(res, updated, 200, 'User status updated');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 6. Payments
  async getPayments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const isExport = req.query.export === 'csv';
      const query = {
        ...req.query,
        limit: isExport ? 5000 : req.query.limit,
      };

      const result = await adminService.getPayments(query);

      if (isExport) {
        const headers = [
          { key: 'paymentId', label: 'Payment ID' },
          { key: 'bookingId', label: 'Booking ID' },
          { key: 'customerName', label: 'Customer Name' },
          { key: 'customerEmail', label: 'Customer Email' },
          { key: 'tripTitle', label: 'Trip Title' },
          { key: 'destination', label: 'Destination' },
          { key: 'amount', label: 'Amount (INR)' },
          { key: 'method', label: 'Method' },
          { key: 'status', label: 'Status' },
          { key: 'razorpayPaymentId', label: 'Razorpay Payment ID' },
          { key: 'razorpayOrderId', label: 'Razorpay Order ID' },
          { key: 'createdAt', label: 'Payment Date' },
        ];
        const csv = toCsvString(headers, result.payments);
        const filename = `sukhyatri_payments_${new Date().toISOString().slice(0, 10)}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(csv);
        return;
      }

      sendSuccess(res, result, 200, 'Payments retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 7. Coupons
  async getCoupons(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await adminService.getCoupons(req.query);
      sendSuccess(res, result, 200, 'Coupons retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async createCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const created = await adminService.createCoupon(req.body, req.user!._id.toString());
      sendSuccess(res, created, 201, 'Coupon created successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async updateCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await adminService.updateCoupon(id, req.body, req.user!._id.toString());
      sendSuccess(res, updated, 200, 'Coupon updated successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async toggleCouponActive(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await adminService.toggleCouponActive(id, req.user!._id.toString());
      sendSuccess(res, updated, 200, `Coupon is now ${updated.isActive ? 'Active' : 'Inactive'}`);
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async deleteCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await adminService.deleteCoupon(id, req.user!._id.toString());
      sendSuccess(res, result, 200, 'Coupon deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 8. Reviews Moderation
  async getReviews(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await adminService.getReviews(req.query);
      sendSuccess(res, result, 200, 'Reviews retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async updateReviewStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await adminService.updateReviewStatus(id, status, req.user!._id.toString());
      sendSuccess(res, updated, 200, `Review status updated to ${status}`);
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async deleteReview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await adminService.deleteReview(id, req.user!._id.toString());
      sendSuccess(res, result, 200, 'Review deleted');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 9. Analytics
  async getAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const analytics = await adminService.getAnalytics();
      sendSuccess(res, analytics, 200, 'Analytics data retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  // 10. Platform Settings
  async getSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await adminService.getSettings();
      sendSuccess(res, settings, 200, 'Settings retrieved');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },

  async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await adminService.updateSettings(req.body, req.user!._id.toString());
      sendSuccess(res, settings, 200, 'Settings updated successfully');
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 500);
    }
  },
};
