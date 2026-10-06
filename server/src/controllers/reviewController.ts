import { Response } from 'express';
import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { Trip } from '../models/Trip.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const reviewController = {
  async createReview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const { bookingId, rating, title, comment } = req.body;

      if (!bookingId || !rating || !title || !comment) {
        sendError(res, 'Booking ID, rating, title, and review comment are required', 400);
        return;
      }

      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        sendError(res, 'Rating must be an integer between 1 and 5 stars', 400);
        return;
      }

      // Find booking by human-readable bookingId or ObjectId
      const cleanRef = bookingId.trim().toUpperCase();
      const booking = await Booking.findOne({
        $or: [{ bookingId: cleanRef }, { _id: bookingId.match(/^[0-9a-fA-F]{24}$/) ? bookingId : null }],
      });

      if (!booking) {
        sendError(res, 'Booking reservation not found', 404, 'BOOKING_NOT_FOUND');
        return;
      }

      // Check user ownership
      if (booking.userId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        sendError(res, 'You can only review bookings associated with your account', 403, 'FORBIDDEN');
        return;
      }

      // Review eligibility: Only completed trips
      if (booking.bookingStatus !== 'completed') {
        sendError(
          res,
          'Reviews are only eligible for successfully completed journeys.',
          400,
          'INELIGIBLE_FOR_REVIEW'
        );
        return;
      }

      if (booking.reviewSubmitted) {
        sendError(res, 'A review has already been submitted for this journey reservation.', 400, 'ALREADY_REVIEWED');
        return;
      }

      // Sanitize input against stored XSS and enforce length boundaries
      const cleanTitle = String(title).replace(/<[^>]*>?/gm, '').trim().slice(0, 150);
      const cleanComment = String(comment).replace(/<[^>]*>?/gm, '').trim().slice(0, 2000);

      if (!cleanTitle || !cleanComment) {
        sendError(res, 'Valid title and comment are required', 400);
        return;
      }

      const review = await Review.create({
        userId: req.user.id,
        userName: req.user.name,
        userAvatar: req.user.avatar || '',
        tripId: booking.tripId || booking.tripSnapshot?.id,
        tripTitle: booking.tripSnapshot?.title || '',
        bookingId: booking.bookingId,
        rating: numRating,
        title: cleanTitle,
        comment: cleanComment,
        isPublished: true,
      });

      // Update booking
      booking.reviewSubmitted = true;
      booking.review = {
        rating: numRating,
        title: cleanTitle,
        comment: cleanComment,
        createdAt: new Date().toISOString().split('T')[0],
      };
      await booking.save();

      // Update Trip aggregated rating if linked
      if (booking.tripId) {
        const tripReviews = await Review.find({ tripId: booking.tripId, isPublished: true });
        const avg = tripReviews.reduce((sum, r) => sum + r.rating, 0) / tripReviews.length;
        await Trip.findByIdAndUpdate(booking.tripId, {
          rating: Math.round(avg * 10) / 10,
          reviewCount: tripReviews.length,
        });
      }

      sendSuccess(res, { review, booking }, 201, 'Thank you! Your travel review has been submitted.');
    } catch (err: any) {
      sendError(res, err.message || 'Failed to submit review', 500);
    }
  },

  async getReviewsForTrip(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      const reviews = await Review.find({ tripId, isPublished: true }).sort({ createdAt: -1 });
      sendSuccess(res, reviews);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch reviews', 500);
    }
  },
};
