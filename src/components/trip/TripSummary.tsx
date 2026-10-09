import React from 'react';
import { Clock, MapPin, Compass, Calendar, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { TripPackage } from '../../types';

export interface TripSummaryProps {
  trip: TripPackage;
}

export const TripSummary: React.FC<TripSummaryProps> = ({ trip }) => {
  const destinationName = trip.destination || trip.destName;
  const durationText = trip.duration || `${trip.nights}N / ${trip.days}D`;
  const travelStyleText = Array.isArray(trip.travelStyle)
    ? trip.travelStyle.join(', ')
    : trip.travelStyle || 'Slow Comfort';

  return (
    <section className="space-y-8">
      {/* Description */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-3">
          About This Journey
        </h2>
        <p className="text-[#3A4542] text-sm sm:text-base leading-relaxed">
          {trip.description || trip.desc}
        </p>
      </div>

      {/* 4 Feature Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-stonewarm rounded-2xl p-4 text-center shadow-sm space-y-1">
          <Clock className="w-5 h-5 text-moss mx-auto mb-1.5" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Duration</div>
          <div className="font-extrabold text-sm text-ink">{durationText}</div>
        </div>

        <div className="bg-white border border-stonewarm rounded-2xl p-4 text-center shadow-sm space-y-1">
          <MapPin className="w-5 h-5 text-moss mx-auto mb-1.5" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Destination</div>
          <div className="font-extrabold text-sm text-ink">{destinationName}</div>
        </div>

        <div className="bg-white border border-stonewarm rounded-2xl p-4 text-center shadow-sm space-y-1">
          <Compass className="w-5 h-5 text-moss mx-auto mb-1.5" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Travel Style</div>
          <div className="font-extrabold text-sm text-ink truncate">{travelStyleText}</div>
        </div>

        <div className="bg-white border border-stonewarm rounded-2xl p-4 text-center shadow-sm space-y-1">
          <Calendar className="w-5 h-5 text-moss mx-auto mb-1.5" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Best Time</div>
          <div className="font-extrabold text-sm text-ink">{trip.bestTime || 'Oct – May'}</div>
        </div>
      </div>

      {/* Highlights Checklist */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-sand" />
          <h3 className="font-display text-xl font-semibold text-ink">Trip Highlights</h3>
        </div>

        <div className="space-y-3">
          {(trip.highlights || []).map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 bg-white border border-stonewarm rounded-2xl p-4 shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-pine text-sand flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-sm font-semibold text-ink leading-snug">{h}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
