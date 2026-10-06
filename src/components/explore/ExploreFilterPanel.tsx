import React, { useState } from 'react';
import { RotateCcw, Check, ChevronDown, ChevronUp, Star, Sparkles } from 'lucide-react';
import { TravelStyle, DurationFilter } from '../../types';
import { formatINR } from '../../utils/format';

export const ALL_DESTINATIONS = [
  'Goa',
  'Kerala',
  'Kashmir',
  'Coorg',
  'Manali',
  'Jaipur',
  'Udaipur',
  'Rishikesh',
  'Munnar',
  'Ooty',
  'Andaman',
  'Meghalaya',
  'Ladakh',
  'Varanasi',
  'Spiti',
];

export const TRAVEL_STYLES: TravelStyle[] = [
  'Adventure',
  'Relaxation',
  'Family',
  'Romantic',
  'Cultural',
  'Luxury',
  'Nature',
];

export const DURATION_OPTIONS: { id: DurationFilter; label: string }[] = [
  { id: '1-3', label: '1–3 days' },
  { id: '4-6', label: '4–6 days' },
  { id: '7-10', label: '7–10 days' },
  { id: '10+', label: '10+ days' },
];

export const RATING_OPTIONS = [
  { val: 4.5, label: '4.5+ Exceptional' },
  { val: 4.0, label: '4.0+ Highly Rated' },
  { val: 3.5, label: '3.5+ Good Value' },
];

export interface ExploreFilterPanelProps {
  selectedDestinations: string[];
  onDestinationToggle: (dest: string) => void;
  maxPrice: number;
  onPriceChange: (val: number) => void;
  selectedDuration: DurationFilter;
  onDurationChange: (dur: DurationFilter) => void;
  selectedStyles: TravelStyle[];
  onStyleToggle: (style: TravelStyle) => void;
  minRating: number;
  onRatingChange: (val: number) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const ExploreFilterPanel: React.FC<ExploreFilterPanelProps> = ({
  selectedDestinations,
  onDestinationToggle,
  maxPrice,
  onPriceChange,
  selectedDuration,
  onDurationChange,
  selectedStyles,
  onStyleToggle,
  minRating,
  onRatingChange,
  onClearFilters,
  activeFiltersCount,
}) => {
  const [destinationsExpanded, setDestinationsExpanded] = useState(false);

  const displayedDestinations = destinationsExpanded
    ? ALL_DESTINATIONS
    : ALL_DESTINATIONS.slice(0, 6);

  return (
    <div className="space-y-6 text-ink">
      {/* Filter Header with Active Count & Clear All */}
      <div className="flex items-center justify-between pb-4 border-b border-stonewarm">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-base text-ink">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-extrabold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-bold text-moss hover:text-pine hover:underline flex items-center gap-1 transition-colors"
            aria-label="Clear all filters"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* 1. Destination Multi-Select */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Destination
          </label>
          {selectedDestinations.length > 0 && (
            <span className="text-[11px] font-bold text-moss">
              {selectedDestinations.length} selected
            </span>
          )}
        </div>
        <div className="space-y-2">
          {displayedDestinations.map((dest) => {
            const isChecked = selectedDestinations.includes(dest);
            return (
              <label
                key={dest}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-cream2/60 cursor-pointer transition select-none group text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-pine border-pine text-white'
                        : 'border-stonewarm bg-white group-hover:border-pine'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={isChecked ? 'font-bold text-pine' : 'text-ink/90'}>
                    {dest}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {ALL_DESTINATIONS.length > 6 && (
          <button
            type="button"
            onClick={() => setDestinationsExpanded(!destinationsExpanded)}
            className="mt-2 text-xs font-bold text-moss hover:text-pine flex items-center gap-1 px-2 py-1"
          >
            {destinationsExpanded ? (
              <>
                Show less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show all {ALL_DESTINATIONS.length} destinations{' '}
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. Price Range Slider */}
      <div className="pt-2 border-t border-stonewarm/60">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Max Price / Person
          </label>
          <span className="text-xs font-extrabold text-pine">
            {maxPrice >= 100000 ? '₹1,00,000+' : formatINR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="100000"
          step="2500"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-pine cursor-pointer h-2 bg-cream2 rounded-lg"
          aria-label="Price range filter"
        />
        <div className="flex justify-between text-[11px] font-bold text-muted mt-1.5">
          <span>₹10,000</span>
          <span>₹1,00,000+</span>
        </div>
      </div>

      {/* 3. Duration */}
      <div className="pt-2 border-t border-stonewarm/60">
        <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-2.5">
          Duration
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {DURATION_OPTIONS.map((dur) => {
            const isSelected = selectedDuration === dur.id;
            return (
              <button
                key={dur.id}
                type="button"
                onClick={() => onDurationChange(isSelected ? '' : dur.id)}
                className={`text-xs font-bold py-2 px-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-pine text-white border-pine shadow-sm'
                    : 'bg-white text-ink border-stonewarm hover:border-pine hover:bg-cream2/50'
                }`}
                aria-pressed={isSelected}
              >
                {dur.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Travel Style Multi-Select Chips */}
      <div className="pt-2 border-t border-stonewarm/60">
        <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-2.5">
          Travel Style
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TRAVEL_STYLES.map((style) => {
            const isSelected = selectedStyles.includes(style);
            return (
              <button
                key={style}
                type="button"
                onClick={() => onStyleToggle(style)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-moss text-white border-moss shadow-sm font-bold'
                    : 'bg-white text-ink border-stonewarm hover:border-moss hover:bg-cream2/50'
                }`}
                aria-pressed={isSelected}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Rating Filter */}
      <div className="pt-2 border-t border-stonewarm/60">
        <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-2">
          Guest Rating
        </label>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((r) => {
            const isSelected = minRating === r.val;
            return (
              <label
                key={r.val}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-cream2/60 cursor-pointer select-none text-xs font-semibold group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onRatingChange(isSelected ? 0 : r.val)}
                  className="accent-pine w-4 h-4 rounded cursor-pointer"
                  aria-label={r.label}
                />
                <div className="flex items-center gap-1.5 text-ink">
                  <Star className="w-3.5 h-3.5 fill-sand text-sand" />
                  <span className={isSelected ? 'font-bold text-pine' : ''}>{r.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Concierge Assistance Card */}
      <div className="bg-mosslight rounded-2xl p-4 border border-moss/20 space-y-2 mt-4">
        <div className="font-extrabold text-xs text-pine flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-moss" /> Bespoke Yatra
        </div>
        <p className="text-xs text-pine/80 leading-relaxed font-medium">
          Have exact dates or need a customized multi-city circuit? Talk to our senior travel designers directly.
        </p>
      </div>
    </div>
  );
};
