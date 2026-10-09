import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, BedDouble, Calendar, Sparkles } from 'lucide-react';
import { ItineraryDay } from '../../types';
import { Badge } from '../ui/Badge';

export interface ItineraryTimelineProps {
  itinerary: ItineraryDay[];
  durationDays?: number;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary = [],
  durationDays,
}) => {
  const itineraryList = Array.isArray(itinerary) ? itinerary : [];
  const [expandedDays, setExpandedDays] = useState<number[]>([1]); // First day open by default

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const expandAll = () => {
    setExpandedDays(itineraryList.map((d) => d.day));
  };

  const collapseAll = () => {
    setExpandedDays([]);
  };

  const isAllExpanded = expandedDays.length === itineraryList.length && itineraryList.length > 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-pine" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-muted">
              Paced Day-By-Day
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Journey Itinerary
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="white">
            {durationDays || itineraryList.length} Days · Handcrafted Route
          </Badge>
          <button
            type="button"
            onClick={isAllExpanded ? collapseAll : expandAll}
            className="text-xs font-bold text-pine hover:text-moss transition bg-cream2 px-3 py-1.5 rounded-full border border-stonewarm"
          >
            {isAllExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      <div className="relative pl-3 sm:pl-6 space-y-4 before:absolute before:left-[19px] sm:before:left-[31px] before:top-6 before:bottom-6 before:w-[2px] before:bg-stonewarm">
        {itineraryList.map((day) => {
          const isOpen = expandedDays.includes(day.day);

          return (
            <div
              key={day.day}
              className="relative transition-all"
            >
              <div
                className={`rounded-2xl border transition-all duration-200 bg-white shadow-sm overflow-hidden ${
                  isOpen
                    ? 'border-pine/30 shadow-md ring-1 ring-pine/10'
                    : 'border-stonewarm hover:border-stonewarm/80'
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleDay(day.day)}
                  className="w-full flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 text-left select-none hover:bg-cream/30 transition-colors"
                  aria-expanded={isOpen}
                >
                  {/* Day Indicator badge */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-display font-bold shrink-0 flex items-center justify-center text-sm sm:text-base transition-colors ${
                      isOpen
                        ? 'bg-pine text-sand shadow-sm'
                        : 'bg-cream2 text-pine border border-stonewarm/70'
                    }`}
                  >
                    D{day.day}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Day {day.day}
                    </div>
                    <div className="font-bold text-sm sm:text-base text-ink leading-snug truncate sm:whitespace-normal">
                      {day.title}
                    </div>
                    {day.stay && (
                      <div className="text-xs text-muted font-medium mt-1 flex items-center gap-1.5 truncate">
                        <BedDouble className="w-3.5 h-3.5 text-moss shrink-0" />
                        <span className="truncate">{day.stay}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-cream2 flex items-center justify-center text-ink shrink-0 border border-stonewarm/50">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-pine" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 sm:pl-[76px] border-t border-stonewarm/40 space-y-3.5 bg-cream/20">
                    <p className="text-sm text-[#3A4542] leading-relaxed pt-2">
                      {day.description}
                    </p>

                    {/* Features / Details tag row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-muted">
                      <span className="inline-flex items-center gap-1 bg-white border border-stonewarm px-2.5 py-1 rounded-full text-ink text-[11px]">
                        <Sparkles className="w-3 h-3 text-moss" />
                        <span>Curated by SukhYatri Specialist</span>
                      </span>
                      {day.stay && (
                        <span className="inline-flex items-center gap-1 bg-mosslight text-pine px-2.5 py-1 rounded-full text-[11px]">
                          <BedDouble className="w-3 h-3 text-pine" />
                          <span>{day.stay}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
