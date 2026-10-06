import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Sliders, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      action: 'Discover',
      title: 'Find your travel rhythm',
      description:
        'Explore 48 slow-crafted circuits across India. Filter by your pace, travel style, or season — from silent mountain valleys to tranquil backwaters.',
      icon: Compass,
    },
    {
      step: '02',
      action: 'Choose',
      title: 'Personalise every detail',
      description:
        'Connect directly with your regional travel designer. Adjust dates, room grades, dietary preferences, or private signature experiences for free.',
      icon: Sliders,
    },
    {
      step: '03',
      action: 'Book',
      title: 'Hold with zero risk',
      description:
        'Hold seats for 48 hours for ₹0, or confirm with a ₹5,000 token. Enjoy 100% free cancellation within 48 hours and one free date change.',
      icon: CheckCircle2,
    },
    {
      step: '04',
      action: 'Travel',
      title: 'Arrive in unhurried joy',
      description:
        'Step into your private sanitized vehicle with a rested, courteous driver. Relax in verified boutique stays with 24×7 concierge on WhatsApp.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="bg-cream2/60 border-y border-stonewarm py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Visual Story Flow */}
        <div className="space-y-8">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
              04 — How It Works
            </div>
            <h2 className="font-display text-3xl lg:text-[44px] font-semibold tracking-tight text-ink leading-tight">
              From daydream to departure
              <br />
              in 4 unhurried steps
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/80 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-pine text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm">
                    <Icon className="w-5 h-5 text-sand" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-moss">
                        Step {s.step} · {s.action}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base lg:text-lg text-ink mt-0.5">
                      {s.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-muted mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/explore')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Planning Your Journey
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Storytelling Mockup */}
        <div className="relative">
          <div className="rounded-[32px] overflow-hidden shadow-lift h-[520px] bg-ink">
            <img
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop"
              alt="Comfort travel experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Floating Live Badge: Concierge */}
          <div className="absolute -bottom-6 -left-4 lg:-left-6 bg-white rounded-2xl shadow-lift p-4 flex items-center gap-3.5 max-w-[320px] animate-float-soft border border-stonewarm">
            <div className="w-11 h-11 rounded-full bg-mosslight text-moss flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-ink">Concierge Confirmed</div>
              <div className="text-[11px] text-muted mt-0.5">
                Meera tailored the Kerala backwaters route · 2 min ago
              </div>
            </div>
          </div>

          {/* Floating Price Badge */}
          <div className="absolute -top-5 -right-3 lg:-right-5 bg-pine text-white rounded-2xl shadow-lift px-5 py-3.5 animate-float-soft border border-white/15">
            <div className="text-[11px] text-sand font-bold tracking-wide">Starting from</div>
            <div className="font-display text-2xl font-bold">
              ₹24,500 <span className="text-xs font-sans font-normal opacity-70">/ person</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
