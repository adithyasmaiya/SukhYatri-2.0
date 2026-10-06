import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  if (variant === 'pills') {
    return (
      <div
        className={cn(
          'inline-flex p-1 bg-cream2 rounded-full border border-stonewarm/60',
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none',
                isActive
                  ? 'bg-pine text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 opacity-80">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-6 border-b border-stonewarm', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative pb-3 text-sm font-bold transition-colors select-none',
              isActive ? 'text-pine' : 'text-muted hover:text-ink'
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs text-muted font-normal">
                ({tab.count})
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pine rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
