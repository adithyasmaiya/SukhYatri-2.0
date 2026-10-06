import React, { useState } from 'react';
import { Clock, MapPin, Users, Calendar, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { TripPackage } from '../../types';
import { formatINR } from '../../utils/format';
import { PriceBreakdown } from './PriceBreakdown';
import { Badge } from '../ui/Badge';

export interface TripBookingSummaryProps {
  trip: TripPackage;
  travelDate: string;
  adults: number;
  childrenCount: number;
  totalTravellers: number;
  baseAmount: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  totalAmount: number;
}

export const TripBookingSummary: React.FC<TripBookingSummaryProps> = ({
  trip,
  travelDate,
  adults,
  childrenCount,
  totalTravellers,
  baseAmount,
  discountAmount,
  couponCode,
  taxAmount,
  totalAmount,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const destinationText = trip.destination || trip.destName;
  const durationText = trip.duration || `${trip.nights}N / ${trip.days}D`;

  return (
    <aside className="lg:sticky lg:top-24 space-y-4">
      {/* Mobile Accordion Header */}
      <div className="lg:hidden bg-white border border-stonewarm rounded-2xl p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <img
              src={trip.image}
              alt={trip.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div>
              <div className="text-xs font-bold text-ink truncate max-w-[190px]">
                {trip.title}
              </div>
              <div className="font-extrabold text-sm text-pine mt-0.5">
                {formatINR(totalAmount)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-pine">
            <span>{mobileExpanded ? 'Hide' : 'Details'}</span>
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {mobileExpanded && (
          <div className="pt-4 mt-3 border-t border-stonewarm/60 space-y-3">
            <PriceBreakdown
              pricePerPerson={trip.price}
              travellers={totalTravellers}
              baseAmount={baseAmount}
              discountAmount={discountAmount}
              couponCode={couponCode}
              taxAmount={taxAmount}
              totalAmount={totalAmount}
              compact
            />
          </div>
        )}
      </div>

      {/* Desktop Main Card */}
      <div className="hidden lg:block bg-white rounded-3xl border border-stonewarm p-6 shadow-card space-y-5">
        <div className="flex gap-4 pb-4 border-b border-stonewarm/70">
          <img
            src={trip.image}
            alt={trip.title}
            className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm"
          />
          <div className="space-y-1">
            <Badge variant="mosslight" size="sm">
              {destinationText}
            </Badge>
            <h3 className="font-display font-bold text-sm text-ink leading-snug line-clamp-2">
              {trip.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted font-semibold pt-0.5">
              <span>★ {trip.rating}</span>
              <span>·</span>
              <span>{durationText}</span>
            </div>
          </div>
        </div>

        {/* Selected Metas */}
        <div className="bg-cream2/60 rounded-2xl p-4 border border-stonewarm/50 space-y-2 text-xs">
          <div className="flex items-center justify-between text-ink">
            <span className="text-muted flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-pine" /> Departure
            </span>
            <span className="font-bold">{travelDate}</span>
          </div>

          <div className="flex items-center justify-between text-ink">
            <span className="text-muted flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-pine" /> Party Size
            </span>
            <span className="font-bold">
              {totalTravellers} Guests ({adults}A{childrenCount > 0 ? `, ${childrenCount}C` : ''})
            </span>
          </div>

          <div className="flex items-center justify-between text-ink">
            <span className="text-muted flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-pine" /> Duration
            </span>
            <span className="font-bold">{durationText}</span>
          </div>
        </div>

        {/* Detailed Price Breakdown */}
        <PriceBreakdown
          pricePerPerson={trip.price}
          travellers={totalTravellers}
          baseAmount={baseAmount}
          discountAmount={discountAmount}
          couponCode={couponCode}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
        />

        {/* Trust Note */}
        <div className="bg-mosslight/40 border border-moss/15 rounded-2xl p-3.5 text-xs text-pine space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-moss" />
            <span>SukhYatri Assurance</span>
          </div>
          <p className="text-[11px] text-pine/80 leading-relaxed font-medium">
            100% free cancellation within 48 hours of booking. Handpicked 4★+ verified stay and private vehicle throughout.
          </p>
        </div>
      </div>
    </aside>
  );
};
