import React from 'react';
import { Check } from 'lucide-react';

export interface BookingProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

export const BookingProgress: React.FC<BookingProgressProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  const steps = [
    { number: 1, label: 'Trip Details' },
    { number: 2, label: 'Traveller Details' },
    { number: 3, label: 'Review Booking' },
    { number: 4, label: 'Payment' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stonewarm p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between max-w-3xl mx-auto relative">
        {/* Connecting track line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-stonewarm z-0 hidden sm:block" />

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isAccessible = isCompleted || step.number <= currentStep;

          return (
            <button
              key={step.number}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onStepClick(step.number)}
              className={`relative z-10 flex flex-col sm:flex-row items-center gap-2 group transition-all text-left select-none ${
                isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display font-bold text-xs sm:text-sm transition-all duration-300 shadow-xs ${
                  isCurrent
                    ? 'bg-pine text-sand ring-4 ring-pine/15 scale-105'
                    : isCompleted
                    ? 'bg-moss text-white'
                    : 'bg-cream2 text-muted border border-stonewarm'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  step.number
                )}
              </div>

              <div className="text-center sm:text-left">
                <div
                  className={`text-[10px] uppercase tracking-wider font-extrabold leading-none ${
                    isCurrent ? 'text-pine' : 'text-muted'
                  }`}
                >
                  Step {step.number}
                </div>
                <div
                  className={`text-xs sm:text-sm font-bold mt-0.5 whitespace-nowrap ${
                    isCurrent
                      ? 'text-ink'
                      : isCompleted
                      ? 'text-pine group-hover:underline'
                      : 'text-muted'
                  }`}
                >
                  {step.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
