import React from 'react';
import { PaymentStatus } from '../../types';

export interface PaymentStatusBadgeProps {
  status?: PaymentStatus;
  size?: 'sm' | 'md';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status = 'Paid',
  size = 'md',
}) => {
  const norm = (status || '').toLowerCase();

  const config = {
    paid: {
      bg: 'bg-mosslight text-pine border-moss/30',
      label: 'Paid',
    },
    refunded: {
      bg: 'bg-cream2 text-muted border-stonewarm',
      label: 'Refunded',
    },
    partially_refunded: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      label: 'Partial Refund',
    },
    pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      label: 'Payment Pending',
    },
    failed: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      label: 'Payment Failed',
    },
  }[norm] || {
    bg: 'bg-cream2 text-muted border-stonewarm',
    label: status,
  };

  const sizeClasses =
    size === 'sm'
      ? 'text-[10.5px] px-2 py-0.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span>{config.label}</span>
    </span>
  );
};
