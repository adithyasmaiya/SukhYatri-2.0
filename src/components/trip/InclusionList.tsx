import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface InclusionListProps {
  inclusions: string[];
  exclusions: string[];
}

export const InclusionList: React.FC<InclusionListProps> = ({
  inclusions,
  exclusions,
}) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          What is Covered
        </h2>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Complete transparency with zero hidden surprises or on-ground surcharges.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Included Column */}
        <div className="bg-mosslight/50 rounded-3xl p-6 sm:p-7 border border-moss/20 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-moss/15">
            <CheckCircle2 className="w-5 h-5 text-moss" />
            <h3 className="font-extrabold text-pine text-sm uppercase tracking-wider">
              Included in Your Booking
            </h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm font-semibold text-pine/90">
            {(inclusions || []).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-moss font-bold text-sm shrink-0">✓</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Included Column */}
        <div className="bg-[#FFF6ED] rounded-3xl p-6 sm:p-7 border border-[#F0D5BE] shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8C5A5]">
            <XCircle className="w-5 h-5 text-[#A34E24]" />
            <h3 className="font-extrabold text-[#7D3411] text-sm uppercase tracking-wider">
              Not Included (Optional)
            </h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm font-semibold text-[#7D3411]/90">
            {(exclusions || []).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[#A34E24] font-bold text-sm shrink-0">×</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
