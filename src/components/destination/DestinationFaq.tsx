import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { DestinationFaq as DestinationFaqType } from '../../types';

export interface DestinationFaqProps {
  faqs: DestinationFaqType[];
  destinationName: string;
}

export const DestinationFaq: React.FC<DestinationFaqProps> = ({
  faqs,
  destinationName,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="space-y-5">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-1">
          Got Questions?
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Frequently Asked Questions about {destinationName}
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white border border-stonewarm rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-ink hover:bg-cream/40 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-moss shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-cream2 flex items-center justify-center text-ink shrink-0 ml-3">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pl-11 text-xs sm:text-sm text-[#3A4542] leading-relaxed border-t border-stonewarm/40 pt-3.5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
