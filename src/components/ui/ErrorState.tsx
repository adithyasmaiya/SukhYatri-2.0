import React from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something unexpected happened',
  message = 'We could not load the requested travel details. Please try again or contact our concierge.',
  onRetry,
}) => {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-[28px] border border-stonewarm shadow-card max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-[#FDECEC] text-[#B42318] flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      <p className="text-muted text-sm mt-2 max-w-sm mx-auto leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
