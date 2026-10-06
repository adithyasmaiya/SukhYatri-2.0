import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { TripPackage } from '../../types';
import { TripCard } from '../travel/TripCard';

export interface RelatedTripsProps {
  currentTripId: string;
  destination: string;
  allTrips: TripPackage[];
}

export const RelatedTrips: React.FC<RelatedTripsProps> = ({
  currentTripId,
  destination,
  allTrips,
}) => {
  // Find 3-4 related trips:
  // 1. Same destination (excluding current trip)
  // 2. Same region/popular trips if not enough
  const otherTrips = allTrips.filter((t) => t.id !== currentTripId);
  const sameDest = otherTrips.filter(
    (t) =>
      t.destination.toLowerCase() === destination.toLowerCase() ||
      t.destName?.toLowerCase() === destination.toLowerCase()
  );

  let recommendations = [...sameDest];
  if (recommendations.length < 3) {
    const others = otherTrips.filter((t) => !recommendations.some((r) => r.id === t.id));
    recommendations = [...recommendations, ...others];
  }

  const finalTrips = recommendations.slice(0, 3);

  if (finalTrips.length === 0) return null;

  return (
    <section className="space-y-6 pt-10 border-t border-stonewarm/80">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-pine" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-muted">
              More Handpicked Journeys
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            You May Also Like
          </h2>
        </div>

        <Link
          to={`/explore?destination=${encodeURIComponent(destination)}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-pine hover:text-moss transition group"
        >
          <span>View all {destination} trips</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
};
