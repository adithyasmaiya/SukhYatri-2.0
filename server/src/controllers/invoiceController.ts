import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { invoiceService } from '../services/invoiceService.js';
import { sendError } from '../utils/apiResponse.js';

export const invoiceController = {
  /**
   * GET /api/bookings/:bookingId/invoice
   * Secure PDF Invoice Download/View
   * 1. Authenticates user
   * 2. Authorizes ownership OR admin role
   * 3. Verifies invoice availability (booking is paid/confirmed)
   * 4. Returns application/pdf stream/buffer
   */
  async getInvoicePdf(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required to access invoice', 401, 'UNAUTHORIZED');
        return;
      }

      const { bookingId } = req.params;
      if (!bookingId) {
        sendError(res, 'Booking ID is required', 400, 'MISSING_BOOKING_ID');
        return;
      }

      const cleanId = bookingId.trim().toUpperCase();

      // Retrieve booking
      const booking = await Booking.findOne({
        $or: [
          { bookingId: cleanId },
          { _id: bookingId.match(/^[0-9a-fA-F]{24}$/) ? bookingId : null },
        ],
      });

      if (!booking) {
        sendError(res, 'Booking reservation not found', 404, 'BOOKING_NOT_FOUND');
        return;
      }

      // Security Check: Ownership or Admin
      const currentUserId = req.user.id || req.user._id?.toString();
      const isOwner = Boolean(currentUserId && booking.userId.toString() === currentUserId.toString());
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        sendError(res, 'Unauthorized. You cannot access another traveller\'s invoice.', 403, 'FORBIDDEN');
        return;
      }

      // Check payment status - invoice is available for paid/confirmed or previously paid bookings
      if (booking.paymentStatus !== 'paid' && booking.bookingStatus !== 'confirmed' && booking.paymentStatus !== 'refunded') {
        sendError(
          res,
          'Invoice is not available for unpaid reservations. Complete payment to access invoice.',
          400,
          'INVOICE_NOT_AVAILABLE'
        );
        return;
      }

      // Ensure invoice number exists
      if (!booking.invoiceNumber) {
        booking.invoiceNumber = await invoiceService.generateUniqueInvoiceNumber();
        booking.invoiceGeneratedAt = new Date();
        await booking.save();
      }

      // Fetch payment record if available
      const payment = await Payment.findOne({
        $or: [
          { bookingId: booking.bookingId },
          { paymentId: booking.paymentId },
        ],
      });

      // Generate or retrieve cached PDF buffer
      const pdfBuffer = await invoiceService.generateInvoicePdf(booking, payment);

      const filename = `SukhYatri_Invoice_${booking.invoiceNumber || booking.bookingId}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.status(200).send(pdfBuffer);
    } catch (err: any) {
      console.error('[InvoiceController] Failed to generate/return invoice:', err);
      sendError(res, err.message || 'Failed to generate invoice', 500);
    }
  },
};
