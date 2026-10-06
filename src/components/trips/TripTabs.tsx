import React from 'react';

export type TripTabType = 'upcoming' | 'completed' | 'cancelled' | 'all';

export interface TripTabsProps {
  activeTab: TripTabType;
  onTabChange: (tab: TripTabType) => void;
  counts: {
    upcoming: number;
    completed: number;
    cancelled: number;
    all: number;
  };
}

export const TripTabs: React.FC<TripTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs = [
    { id: 'upcoming' as TripTabType, label: 'Upcoming', count: counts.upcoming },
    { id: 'completed' as TripTabType, label: 'Completed', count: counts.completed },
    { id: 'cancelled' as TripTabType, label: 'Cancelled', count: counts.cancelled },
    { id: 'all' as TripTabType, label: 'All Trips', count: counts.all },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stonewarm/80 select-none no-scrollbar">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap -mb-px ${
              isActive
                ? 'border-pine text-pine'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                isActive
                  ? 'bg-pine text-sand'
                  : 'bg-cream2 text-muted'
              }`}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
