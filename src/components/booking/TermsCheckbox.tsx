import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export interface TermsCheckboxProps {
  agreed: boolean;
  onAgreeChange: (checked: boolean) => void;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  agreed,
  onAgreeChange,
}) => {
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stonewarm p-4 sm:p-5 shadow-xs space-y-3">
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreeChange(e.target.checked)}
          className="accent-pine mt-0.5 w-4 h-4 rounded cursor-pointer shrink-0"
        />
        <div className="text-xs text-[#3A4542] leading-relaxed">
          <span>I agree to the </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPolicyDetails(!showPolicyDetails);
            }}
            className="font-bold text-pine hover:text-moss underline decoration-pine/40 transition"
          >
            SukhYatri booking terms and 48-hour cancellation policy
          </button>
          <span>. I confirm that all entered traveller names match government ID cards.</span>
        </div>
      </label>

      {/* Expandable policy summary */}
      {showPolicyDetails && (
        <div className="bg-cream2/60 rounded-xl p-3.5 border border-stonewarm/60 text-[11.5px] text-[#3A4542] space-y-1.5 animate-toast-in">
          <div className="font-bold text-pine flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-moss" />
            <span>SukhYatri Assurance Summary:</span>
          </div>
          <ul className="space-y-1 pl-4 list-disc text-muted">
            <li>100% full refund within 48 hours of initial booking.</li>
            <li>One complimentary departure date change allowed up to 10 days before departure.</li>
            <li>Sanitized private vehicle with verified, rested driver assigned for the full route.</li>
            <li>24×7 WhatsApp concierge support throughout your journey.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
