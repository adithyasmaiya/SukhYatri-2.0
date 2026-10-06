import React from 'react';
import { Button } from './Button';
import { Compass } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-[28px] border border-stonewarm shadow-card max-w-xl mx-auto my-6">
      <div className="w-16 h-16 rounded-full bg-cream2 flex items-center justify-center mx-auto text-pine mb-4">
        {icon || <Compass className="w-8 h-8 text-moss" />}
      </div>
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      <p className="text-muted text-sm mt-2 max-w-md mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="primary">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
