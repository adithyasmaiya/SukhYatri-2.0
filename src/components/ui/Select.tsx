import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none bg-white border-1.5 border-stonewarm rounded-[14px] px-4 py-3 pr-10 text-[14.5px] font-semibold text-ink outline-none transition-all cursor-pointer',
              'focus:border-moss focus:ring-4 focus:ring-moss/10',
              error && 'border-[#B42318]',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-pine">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs font-semibold text-[#B42318] mt-1.5">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
