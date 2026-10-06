import React from 'react';
import { Calendar, Clock, Compass, Sparkles, Lightbulb } from 'lucide-react';
import { Destination } from '../../types';

export interface TravelInfoSectionProps {
  destination: Destination;
}

export const TravelInfoSection: React.FC<TravelInfoSectionProps> = ({ destination }) => {
  return (
    <section className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-8 shadow-card space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-1">
          Essential Guide
        </div>
        <h3 className="font-display text-2xl font-semibold text-ink">
          Travel Information &amp; Insights
        </h3>
      </div>

      {/* Grid of Key Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Best Time */}
        <div className="bg-cream2/70 rounded-2xl p-4 space-y-1.5 border border-stonewarm/60">
          <div className="flex items-center gap-2 text-pine font-bold text-xs">
            <Calendar className="w-4 h-4 text-moss" />
            <span>Best Time to Visit</span>
          </div>
          <div className="font-display font-semibold text-base text-ink">
            {destination.bestTimeToVisit || destination.bestTime}
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Pleasant weather and peak regional beauty.
          </p>
        </div>

        {/* 2. Ideal Duration */}
        <div className="bg-cream2/70 rounded-2xl p-4 space-y-1.5 border border-stonewarm/60">
          <div className="flex items-center gap-2 text-pine font-bold text-xs">
            <Clock className="w-4 h-4 text-moss" />
            <span>Ideal Duration</span>
          </div>
          <div className="font-display font-semibold text-base text-ink">
            {destination.recommendedDuration || destination.ideal}
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Unhurried pace to immerse without travel fatigue.
          </p>
        </div>

        {/* 3. Travel Style */}
        <div className="bg-cream2/70 rounded-2xl p-4 space-y-1.5 border border-stonewarm/60">
          <div className="flex items-center gap-2 text-pine font-bold text-xs">
            <Compass className="w-4 h-4 text-moss" />
            <span>Typical Travel Style</span>
          </div>
          <div className="font-display font-semibold text-base text-ink">
            {destination.travelStyle || 'Slow Travel & Comfort'}
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Curated boutique stays with private transit.
          </p>
        </div>
      </div>

      {/* Popular Activities & General Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Popular Activities */}
        {destination.popularActivities && destination.popularActivities.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sand" /> Popular Activities
            </h4>
            <ul className="space-y-2">
              {destination.popularActivities.map((act, i) => (
                <li key={i} className="text-xs font-semibold text-[#3A4542] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-moss" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* General Tips */}
        {destination.generalTravelTips && destination.generalTravelTips.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-ink flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-sand" /> Regional Travel Tips
            </h4>
            <ul className="space-y-2">
              {destination.generalTravelTips.map((tip, i) => (
                <li key={i} className="text-xs text-[#3A4542] leading-relaxed flex items-start gap-2">
                  <span className="text-moss font-bold">●</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
