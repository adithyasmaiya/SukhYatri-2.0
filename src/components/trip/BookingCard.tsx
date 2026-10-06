import React from 'react';
import { Calendar, Users, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { TripPackage } from '../../types';
import { formatINR, calculateDiscount } from '../../utils/format';
import { Button } from '../ui/Button';
import { PriceCalculator } from './PriceCalculator';

export interface BookingCardProps {
  trip: TripPackage;
  departureDate: string;
  onDateChange: (date: string) => void;
  travellers: number;
  onTravellersChange: (count: number) => void;
  onBookNow: () => void;
  onOpenConcierge?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  trip,
  departureDate,
  onDateChange,
  travellers,
  onTravellersChange,
  onBookNow,
  onOpenConcierge,
}) => {
  const discountPercent = calculateDiscount(trip.price, trip.mrp || trip.originalPrice || trip.price);
  const originalPrice = trip.mrp || trip.originalPrice || trip.price;
  const reviewCount = trip.reviewCount || trip.reviewsCount || 42;

  // Next available date placeholder (default 7 days from now if needed)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <aside className="sticky top-24 hidden lg:block">
      <div className="bg-white rounded-3xl border border-stonewarm p-6 shadow-lift space-y-5">
        {/* Price Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stonewarm/80">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">
              Starting from
            </div>
            {originalPrice > trip.price && (
              <div className="flex items-center gap-1.5 text-xs text-muted font-semibold mt-0.5">
                <span className="line-through">{formatINR(originalPrice)}</span>
                <span className="text-clay font-bold">· {discountPercent}% OFF</span>
              </div>
            )}
            <div className="font-display text-3xl font-bold text-ink mt-0.5">
              {formatINR(trip.price)}
              <span className="text-xs font-normal text-muted font-sans ml-1">/ person</span>
            </div>
            <div className="text-[11px] text-muted font-medium mt-0.5">
              Twin-sharing basis · All taxes incl.
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 bg-mosslight text-pine px-2.5 py-1 rounded-full text-xs font-extrabold">
              <span>★</span> {trip.rating}
            </div>
            <div className="text-[11px] text-muted mt-1 font-medium">
              {reviewCount} verified reviews
            </div>
          </div>
        </div>

        {/* Date and Travellers Selectors */}
        <div className="bg-cream2/60 rounded-2xl p-4 border border-stonewarm/50 space-y-3.5">
          <div>
            <label
              htmlFor="booking-date"
              className="block text-[10.5px] font-bold uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-pine" />
              <span>Select Departure Date</span>
            </label>
            <input
              id="booking-date"
              type="date"
              value={departureDate}
              min={minDateStr}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-white border border-stonewarm rounded-xl px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-pine/30 cursor-pointer shadow-xs"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-pine" />
              <span>Number of Travellers</span>
            </label>
            <div className="flex items-center justify-between bg-white border border-stonewarm rounded-xl px-3.5 py-2 shadow-xs">
              <button
                type="button"
                onClick={() => onTravellersChange(Math.max(1, travellers - 1))}
                aria-label="Decrease travellers"
                className="w-7 h-7 rounded-full bg-cream2 hover:bg-stonewarm/80 flex items-center justify-center font-bold text-ink transition active:scale-95 disabled:opacity-40"
                disabled={travellers <= 1}
              >
                −
              </button>
              <span className="font-bold text-xs text-ink">
                {travellers} {travellers === 1 ? 'Adult' : 'Adults'}
              </span>
              <button
                type="button"
                onClick={() => onTravellersChange(Math.min(12, travellers + 1))}
                aria-label="Increase travellers"
                className="w-7 h-7 rounded-full bg-pine text-white hover:bg-pine/90 flex items-center justify-center font-bold transition active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Live Calculation */}
        <PriceCalculator
          pricePerPerson={trip.price}
          originalPricePerPerson={originalPrice}
          discountPercent={discountPercent}
          travellers={travellers}
        />

        {/* Real-time availability indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-moss bg-mosslight/40 py-2 px-3 rounded-xl border border-moss/15">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Instant Confirmation · 4 spots left for this date</span>
        </div>

        {/* Primary CTA */}
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center group font-bold tracking-wide shadow-md"
          onClick={onBookNow}
        >
          <span>Book This Trip</span>
          <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {onOpenConcierge && (
          <Button
            variant="outline"
            size="md"
            className="w-full justify-center text-xs font-semibold"
            onClick={onOpenConcierge}
          >
            Customize Itinerary with Concierge
          </Button>
        )}

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10.5px] font-bold text-muted pt-2 border-t border-stonewarm/50">
          <div className="bg-cream2/60 rounded-xl py-2 px-1 border border-stonewarm/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-moss mx-auto mb-1" />
            <span>Free Cancel</span>
            <div className="text-[9.5px] text-muted/80 font-normal">Within 48h</div>
          </div>
          <div className="bg-cream2/60 rounded-xl py-2 px-1 border border-stonewarm/30">
            <ShieldCheck className="w-3.5 h-3.5 text-moss mx-auto mb-1" />
            <span>0% EMI</span>
            <div className="text-[9.5px] text-muted/80 font-normal">Available</div>
          </div>
          <div className="bg-cream2/60 rounded-xl py-2 px-1 border border-stonewarm/30">
            <Sparkles className="w-3.5 h-3.5 text-moss mx-auto mb-1" />
            <span>Pay Token</span>
            <div className="text-[9.5px] text-muted/80 font-normal">₹5,000 to hold</div>
          </div>
        </div>

        {/* Mini Concierge Support */}
        {onOpenConcierge && (
          <div className="pt-3 border-t border-stonewarm/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pine text-sand flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              SY
            </div>
            <div className="text-xs">
              <div className="font-bold text-ink">Need custom hotels or dates?</div>
              <div className="text-moss font-semibold flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3" /> Expert designer online
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenConcierge}
              className="ml-auto text-xs font-bold text-pine hover:text-moss underline decoration-pine/40 hover:decoration-moss transition"
            >
              Chat
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
