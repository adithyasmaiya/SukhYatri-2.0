import React from 'react';
import { Clock, Sparkles, Compass } from 'lucide-react';

export interface TripCountdownProps {
  travelDate: string;
}

export const TripCountdown: React.FC<TripCountdownProps> = ({ travelDate }) => {
  const countdown = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(travelDate);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return {
        label: 'Your trip starts today!',
        isUrgent: true,
        bg: 'bg-moss text-white shadow-xs',
      };
    }
    if (days === 1) {
      return {
        label: 'Your trip starts tomorrow!',
        isUrgent: true,
        bg: 'bg-moss text-white shadow-xs',
      };
    }
    if (days > 1) {
      return {
        label: `Your trip starts in ${days} days`,
        isUrgent: days <= 7,
        bg: 'bg-mosslight text-pine border border-moss/20',
      };
    }
    return {
      label: 'Journey concluded',
      isUrgent: false,
      bg: 'bg-cream2 text-muted border border-stonewarm',
    };
  }, [travelDate]);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${countdown.bg}`}
    >
      {countdown.isUrgent ? (
        <Sparkles className="w-3.5 h-3.5 text-sand animate-pulse" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-pine" />
      )}
      <span>{countdown.label}</span>
    </div>
  );
};
