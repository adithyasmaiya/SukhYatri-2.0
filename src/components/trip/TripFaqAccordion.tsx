import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export interface TripFaqItem {
  question: string;
  answer: string;
}

export interface TripFaqAccordionProps {
  faqs?: TripFaqItem[];
}

export const TripFaqAccordion: React.FC<TripFaqAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const defaultFaqs: TripFaqItem[] = [
    {
      question: 'What is included in the package?',
      answer:
        'All handpicked boutique accommodations, daily curated breakfasts, private air-conditioned vehicle with a courteous verified driver for the entire trip, all state border road taxes, parking, driver allowances, and signature guided experiences listed in the itinerary.',
    },
    {
      question: 'Can I cancel or reschedule my booking?',
      answer:
        'Yes! We offer a 100% free cancellation guarantee within 48 hours of booking. Beyond 48 hours, cancellations made up to 15 days before departure receive a 90% refund. You also get one free date shift up to 10 days before your journey.',
    },
    {
      question: 'Can I change the travel dates or customize the hotels?',
      answer:
        'Absolutely. 83% of SukhYatri travellers customize their trips. You can change dates, upgrade rooms, add activities, or extend stays by requesting your dedicated trip designer before making your final payment.',
    },
    {
      question: 'Are flights included in the package price?',
      answer:
        'Flights are not included by default, allowing you the freedom to choose your preferred airlines or redeem credit card miles. However, our concierge desk can book domestic flights at transparent airline rates upon request.',
    },
    {
      question: 'Is this trip suitable for families, children, and elderly guests?',
      answer:
        'Yes. Our itineraries are specifically crafted around comfortable, slow-paced travel with minimal rushing, spacious vehicles, and premium properties equipped with modern amenities and elevator/ground-floor access.',
    },
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-pine" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-muted">
            Got Questions?
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Frequently Asked Questions
        </h2>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Everything you need to know about booking, travel policies, and on-trip assistance.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                isOpen
                  ? 'border-pine/30 shadow-sm ring-1 ring-pine/10'
                  : 'border-stonewarm hover:border-stonewarm/80'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-ink hover:bg-cream/40 transition-colors select-none"
                aria-expanded={isOpen}
              >
                <span className="pr-4">{faq.question}</span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isOpen
                      ? 'bg-pine text-white border-pine'
                      : 'bg-cream2 text-muted border-stonewarm'
                  }`}
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#3A4542] leading-relaxed border-t border-stonewarm/40 bg-cream/15">
                  <p className="pt-2">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
