import React, { useRef, useEffect } from 'react';

export interface OtpInputProps {
  value: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  hasError = false,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digit = rawVal.replace(/\D/g, '').slice(-1);

    const nextVal = [...value];
    nextVal[index] = digit;
    onChange(nextVal);

    // Auto-focus next box if digit was typed
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If current box is empty, jump to previous and clear it
        const nextVal = [...value];
        nextVal[index - 1] = '';
        onChange(nextVal);
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextVal = [...value];
        nextVal[index] = '';
        onChange(nextVal);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const nextVal = [...value];
    for (let i = 0; i < 6; i++) {
      nextVal[i] = pasted[i] || '';
    }
    onChange(nextVal);

    // Focus last filled index or the next empty box
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Verification digit ${idx + 1} of 6`}
          className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold font-display rounded-2xl border transition-all outline-none shadow-xs select-none ${
            hasError
              ? 'border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-200'
              : value[idx]
              ? 'border-pine bg-white text-ink ring-1 ring-pine/20'
              : 'border-stonewarm bg-cream2/60 text-ink focus:border-pine focus:bg-white focus:ring-2 focus:ring-pine/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
};
