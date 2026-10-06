import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-[24px] border border-stonewarm shadow-card overflow-hidden transition-all duration-300',
        hoverable && 'hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-18px_rgba(21,33,30,0.22)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
