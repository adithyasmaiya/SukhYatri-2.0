import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { PACKAGES } from '../../data/packages';
import { TripCard } from '../travel/TripCard';
import { Button } from '../ui/Button';

export const TrendingTripsSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string>('All');

  const themes = ['All', 'Slow & Relaxed', 'Honeymoon', 'Heritage & Culture', 'Adventure'];

  const filteredTrips =
    selectedTheme === 'All'
      ? PACKAGES.slice(0, 6)
      : PACKAGES.filter((p) => p.themes.includes(selectedTheme as any)).slice(0, 6);

  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
            02 — Trending Now
          </div>
          <h2 className="font-display text-3xl lg:text-[44px] font-semibold tracking-tight text-ink">
            Trips travellers
            <br />
            can't stop booking
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/explore')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Explore all {PACKAGES.length} trips
        </Button>
      </div>

      <p className="text-muted text-xs lg:text-sm mb-6 max-w-xl leading-relaxed">
        Real live availability, honest pricing, and small groups. These handpicked routes are
        experiencing the highest guest love for the upcoming season.
      </p>

      {/* Theme Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
        {themes.map((theme) => {
          const isActive = selectedTheme === theme;
          return (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all shrink-0 ${
                isActive
                  ? 'bg-pine text-white border-pine shadow-sm'
                  : 'bg-white text-ink border-stonewarm hover:border-pine'
              }`}
            >
              {theme}
            </button>
          );
        })}
      </div>

      {/* Grid of Trip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
};
