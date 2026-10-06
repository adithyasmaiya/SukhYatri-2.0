import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ExploreFilterPanel, ExploreFilterPanelProps } from './ExploreFilterPanel';
import { Button } from '../ui/Button';

export interface ExploreMobileFilterDrawerProps extends ExploreFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
}

export const ExploreMobileFilterDrawer: React.FC<ExploreMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  resultsCount,
  ...filterProps
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 max-h-[88vh] bg-white rounded-t-[32px] shadow-2xl flex flex-col z-10 animate-toast-in border-t border-stonewarm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stonewarm">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg text-ink">Filters</h3>
            {filterProps.activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sand text-ink text-xs font-bold flex items-center justify-center">
                {filterProps.activeFiltersCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {filterProps.activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={filterProps.onClearFilters}
                className="text-xs font-bold text-moss flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-cream2 text-ink flex items-center justify-center hover:bg-stonewarm transition"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Body */}
        <div className="p-6 overflow-y-auto flex-1 overscroll-contain">
          <ExploreFilterPanel {...filterProps} />
        </div>

        {/* Sticky Apply Footer */}
        <div className="p-5 border-t border-stonewarm bg-white/95 backdrop-blur-sm">
          <Button
            variant="primary"
            size="lg"
            className="w-full !rounded-2xl py-3.5 font-extrabold text-sm shadow-lift"
            onClick={onClose}
          >
            Show {resultsCount} {resultsCount === 1 ? 'Journey' : 'Journeys'}
          </Button>
        </div>
      </div>
    </div>
  );
};
