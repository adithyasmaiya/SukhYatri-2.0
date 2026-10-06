import React from 'react';
import { formatINR } from '../../utils/format';

export interface PriceBreakdownProps {
  pricePerPerson: number;
  travellers: number;
  baseAmount: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  totalAmount: number;
  compact?: boolean;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  pricePerPerson,
  travellers,
  baseAmount,
  discountAmount,
  couponCode,
  taxAmount,
  totalAmount,
  compact = false,
}) => {
  return (
    <div
      className={`rounded-2xl border border-stonewarm/60 space-y-2.5 text-xs ${
        compact ? 'bg-cream2/60 p-4' : 'bg-white p-5 shadow-xs'
      }`}
    >
      <div className="font-extrabold text-[10.5px] uppercase tracking-wider text-muted">
        Pricing Summary
      </div>

      {/* Base Fare */}
      <div className="flex items-center justify-between text-ink">
        <span>
          Base Fare ({formatINR(pricePerPerson)} × {travellers}{' '}
          {travellers === 1 ? 'Guest' : 'Guests'})
        </span>
        <span className="font-bold">{formatINR(baseAmount)}</span>
      </div>

      {/* Discount */}
      {discountAmount > 0 && (
        <div className="flex items-center justify-between text-moss font-bold">
          <span>
            Coupon / Festive Discount {couponCode ? `(${couponCode})` : ''}
          </span>
          <span>−{formatINR(discountAmount)}</span>
        </div>
      )}

      {/* Taxes */}
      <div className="flex items-center justify-between text-muted">
        <span>Goods &amp; Services Tax (GST 5%)</span>
        <span>{formatINR(taxAmount)}</span>
      </div>

      {/* Total */}
      <div className="pt-2.5 border-t border-stonewarm flex items-center justify-between text-sm sm:text-base font-extrabold text-ink">
        <span>Total Payable</span>
        <span className="text-pine font-display text-xl sm:text-2xl">
          {formatINR(totalAmount)}
        </span>
      </div>

      <div className="text-[10px] text-muted text-right font-medium">
        All state road permits &amp; driver charges included
      </div>
    </div>
  );
};
