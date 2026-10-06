import React from 'react';
import { BookingStatus } from '../../types';

export interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const norm = (status || '').toLowerCase();

  const config = {
    confirmed: {
      bg: 'bg-mosslight text-pine border-moss/30',
      dot: 'bg-moss',
      label: 'Confirmed',
    },
    completed: {
      bg: 'bg-cream2 text-ink border-stonewarm',
      dot: 'bg-pine',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      label: 'Cancelled',
    },
    pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Pending Confirmation',
    },
  }[norm] || {
    bg: 'bg-cream2 text-muted border-stonewarm',
    dot: 'bg-muted',
    label: status,
  };

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
};
