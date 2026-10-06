import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { formatINR } from '../../utils/format';
import { Button } from '../ui/Button';

export interface MobileBookingBarProps {
  price: number;
  originalPrice?: number;
  onBookNow: () => void;
}

export const MobileBookingBar: React.FC<MobileBookingBarProps> = ({
  price,
  originalPrice,
  onBookNow,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stonewarm p-3.5 px-5 flex items-center justify-between gap-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <div>
        <div className="text-[10px] uppercase font-bold text-muted tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-sand fill-sand" />
          <span>Starting from</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-extrabold text-xl text-ink">
            {formatINR(price)}
          </span>
          <span className="text-[11px] text-muted font-medium">/ person</span>
        </div>
        {originalPrice && originalPrice > price && (
          <div className="text-[10.5px] text-muted line-through">
            {formatINR(originalPrice)}
          </div>
        )}
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={onBookNow}
        className="flex-1 max-w-[200px] justify-center text-sm font-bold shadow-md"
      >
        <span>Book This Trip</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
