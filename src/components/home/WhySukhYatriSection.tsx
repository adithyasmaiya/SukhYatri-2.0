import React from 'react';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Receipt,
  CalendarCheck,
  HeartHandshake,
} from 'lucide-react';

export const WhySukhYatriSection: React.FC = () => {
  const pillars = [
    {
      icon: Compass,
      title: 'Curated Journeys',
      description:
        'Slow, thoughtful itineraries crafted by regional experts. Two-night minimum stays ensure you actually unpack and soak in the culture.',
    },
    {
      icon: Sparkles,
      title: 'Comfortable Travel',
      description:
        'Squeaky-clean washrooms, sanitized private vehicles, and well-rested drivers with mandated break hours. No fatigue, only joy.',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Experiences',
      description:
        'Every heritage haveli, mountain cottage, and houseboat is inspected in person every 90 days. Zero unpleasant check-in surprises.',
    },
    {
      icon: Receipt,
      title: 'Transparent Pricing',
      description:
        'Honest, all-inclusive pricing with zero hidden charges. No tourist traps, no compulsory shopping halts, and no surprise toll fees.',
    },
    {
      icon: CalendarCheck,
      title: 'Easy Booking',
      description:
        'Hold seats for 48 hours with ₹0 or confirm with a modest ₹5,000 token. Flexible cancellation and 0% card EMI options available.',
    },
    {
      icon: HeartHandshake,
      title: '24×7 Human Support',
      description:
        'A dedicated travel designer reachable on WhatsApp and phone throughout your trip. Need medicine or an itinerary tweak? We handle it.',
    },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-4">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
          03 — Why Choose SukhYatri
        </div>
        <h2 className="font-display text-3xl lg:text-[44px] font-semibold tracking-tight text-ink">
          Comfort is our compass
        </h2>
        <p className="text-muted mt-3 text-xs lg:text-sm leading-relaxed">
          We obsess over the unglamorous details so you feel the enchantment of India, not the miles.
          Experience the standard that made 1.2 lakh yatris arrive in joy.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {pillars.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl border border-stonewarm p-6 lg:p-7 shadow-card hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(21,33,30,0.18)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-mosslight text-pine flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-moss" />
                </div>
                <h3 className="font-extrabold text-base lg:text-lg text-ink">
                  {item.title}
                </h3>
                <p className="text-xs lg:text-sm text-muted mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Metrics Bar */}
      <div className="mt-10 bg-white rounded-[26px] border border-stonewarm p-6 lg:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-card">
        <div>
          <div className="font-display text-3xl lg:text-4xl font-semibold text-pine">98%</div>
          <div className="text-xs text-muted font-bold mt-1">Would travel with us again</div>
        </div>
        <div>
          <div className="font-display text-3xl lg:text-4xl font-semibold text-pine">4.9 ★</div>
          <div className="text-xs text-muted font-bold mt-1">Across 8,200 verified reviews</div>
        </div>
        <div>
          <div className="font-display text-3xl lg:text-4xl font-semibold text-pine">Zero</div>
          <div className="text-xs text-muted font-bold mt-1">Hidden fees or forced shopping</div>
        </div>
        <div>
          <div className="font-display text-3xl lg:text-4xl font-semibold text-pine">45 min</div>
          <div className="text-xs text-muted font-bold mt-1">Avg. concierge support resolution</div>
        </div>
      </div>
    </section>
  );
};
