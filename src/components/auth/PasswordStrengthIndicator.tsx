import React from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export interface PasswordCriteria {
  minChars: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

export function evaluatePassword(password: string): PasswordCriteria {
  const minChars = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const checks = [minChars, hasUpper, hasLower, hasNumber];
  const score = checks.filter(Boolean).length;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }

  return {
    minChars,
    hasUpper,
    hasLower,
    hasNumber,
    isValid: score === 4,
    strength,
    score,
  };
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({
  password,
  showRequirements = true,
}) => {
  if (!password) return null;

  const criteria = evaluatePassword(password);

  const requirements = [
    { label: 'Minimum 8 characters', met: criteria.minChars },
    { label: 'At least one uppercase character', met: criteria.hasUpper },
    { label: 'At least one lowercase character', met: criteria.hasLower },
    { label: 'At least one number', met: criteria.hasNumber },
  ];

  const strengthLabels = {
    weak: 'Weak password',
    medium: 'Moderate strength',
    strong: 'Strong password',
  };

  const strengthColor = {
    weak: 'bg-red-500 text-red-600',
    medium: 'bg-amber-500 text-amber-700',
    strong: 'bg-moss text-pine',
  };

  return (
    <div className="space-y-3 pt-1.5 animate-toast-in">
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-muted">Password Strength</span>
          <span
            className={
              criteria.strength === 'strong'
                ? 'text-moss'
                : criteria.strength === 'medium'
                ? 'text-amber-600'
                : 'text-red-500'
            }
          >
            {strengthLabels[criteria.strength]}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 h-1.5">
          <div
            className={`rounded-full transition-colors duration-300 ${
              criteria.score >= 1 ? strengthColor[criteria.strength].split(' ')[0] : 'bg-stonewarm/60'
            }`}
          />
          <div
            className={`rounded-full transition-colors duration-300 ${
              criteria.score >= 3 ? strengthColor[criteria.strength].split(' ')[0] : 'bg-stonewarm/60'
            }`}
          />
          <div
            className={`rounded-full transition-colors duration-300 ${
              criteria.score === 4 ? strengthColor[criteria.strength].split(' ')[0] : 'bg-stonewarm/60'
            }`}
          />
        </div>
      </div>

      {/* Dynamic Requirements Checklist */}
      {showRequirements && (
        <div className="bg-cream2/60 rounded-xl p-3 border border-stonewarm/60 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Security Requirements
          </div>
          <ul className="space-y-1 text-xs">
            {requirements.map((req, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-1.5 transition-colors ${
                  req.met ? 'text-pine font-semibold' : 'text-muted'
                }`}
              >
                {req.met ? (
                  <Check className="w-3.5 h-3.5 text-moss shrink-0 stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-stonewarm shrink-0 mx-1" />
                )}
                <span className={req.met ? 'text-ink' : 'text-muted'}>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
