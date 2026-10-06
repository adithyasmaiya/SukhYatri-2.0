import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { DestinationsSection } from '../components/home/DestinationsSection';
import { TrendingTripsSection } from '../components/home/TrendingTripsSection';
import { WhySukhYatriSection } from '../components/home/WhySukhYatriSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TravelInspirationSection } from '../components/home/TravelInspirationSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ConciergeModal } from '../components/travel/ConciergeModal';
import { MessageSquareText } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const HomePage: React.FC = () => {
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  useSEO({
    title: 'SukhYatri — Travel in Comfort. Arrive in Joy.',
    description: 'SukhYatri 2.0 — Curated Indian journeys with handpicked stays, private drivers, and a 24x7 personal travel concierge.',
    canonical: window.location.origin + '/',
  });

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Cinematic Hero with Search Widget */}
      <HeroSection />

      {/* 2. Popular Destinations (Goa, Manali, Coorg, Jaipur, Kerala, Kashmir) */}
      <ScrollReveal>
        <DestinationsSection />
      </ScrollReveal>

      {/* 3. Trending Trips (Reusable TripCard grid) */}
      <ScrollReveal>
        <TrendingTripsSection />
      </ScrollReveal>

      {/* 4. Why SukhYatri (Pillars & Trust stats) */}
      <ScrollReveal>
        <WhySukhYatriSection />
      </ScrollReveal>

      {/* 5. How It Works (4-step visual flow: Discover, Choose, Book, Travel) */}
      <ScrollReveal>
        <HowItWorksSection />
      </ScrollReveal>

      {/* 6. Travel Inspiration (Editorial Magazine-style) */}
      <ScrollReveal>
        <TravelInspirationSection />
      </ScrollReveal>

      {/* 7. Premium Verified Customer Testimonials */}
      <ScrollReveal>
        <TestimonialsSection />
      </ScrollReveal>

      {/* 8. Final CTA ("Your next journey starts here.") */}
      <ScrollReveal>
        <FinalCtaSection onOpenConcierge={() => setIsConciergeOpen(true)} />
      </ScrollReveal>

      {/* Floating Travel Designer / Concierge Quick Trigger */}
      <button
        type="button"
        onClick={() => setIsConciergeOpen(true)}
        aria-label="Talk to travel concierge"
        className="fixed bottom-6 right-6 z-40 bg-pine text-white p-3.5 rounded-full shadow-lift hover:bg-moss hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group border border-white/20"
      >
        <MessageSquareText className="w-5 h-5 text-sand" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-1">
          Travel Concierge
        </span>
      </button>

      {/* Concierge Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />
    </div>
  );
};
