import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'sand'
    | 'pine'
    | 'moss'
    | 'mosslight'
    | 'white'
    | 'outline'
    | 'confirmed'
    | 'pending'
    | 'cancelled'
    | 'success'
    | 'error'
    | 'warning'
    | 'default';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'white',
  size = 'md',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center gap-1.5 font-bold tracking-[0.03em] rounded-full whitespace-nowrap';

  const variants = {
    sand: 'bg-sand text-ink',
    pine: 'bg-pine text-white',
    moss: 'bg-moss text-white',
    mosslight: 'bg-mosslight text-moss',
    white: 'bg-white text-ink border border-stonewarm',
    outline: 'border border-white/25 text-white backdrop-blur-sm bg-white/10',
    confirmed: 'bg-[#E6F1EE] text-[#147A70]',
    pending: 'bg-[#FFF4DE] text-[#9A7410]',
    cancelled: 'bg-[#FDECEC] text-[#B42318]',
    success: 'bg-[#E6F1EE] text-[#147A70]',
    error: 'bg-[#FDECEC] text-[#B42318]',
    warning: 'bg-[#FFF4DE] text-[#9A7410]',
    default: 'bg-white text-ink border border-stonewarm',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5',
    md: 'text-[11.5px] px-3 py-1',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
