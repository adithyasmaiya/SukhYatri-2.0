import { Response } from 'express';
import { Booking, IBooking } from '../models/Booking.js';
import { Trip } from '../models/Trip.js';
import { Coupon } from '../models/Coupon.js';
import { generateBookingId } from '../utils/bookingIdGenerator.js';
import { pricingService } from '../services/pricingService.js';
import { emailService } from '../services/emailService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const bookingController = {
  async createBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const {
        tripId,
        packageId,
        travelDate,
        travellers,
        adults = 1,
        children = 0,
        rooms = 1,
        roomCategory = 'Heritage Boutique',
        slot = 'Morning departure (09:00 AM)',
        primaryTraveller,
        additionalTravellers = [],
        couponCode,
        paymentMethod = 'upi',
      } = req.body;

      // 1. Identify trip
      const targetId = tripId || packageId;
      if (!targetId) {
        sendError(res, 'Trip / package ID is required', 400, 'MISSING_TRIP_ID');
        return;
      }

      let trip = await Trip.findOne({
        $or: [
          { slug: targetId.toString().toLowerCase() },
          { _id: targetId.toString().match(/^[0-9a-fA-F]{24}$/) ? targetId : null },
        ],
        isPublished: true,
      });

      if (!trip) {
        sendError(res, 'Trip package not found or no longer available', 404, 'TRIP_NOT_FOUND');
        return;
      }

      // 2. Validate Travel Date
      if (!travelDate) {
        sendError(res, 'Travel departure date is required', 400, 'MISSING_TRAVEL_DATE');
        return;
      }

      const departureDate = new Date(travelDate);
      if (isNaN(departureDate.getTime())) {
        sendError(res, 'Invalid travel departure date format', 400, 'INVALID_DATE');
        return;
      }

      // 3. Validate Travellers Count
      const totalTravellers = Math.max(1, Number(travellers) || Number(adults) + Number(children) || 1);

      // 4. Validate Primary Traveller
      if (!primaryTraveller?.name || !primaryTraveller?.email || !primaryTraveller?.phone) {
        sendError(res, 'Primary traveller name, email, and mobile number are required', 400, 'INVALID_LEAD_GUEST');
        return;
      }

      // 5. Authoritative Server-side Price Calculation (NEVER TRUST CLIENT TOTALS)
      const { pricing, appliedCoupon, couponError } = await pricingService.calculateBookingPricing(
        trip,
        totalTravellers,
        couponCode
      );

      // 6. Calculate End Date from Duration
      const durationDays = trip.days || 5;
      const calculatedEnd = new Date(departureDate.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);
      const endDateStr = calculatedEnd.toISOString().split('T')[0];

      // 7. Check if existing pending draft booking exists or generate new reference
      let existingDraft = null;
      if (req.body.bookingId) {
        existingDraft = await Booking.findOne({
          bookingId: req.body.bookingId.trim().toUpperCase(),
          userId: req.user.id,
          bookingStatus: { $in: ['pending_payment', 'payment_failed'] },
        });
      }

      const bookingId = existingDraft ? existingDraft.bookingId : generateBookingId();

      const bookingPayload = {
        bookingId,
        userId: req.user.id,
        tripId: trip._id,
        tripSnapshot: {
          id: trip.slug || trip.id,
          title: trip.title,
          image: trip.images?.[0] || '',
          destination: trip.destinationName,
          duration: trip.duration,
          price: trip.price,
        },
        destinationName: trip.destinationName,
        travelDate: travelDate.split('T')[0],
        endDate: endDateStr,
        duration: trip.duration,
        slot,
        travellers: totalTravellers,
        adults: Math.max(1, Number(adults) || 1),
        children: Math.max(0, Number(children) || 0),
        rooms: Math.max(1, Number(rooms) || 1),
        roomCategory,
        primaryTraveller: {
          name: String(primaryTraveller.name).replace(/<[^>]*>?/gm, '').trim().slice(0, 80),
          email: String(primaryTraveller.email).trim().toLowerCase().slice(0, 100),
          phone: String(primaryTraveller.phone).replace(/[^0-9+-\s]/g, '').trim().slice(0, 20),
          gender: String(primaryTraveller.gender || 'Not specified').slice(0, 30),
          dob: String(primaryTraveller.dob || '').slice(0, 20),
          specialRequests: String(primaryTraveller.specialRequests || '').replace(/<[^>]*>?/gm, '').trim().slice(0, 500),
        },
        additionalTravellers: (additionalTravellers || []).map((t: any) => ({
          name: String(t.name || 'Companion').replace(/<[^>]*>?/gm, '').trim().slice(0, 80),
          age: t.age ? Math.min(120, Math.max(0, Number(t.age))) : undefined,
          gender: String(t.gender || 'Companion').slice(0, 30),
        })),
        pricing,
        paymentStatus: 'pending' as const,
        paymentMethod: paymentMethod || 'razorpay',
        bookingStatus: 'pending_payment' as const,
        refundStatus: 'not_applicable' as const,
        amountPaid: 0,
      };

      let bookingRecord;
      if (existingDraft) {
        Object.assign(existingDraft, bookingPayload);
        bookingRecord = await existingDraft.save();
      } else {
        bookingRecord = await Booking.create(bookingPayload);
      }

      sendSuccess(res, bookingRecord, 201, 'Booking reservation created in pending payment status');
    } catch (err: any) {
      sendError(res, err.message || 'Failed to create booking', 500);
    }
  },

  async getMyBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
      sendSuccess(res, bookings);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch bookings', 500);
    }
  },

  async getBookingById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clean = id.trim().toUpperCase();

      const booking = await Booking.findOne({
        $or: [
          { bookingId: clean },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      });

      if (!booking) {
        sendError(res, 'Booking not found', 404, 'BOOKING_NOT_FOUND');
        return;
      }

      // Strict User Ownership Guard:
      // If user is neither the owner nor an admin, deny access completely
      if (
        req.user &&
        booking.userId.toString() !== req.user.id.toString() &&
        req.user.role !== 'admin'
      ) {
        sendError(res, 'Access denied. You do not have permission to view this reservation.', 403, 'FORBIDDEN');
        return;
      }

      sendSuccess(res, booking);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch booking', 500);
    }
  },

  async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const { id } = req.params;
      const { reason, customReason } = req.body;

      const clean = id.trim().toUpperCase();
      const booking = await Booking.findOne({
        $or: [
          { bookingId: clean },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      });

      if (!booking) {
        sendError(res, 'Booking not found', 404, 'BOOKING_NOT_FOUND');
        return;
      }

      // Check ownership
      if (booking.userId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        sendError(res, 'You are not authorized to cancel this booking.', 403, 'FORBIDDEN');
        return;
      }

      if (booking.bookingStatus === 'cancelled') {
        sendError(res, 'This reservation is already cancelled.', 400, 'ALREADY_CANCELLED');
        return;
      }

      if (booking.bookingStatus === 'completed') {
        sendError(res, 'Completed journeys cannot be cancelled.', 400, 'CANNOT_CANCEL_COMPLETED');
        return;
      }

      // Calculate refund based on policy
      const { refundAmount, cancellationFee, policyTier } = pricingService.calculateRefund(booking);

      const formattedReason = customReason ? `${reason || 'Other'}: ${customReason}` : (reason || 'Change of plans');

      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';
      booking.refundStatus = 'initiated';
      booking.cancellation = {
        cancelledAt: new Date(),
        reason: formattedReason,
        cancellationFee,
        refundAmount,
        policyTier,
      };

      // Non-blocking cancellation email dispatch
      try {
        const recipientEmail = booking.primaryTraveller?.email || (req.user as any)?.email;
        if (recipientEmail) {
          await emailService.sendCancellationConfirmation(recipientEmail, {
            customerName: booking.primaryTraveller?.name || (req.user as any)?.name || 'Valued Traveller',
            bookingId: booking.bookingId,
            tripTitle: booking.tripSnapshot?.title || 'SukhYatri Journey',
            travelDate: booking.travelDate,
            cancellationDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            cancellationReason: formattedReason,
            refundAmount,
            refundStatus: 'Initiated (5–7 banking days via Razorpay)',
          });
          booking.cancellationEmailSentAt = new Date();
        }
      } catch (emailErr) {
        console.warn('[BookingController] Non-critical cancellation email failure:', emailErr);
      }

      await booking.save();

      sendSuccess(
        res,
        {
          booking,
          refundAmount,
          cancellationFee,
          policyTier,
        },
        200,
        'Booking cancelled successfully. Refund initiated.'
      );
    } catch (err: any) {
      sendError(res, err.message || 'Failed to cancel booking', 500);
    }
  },
};
