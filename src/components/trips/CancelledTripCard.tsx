import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, ArrowRight, RotateCcw, AlertCircle, IndianRupee } from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/format';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { bookingService } from '../../services/bookingService';

export interface CancelledTripCardProps {
  booking: Booking;
}

export const CancelledTripCard: React.FC<CancelledTripCardProps> = ({ booking }) => {
  const navigate = useNavigate();
  const pkg = bookingService.getPackageForBooking(booking);

  const destination = booking.destination || booking.destName || 'India';
  const displayImage =
    booking.packageImage ||
    pkg?.gallery?.[0] ||
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop';

  const cancellationDateFormatted = booking.cancelledAt
    ? new Date(booking.cancelledAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  const originalTravelDateFormatted = booking.travelDate
    ? new Date(booking.travelDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Flexible';

  // Refund status mapping
  const refundStatusLabel = (() => {
    switch (booking.refundStatus) {
      case 'refunded':
        return 'Refund Completed';
      case 'processing':
        return 'Refund Processing';
      case 'initiated':
        return 'Refund Initiated (3–5 working days)';
      case 'not_applicable':
        return 'Not Applicable';
      default:
        return 'Refund Processing';
    }
  })();

  const refundAmount = booking.cancellationRefundAmount ?? Math.round(booking.totalAmount * 0.85);

  const handleBookAgain = () => {
    if (pkg?.slug) {
      navigate(`/trip/${pkg.slug}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <article className="group bg-white rounded-3xl border border-sand-dark/25 p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Left: Destination thumbnail */}
        <div className="relative w-full lg:w-56 h-48 lg:h-auto rounded-2xl overflow-hidden shrink-0 bg-sand/30 grayscale-[25%] opacity-90">
          <img
            src={displayImage}
            alt={booking.packageTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-200 backdrop-blur-md border border-rose-500/30">
              Cancelled
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1.5 text-xs text-sand font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination}</span>
            </div>
            <div className="text-sm font-semibold truncate mt-0.5">
              {booking.duration || 'Curated Journey'}
            </div>
          </div>
        </div>

        {/* Center: Details & Cancellation Metas */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-sand/40 text-ink/75 border border-sand-dark/30">
                  {booking.bookingId || booking.id}
                </span>
                <BookingStatusBadge status="cancelled" />
                <PaymentStatusBadge status="refunded" />
              </div>
              <span className="text-xs text-stone-500">
                Cancelled on: <strong className="text-stone-700">{cancellationDateFormatted}</strong>
              </span>
            </div>

            <h3 className="font-display font-semibold text-lg md:text-xl text-ink mt-2 leading-tight">
              {booking.packageTitle}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3.5 pt-3 border-t border-sand-dark/20 text-xs">
              <div>
                <span className="text-stone-500 block">Original Departure</span>
                <span className="font-medium text-ink flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-pine" />
                  {originalTravelDateFormatted}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Travellers</span>
                <span className="font-medium text-ink flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-pine" />
                  {booking.travellers} {booking.travellers === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Original Total Paid</span>
                <span className="font-medium text-ink flex items-center gap-1 mt-0.5">
                  {formatINR(booking.totalAmount)}
                </span>
              </div>
            </div>

            {/* Refund Status Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-amber-900">
                    Refund Status: <span className="font-normal text-amber-800">{refundStatusLabel}</span>
                  </div>
                  {booking.cancellationReason && (
                    <div className="text-[11px] text-amber-800/80 mt-0.5 line-clamp-1">
                      Reason: {booking.cancellationReason}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:text-right shrink-0">
                <span className="text-[11px] text-amber-800 block">Refund Amount</span>
                <span className="font-display font-bold text-sm text-amber-950">
                  {formatINR(refundAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sand-dark/20">
            <Link
              to={`/my-trips/${booking.bookingId || booking.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-pine hover:text-pinedark transition-colors"
            >
              <span>View Booking Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleBookAgain}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand/60 hover:bg-sand text-ink transition-colors border border-sand-dark/30"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pine" />
              <span>Book Again</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
