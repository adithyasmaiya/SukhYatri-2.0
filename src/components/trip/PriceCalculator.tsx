import React from 'react';
import { formatINR } from '../../utils/format';

export interface PriceCalculatorProps {
  pricePerPerson: number;
  originalPricePerPerson?: number;
  discountPercent?: number;
  travellers: number;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  pricePerPerson,
  originalPricePerPerson,
  discountPercent,
  travellers,
}) => {
  const origTotal = (originalPricePerPerson || pricePerPerson) * travellers;
  const finalTotal = pricePerPerson * travellers;
  const savings = origTotal - finalTotal;

  return (
    <div className="bg-cream2/70 rounded-2xl p-4 border border-stonewarm/60 space-y-2.5 text-xs">
      <div className="font-extrabold text-[11px] uppercase tracking-wider text-muted">
        Price Breakdown
      </div>

      <div className="flex items-center justify-between text-ink">
        <span>
          Base price ({formatINR(pricePerPerson)} × {travellers}{' '}
          {travellers === 1 ? 'person' : 'people'})
        </span>
        <span className="font-bold">{formatINR(finalTotal)}</span>
      </div>

      {savings > 0 && (
        <>
          <div className="flex items-center justify-between text-muted">
            <span>Original price</span>
            <span className="line-through">{formatINR(origTotal)}</span>
          </div>

          <div className="flex items-center justify-between text-moss font-bold">
            <span>Special saving ({discountPercent}% off)</span>
            <span>−{formatINR(savings)}</span>
          </div>
        </>
      )}

      <div className="pt-2 border-t border-stonewarm flex items-center justify-between text-sm font-extrabold text-ink">
        <span>Total Payable</span>
        <span className="text-pine font-display text-lg">{formatINR(finalTotal)}</span>
      </div>
      <div className="text-[10.5px] text-muted text-right">
        All taxes &amp; driver charges included
      </div>
    </div>
  );
};
