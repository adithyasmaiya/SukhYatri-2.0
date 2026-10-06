import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghostlight' | 'danger' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isSpinning = isLoading || loading;
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-pine text-white hover:bg-moss hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(20,122,112,0.5)] focus:ring-pine',
      gold:
        'bg-sand text-ink hover:bg-[#D8BE8A] hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-8px_rgba(200,169,106,0.6)] focus:ring-sand font-extrabold',
      outline:
        'border-1.5 border-[#D9D1C0] bg-white text-ink hover:border-pine hover:text-pine focus:ring-pine',
      ghostlight:
        'border-1.5 border-white/35 text-white hover:bg-white hover:text-pine focus:ring-white',
      danger:
        'bg-[#B42318] text-white hover:bg-red-700 hover:shadow-md focus:ring-red-500',
      soft:
        'bg-cream2 text-pine hover:bg-stonewarm/80 focus:ring-pine',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-6 py-3 gap-2',
      lg: 'text-[15px] px-8 py-4 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isSpinning}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isSpinning ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isSpinning && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
