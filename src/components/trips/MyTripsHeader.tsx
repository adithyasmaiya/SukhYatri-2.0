import React from 'react';
import { Compass, CalendarCheck, CheckCircle2, Luggage, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface MyTripsHeaderProps {
  upcomingCount: number;
  completedCount: number;
  totalCount: number;
  userName?: string;
}

export const MyTripsHeader: React.FC<MyTripsHeaderProps> = ({
  upcomingCount,
  completedCount,
  totalCount,
  userName = 'Fellow Yatri',
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-moss">
            Personal Journey Hub
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight mt-0.5">
            My Trips
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
            Everything about your SukhYatri journeys, all in one place.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-cream2 border border-stonewarm text-pine px-4 py-2.5 rounded-2xl transition shadow-xs w-fit"
        >
          <Compass className="w-4 h-4 text-pine" />
          <span>Plan a New Journey</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
        </Link>
      </div>

      {/* Useful Summary Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1: Upcoming */}
        <div className="bg-white rounded-3xl border border-stonewarm p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-mosslight text-pine flex items-center justify-center shrink-0">
            <Luggage className="w-5 h-5 text-moss" />
          </div>
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
              {upcomingCount}
            </div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Upcoming Trips
            </div>
          </div>
        </div>

        {/* Metric 2: Completed */}
        <div className="bg-white rounded-3xl border border-stonewarm p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sand/20 text-pine flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
              {completedCount}
            </div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Completed Trips
            </div>
          </div>
        </div>

        {/* Metric 3: Total Journeys */}
        <div className="bg-white rounded-3xl border border-stonewarm p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cream2 text-pine flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5 text-pine" />
          </div>
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
              {totalCount}
            </div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Total Journeys
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
