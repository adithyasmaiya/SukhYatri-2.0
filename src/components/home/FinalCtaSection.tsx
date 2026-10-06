import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { Button } from '../ui/Button';

interface FinalCtaSectionProps {
  onOpenConcierge?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenConcierge }) => {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pb-8">
      <div className="relative rounded-[32px] lg:rounded-[40px] overflow-hidden bg-pinedark text-white shadow-lift">
        {/* Background Visual with Subtle Ken-Burns */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1800&auto=format&fit=crop"
            alt="Majestic mountains of India"
            loading="lazy"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pinedark via-pinedark/90 to-pinedark/75" />
        </div>

        {/* Content Container */}
        <div className="relative p-8 sm:p-12 lg:p-20 text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs font-bold text-sand uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-sand" />
            Begin Your Indian Yatra
          </div>

          {/* Main Headline */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] text-white tracking-tight">
            Your next journey starts here.
          </h2>

          {/* Subtitle */}
          <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
            Slow, thoughtful journeys across India with private sanitized vehicles, handpicked
            boutique stays, and a personal travel designer on call 24×7.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/explore')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto text-sm lg:text-base font-extrabold px-8 py-4 !rounded-2xl"
            >
              Explore Trips
            </Button>

            <Button
              variant="ghostlight"
              size="lg"
              onClick={onOpenConcierge}
              leftIcon={<MessageSquare className="w-4 h-4" />}
              className="w-full sm:w-auto text-sm lg:text-base font-bold px-7 py-4 !rounded-2xl border border-white/20 hover:bg-white/10"
            >
              Talk to Concierge
            </Button>
          </div>

          {/* Trust Value Propositions */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sand" />
              100% Verified Boutique Stays
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sand" />
              Free Cancellation in 48h
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-sand" />
              24×7 WhatsApp Concierge
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
