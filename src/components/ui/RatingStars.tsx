import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'md',
  className,
}) => {
  const rounded = Math.round(rating);
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              starSizes[size],
              i <= rounded
                ? 'fill-[#E8A93D] text-[#E8A93D]'
                : 'fill-stonewarm text-stonewarm'
            )}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted font-medium ml-0.5">({count})</span>
      )}
    </div>
  );
};
