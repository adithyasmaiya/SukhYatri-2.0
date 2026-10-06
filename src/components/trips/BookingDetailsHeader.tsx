import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Download } from 'lucide-react';
import { Booking } from '../../types';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { bookingService } from '../../services/bookingService';

export interface BookingDetailsHeaderProps {
  booking: Booking;
  onOpenInvoice?: () => void;
}

export const BookingDetailsHeader: React.FC<BookingDetailsHeaderProps> = ({
  booking,
  onOpenInvoice,
}) => {
  const pkg = bookingService.getPackageForBooking(booking);
  const destination = booking.destination || booking.destName || 'India';
  const displayImage =
    booking.packageImage ||
    pkg?.gallery?.[0] ||
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop';

  const travelDateFormatted = booking.travelDate
    ? new Date(booking.travelDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Flexible departure';

  return (
    <div className="space-y-4">
      {/* Navigation Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/my-trips"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-pine transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to My Trips</span>
        </Link>

        {onOpenInvoice && (
          <button
            onClick={onOpenInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sand/60 hover:bg-sand text-ink transition-colors border border-sand-dark/30"
          >
            <Download className="w-3.5 h-3.5 text-pine" />
            <span>Download Invoice</span>
          </button>
        )}
      </div>

      {/* Hero Booking Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-card border border-sand-dark/25 bg-pinedark text-white">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={displayImage}
            alt={booking.packageTitle}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pinedark via-pinedark/80 to-pinedark/40" />
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          {/* Top Info Bar: Ref + Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-white/15 text-sand backdrop-blur-md border border-white/20">
                {booking.bookingId || booking.id}
              </span>
              {booking.paymentId && (
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-white/90 backdrop-blur-md border border-white/15" title="Verified Payment ID">
                  {booking.paymentId}
                </span>
              )}
              <BookingStatusBadge status={booking.bookingStatus || booking.status} />
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>

            <span className="text-xs text-white/70">
              Booked on{' '}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recently'}
            </span>
          </div>

          {/* Main Title & Destination */}
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs text-sand font-medium uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
              {booking.packageTitle}
            </h1>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15 text-xs">
            <div>
              <span className="text-white/60 block text-[11px]">Travel Date</span>
              <span className="font-medium text-white flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-sand" />
                {travelDateFormatted}
              </span>
            </div>

            <div>
              <span className="text-white/60 block text-[11px]">Duration</span>
              <span className="font-medium text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-sand" />
                {booking.duration || pkg?.duration || '5N / 6D'}
              </span>
            </div>

            <div>
              <span className="text-white/60 block text-[11px]">Travellers</span>
              <span className="font-medium text-white flex items-center gap-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5 text-sand" />
                {booking.travellers} {booking.travellers === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>

            <div>
              <span className="text-white/60 block text-[11px]">Accommodation Tier</span>
              <span className="font-medium text-sand mt-0.5 block truncate">
                {booking.roomCategory || 'Boutique Heritage'} ({booking.rooms || 1} Room)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
