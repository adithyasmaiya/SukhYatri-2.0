import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface BookingErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  returnPath?: string;
}

export const BookingError: React.FC<BookingErrorProps> = ({
  title = 'Booking Could Not Proceed',
  message = 'We encountered an unexpected issue while retrieving the journey checkout portal. Please try again or return to explore.',
  onRetry,
  returnPath = '/explore',
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto py-16 px-5 text-center space-y-5">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
        <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">{message}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => navigate(returnPath)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to Explore
        </Button>
      </div>
    </div>
  );
};
