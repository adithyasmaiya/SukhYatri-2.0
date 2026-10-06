import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, ArrowRight, Download, HelpCircle, MapPin } from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/format';
import { Button } from '../ui/Button';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { TripCountdown } from './TripCountdown';

export interface UpcomingTripCardProps {
  booking: Booking;
  onDownloadInvoice: (booking: Booking) => void;
}

export const UpcomingTripCard: React.FC<UpcomingTripCardProps> = ({
  booking,
  onDownloadInvoice,
}) => {
  const navigate = useNavigate();

  const bookingRef = booking.bookingId || booking.id;
  const destinationText = booking.destination || booking.destName;
  const durationText = booking.duration || 'Curated Circuit';

  return (
    <div className="bg-white rounded-3xl border border-stonewarm/90 p-5 sm:p-6 shadow-card hover:shadow-lift transition-all duration-300 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
      {/* Trip Visual Media */}
      <div className="relative w-full lg:w-64 h-48 sm:h-52 lg:h-44 rounded-2xl overflow-hidden shrink-0 group">
        <img
          src={booking.packageImage}
          alt={booking.packageTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top Destination Pill */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur-md text-pine font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 text-moss" />
            <span>{destinationText}</span>
          </span>
        </div>

        {/* Bottom Booking ID Tag */}
        <div className="absolute bottom-3 left-3 text-white">
          <span className="font-mono text-xs font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
            {bookingRef}
          </span>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="flex-1 space-y-3 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>

          <TripCountdown travelDate={booking.travelDate} />
        </div>

        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink leading-snug">
            {booking.packageTitle}
          </h3>
        </div>

        {/* Metas Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-muted font-medium">
          <div className="flex items-center gap-1.5 text-ink">
            <Calendar className="w-4 h-4 text-pine shrink-0" />
            <span className="truncate">Departure: <b>{booking.travelDate}</b></span>
          </div>

          <div className="flex items-center gap-1.5 text-ink">
            <Clock className="w-4 h-4 text-pine shrink-0" />
            <span>Duration: <b>{durationText}</b></span>
          </div>

          <div className="flex items-center gap-1.5 text-ink col-span-2 sm:col-span-1">
            <Users className="w-4 h-4 text-pine shrink-0" />
            <span>
              Travellers: <b>{booking.travellers} {booking.travellers === 1 ? 'Guest' : 'Guests'}</b>
            </span>
          </div>
        </div>

        {/* Price Sub-row */}
        <div className="pt-2 border-t border-stonewarm/60 flex items-baseline justify-between text-xs">
          <span className="text-muted font-medium">Amount Paid:</span>
          <span className="font-display text-lg font-bold text-pine">
            {formatINR(booking.totalAmount)}
          </span>
        </div>
      </div>

      {/* Action Buttons Column */}
      <div className="flex flex-row lg:flex-col gap-2.5 w-full lg:w-48 shrink-0 justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-stonewarm/60">
        <Button
          variant="primary"
          size="md"
          className="flex-1 lg:w-full justify-center !rounded-2xl font-bold text-xs"
          onClick={() => navigate(`/my-trips/${bookingRef}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Booking
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 lg:w-full justify-center !rounded-2xl font-bold text-xs text-ink"
          onClick={() => onDownloadInvoice(booking)}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Invoice
        </Button>

        <Button
          variant="soft"
          size="sm"
          className="hidden sm:inline-flex lg:w-full justify-center !rounded-2xl text-xs font-semibold text-muted hover:text-pine"
          onClick={() => navigate('/contact')}
          leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
        >
          Get Help
        </Button>
      </div>
    </div>
  );
};
