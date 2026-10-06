import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Repeat, Star, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/format';
import { Button } from '../ui/Button';
import { BookingStatusBadge } from './BookingStatusBadge';

export interface CompletedTripCardProps {
  booking: Booking;
  onWriteReview: (booking: Booking) => void;
}

export const CompletedTripCard: React.FC<CompletedTripCardProps> = ({
  booking,
  onWriteReview,
}) => {
  const navigate = useNavigate();

  const bookingRef = booking.bookingId || booking.id;
  const destinationText = booking.destination || booking.destName;

  // Derive package slug
  const tripSlug =
    booking.packageId === 'p1'
      ? 'kerala-backwaters-tea-hills'
      : booking.packageId === 'p3'
      ? 'rajasthan-royal-heritage-desert'
      : booking.packageId === 'p4'
      ? 'kashmir-paradise-valleys-lakes'
      : booking.packageId === 'p8'
      ? 'goa-heritage-beach-escape'
      : booking.packageId;

  return (
    <div className="bg-white rounded-3xl border border-stonewarm p-5 sm:p-6 shadow-xs hover:border-pine/30 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center">
      {/* Trip Thumbnail */}
      <img
        src={booking.packageImage}
        alt={booking.packageTitle}
        className="w-full sm:w-40 h-36 object-cover rounded-2xl shrink-0"
      />

      {/* Details */}
      <div className="flex-1 space-y-2 w-full">
        <div className="flex flex-wrap items-center gap-2">
          <BookingStatusBadge status="Completed" size="sm" />
          <span className="font-mono text-xs text-muted font-bold">
            {bookingRef}
          </span>
          <span className="text-muted">·</span>
          <span className="text-xs font-bold text-moss flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{destinationText}</span>
          </span>
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
          {booking.packageTitle}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-pine" /> Travelled: <b>{booking.travelDate}</b>
          </span>
          <span>·</span>
          <span>
            Total Fare: <b className="text-pine">{formatINR(booking.totalAmount)}</b>
          </span>
        </div>

        {/* Review feedback pill if already submitted */}
        {booking.reviewSubmitted && booking.review && (
          <div className="pt-1 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-xl w-fit border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-bold">{booking.review.rating} / 5 Stars:</span>
            <span className="truncate max-w-xs italic text-ink">"{booking.review.title}"</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-40 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stonewarm/60">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:w-full justify-center !rounded-xl text-xs font-bold"
          onClick={() => navigate(`/my-trips/${bookingRef}`)}
        >
          View Trip
        </Button>

        <Button
          variant="primary"
          size="sm"
          className="flex-1 sm:w-full justify-center !rounded-xl text-xs font-bold"
          onClick={() => navigate(`/trip/${tripSlug}`)}
          leftIcon={<Repeat className="w-3 h-3" />}
        >
          Book Again
        </Button>

        {!booking.reviewSubmitted && (
          <Button
            variant="soft"
            size="sm"
            className="flex-1 sm:w-full justify-center !rounded-xl text-xs font-bold text-moss hover:bg-mosslight"
            onClick={() => onWriteReview(booking)}
            leftIcon={<Star className="w-3 h-3" />}
          >
            Write Review
          </Button>
        )}
      </div>
    </div>
  );
};
