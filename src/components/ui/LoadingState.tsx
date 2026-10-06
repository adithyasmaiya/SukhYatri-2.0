import React from 'react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  fullscreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading curated journeys…',
  subMessage = 'Gathering handpicked stays & verified routes',
  fullscreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-stonewarm border-t-pine animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-sand" />
        </div>
      </div>
      <h3 className="font-display text-xl font-semibold text-ink">{message}</h3>
      {subMessage && <p className="text-xs text-muted mt-1 max-w-sm">{subMessage}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[200] bg-cream/90 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-[24px] border border-stonewarm p-4 animate-pulse space-y-4',
        className
      )}
    >
      <div className="w-full h-48 bg-stonewarm/60 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-4 bg-stonewarm/70 rounded w-1/3" />
        <div className="h-6 bg-stonewarm/80 rounded w-3/4" />
        <div className="h-4 bg-stonewarm/50 rounded w-1/2" />
      </div>
      <div className="pt-4 border-t border-stonewarm flex justify-between items-center">
        <div className="h-6 bg-stonewarm/80 rounded w-1/4" />
        <div className="h-9 bg-stonewarm/90 rounded-full w-24" />
      </div>
    </div>
  );
};
