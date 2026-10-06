import React from 'react';
import { Calendar, MapPin, Clock, Users, BedDouble, Car, ShieldCheck } from 'lucide-react';
import { Booking } from '../../types';

export interface JourneyDetailsProps {
  booking: Booking;
}

export const JourneyDetails: React.FC<JourneyDetailsProps> = ({ booking }) => {
  const startDate = new Date(booking.travelDate);

  // Calculate end date based on duration (e.g., "5N / 6D" -> 5 nights / 6 days)
  const calculateEndDate = (): Date => {
    if (booking.endDate) {
      return new Date(booking.endDate);
    }
    let daysToAdd = 4; // default
    if (booking.duration) {
      const match = booking.duration.match(/(\d+)D/i) || booking.duration.match(/(\d+)N/i);
      if (match && match[1]) {
        daysToAdd = Math.max(1, parseInt(match[1], 10) - 1);
      }
    }
    const end = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return end;
  };

  const calculatedEndDate = calculateEndDate();

  const formattedStart = startDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedEnd = calculatedEndDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-3xl border border-sand-dark/25 p-6 sm:p-7 shadow-card space-y-5">
      <div className="flex items-center justify-between border-b border-sand-dark/20 pb-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink">Journey Details</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Confirmed schedule and on-ground logistics
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/60 text-pine border border-sand-dark/30">
          Chauffeur-Driven Private Tour
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Start Date */}
        <div className="p-4 rounded-2xl bg-cream/40 border border-sand-dark/20">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Calendar className="w-4 h-4 text-pine" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Departure Date</span>
          </div>
          <p className="font-display font-bold text-base text-ink">{formattedStart}</p>
          <p className="text-stone-500 text-[11px] mt-0.5">
            {booking.slot || 'Morning Pickup (09:00 AM)'}
          </p>
        </div>

        {/* End Date */}
        <div className="p-4 rounded-2xl bg-cream/40 border border-sand-dark/20">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Calendar className="w-4 h-4 text-pine" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Conclusion Date</span>
          </div>
          <p className="font-display font-bold text-base text-ink">{formattedEnd}</p>
          <p className="text-stone-500 text-[11px] mt-0.5">Evening Drop-off at Airport/Station</p>
        </div>

        {/* Duration */}
        <div className="p-4 rounded-2xl bg-cream/40 border border-sand-dark/20">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Clock className="w-4 h-4 text-pine" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Duration</span>
          </div>
          <p className="font-display font-bold text-base text-ink">{booking.duration || '5N / 6D'}</p>
          <p className="text-stone-500 text-[11px] mt-0.5">Relaxed, unhurried pace</p>
        </div>

        {/* Destination */}
        <div className="p-4 rounded-2xl bg-cream/40 border border-sand-dark/20">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <MapPin className="w-4 h-4 text-pine" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Destination Hub</span>
          </div>
          <p className="font-display font-bold text-base text-ink">
            {booking.destination || booking.destName || 'India'}
          </p>
          <p className="text-stone-500 text-[11px] mt-0.5">Curated Local Experiences Included</p>
        </div>

        {/* Travellers Count */}
        <div className="p-4 rounded-2xl bg-cream/40 border border-sand-dark/20">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Users className="w-4 h-4 text-pine" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Yatri Count</span>
          </div>
          <p className="font-display font-bold text-base text-ink">
            {booking.travellers} {booking.travellers === 1 ? 'Guest' : 'Guests'}
          </p>
          <p className="text-stone-500 text-[11px] mt-0.5">
            {booking.adults || booking.travellers} Adults
            {booking.children ? `, ${booking.children} Children` : ''}
          </p>
        </div>

        {/* Room & Hospitality */}
        <div className="p-4 rounded-2xl bg-cream/40 border border-sand-dark/20">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <BedDouble className="w-4 h-4 text-pine" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Accommodation</span>
          </div>
          <p className="font-display font-bold text-base text-ink">
            {booking.roomCategory || 'Boutique Deluxe'}
          </p>
          <p className="text-stone-500 text-[11px] mt-0.5">
            {booking.rooms || 1} Private Room(s) · Daily Breakfast
          </p>
        </div>
      </div>

      {/* Comfort Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-sand/30 border border-sand-dark/30 flex items-center gap-3 text-xs text-stone-700">
        <Car className="w-4 h-4 text-pine shrink-0" />
        <div className="flex-1">
          <strong className="text-ink">Dedicated Private AC Vehicle & Chauffeur:</strong> Complimentary pickup and drop-off from designated junction included in your booking voucher.
        </div>
      </div>
    </div>
  );
};
