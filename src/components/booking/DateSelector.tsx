import React from 'react';
import { Calendar, Info } from 'lucide-react';

export interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  error?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  error,
}) => {
  // Prevent past dates: Minimum date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  // Human-readable formatted date string
  const formattedDate = React.useMemo(() => {
    if (!selectedDate) return '';
    try {
      const d = new Date(selectedDate);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }, [selectedDate]);

  return (
    <div className="space-y-2">
      <label
        htmlFor="travel-date-picker"
        className="block text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5"
      >
        <Calendar className="w-3.5 h-3.5 text-pine" />
        <span>Departure Travel Date *</span>
      </label>

      <div className="relative">
        <input
          id="travel-date-picker"
          type="date"
          min={minDateStr}
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className={`w-full bg-white border rounded-2xl px-4 py-3 text-sm font-bold text-ink outline-none transition cursor-pointer shadow-xs ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
          }`}
          required
        />
      </div>

      {formattedDate && (
        <div className="text-xs font-bold text-moss flex items-center gap-1.5 pt-0.5">
          <span>● Journey departs on:</span>
          <span className="text-ink">{formattedDate}</span>
        </div>
      )}

      {error ? (
        <p className="text-xs text-red-600 font-semibold">{error}</p>
      ) : (
        <p className="text-[11.5px] text-muted flex items-center gap-1">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Free 1-time departure date shift allowed up to 10 days before travel.</span>
        </p>
      )}
    </div>
  );
};
