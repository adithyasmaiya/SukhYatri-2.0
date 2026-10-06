import React from 'react';
import { Users, Baby } from 'lucide-react';

export interface TravellerCounterProps {
  adults: number;
  childrenCount: number;
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
}

export const TravellerCounter: React.FC<TravellerCounterProps> = ({
  adults,
  childrenCount,
  onAdultsChange,
  onChildrenChange,
}) => {
  const totalTravellers = adults + childrenCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-pine" />
            <span>Number of Travellers</span>
          </label>
          <div className="font-display text-lg font-bold text-ink mt-0.5">
            {totalTravellers} {totalTravellers === 1 ? 'Traveller' : 'Travellers'}
            <span className="text-xs font-normal text-muted ml-2 font-sans">
              ({adults} {adults === 1 ? 'Adult' : 'Adults'}
              {childrenCount > 0
                ? `, ${childrenCount} ${childrenCount === 1 ? 'Child' : 'Children'}`
                : ''}
              )
            </span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Adults Stepper */}
        <div className="bg-white border border-stonewarm rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Users className="w-4 h-4 text-pine" />
              <span>Adults</span>
            </div>
            <div className="text-[11px] text-muted">Ages 12+ years</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onAdultsChange(Math.max(1, adults - 1))}
              disabled={adults <= 1}
              className="w-8 h-8 rounded-full bg-cream2 hover:bg-stonewarm flex items-center justify-center font-bold text-ink disabled:opacity-40 transition active:scale-95"
              aria-label="Decrease adult count"
            >
              −
            </button>
            <span className="font-bold text-sm text-ink w-4 text-center">{adults}</span>
            <button
              type="button"
              onClick={() => onAdultsChange(Math.min(12, adults + 1))}
              className="w-8 h-8 rounded-full bg-pine hover:bg-moss text-white flex items-center justify-center font-bold transition active:scale-95"
              aria-label="Increase adult count"
            >
              +
            </button>
          </div>
        </div>

        {/* Children Stepper */}
        <div className="bg-white border border-stonewarm rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Baby className="w-4 h-4 text-pine" />
              <span>Children</span>
            </div>
            <div className="text-[11px] text-muted">Ages 2–11 years</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChildrenChange(Math.max(0, childrenCount - 1))}
              disabled={childrenCount <= 0}
              className="w-8 h-8 rounded-full bg-cream2 hover:bg-stonewarm flex items-center justify-center font-bold text-ink disabled:opacity-40 transition active:scale-95"
              aria-label="Decrease child count"
            >
              −
            </button>
            <span className="font-bold text-sm text-ink w-4 text-center">{childrenCount}</span>
            <button
              type="button"
              onClick={() => onChildrenChange(Math.min(6, childrenCount + 1))}
              className="w-8 h-8 rounded-full bg-pine hover:bg-moss text-white flex items-center justify-center font-bold transition active:scale-95"
              aria-label="Increase child count"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
