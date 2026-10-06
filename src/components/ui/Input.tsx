import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftElement, rightElement, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-muted">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-white border-1.5 border-stonewarm rounded-[14px] px-4 py-3 text-[14.5px] text-ink outline-none transition-all placeholder:text-muted/60',
              'focus:border-moss focus:ring-4 focus:ring-moss/10',
              leftElement && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-[#B42318] focus:border-[#B42318] focus:ring-red-100',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center">{rightElement}</div>
          )}
        </div>
        {error && <p className="text-xs font-semibold text-[#B42318] mt-1.5">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-muted mt-1.5 leading-relaxed">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
