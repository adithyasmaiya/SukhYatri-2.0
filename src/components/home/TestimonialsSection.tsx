import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '../../data/testimonials';
import { RatingStars } from '../ui/RatingStars';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayedCount = 3;
  const maxIndex = Math.max(0, TESTIMONIALS.length - displayedCount);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const visibleTestimonials = TESTIMONIALS.slice(currentIndex, currentIndex + displayedCount);

  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
            06 — Guest Testimonials
          </div>
          <h2 className="font-display text-3xl lg:text-[44px] font-semibold tracking-tight text-ink leading-tight">
            Arrived in joy, literally
          </h2>
          <p className="text-muted text-xs lg:text-sm mt-2 max-w-lg leading-relaxed">
            Real stories from families, couples, and solo yatris who traded rushed sightseeing for
            unhurried comfort across India.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrev}
            aria-label="Previous testimonials"
            className="w-10 h-10 rounded-full border border-stonewarm bg-white text-ink hover:bg-pine hover:text-white hover:border-pine transition-all flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next testimonials"
            className="w-10 h-10 rounded-full border border-stonewarm bg-white text-ink hover:bg-pine hover:text-white hover:border-pine transition-all flex items-center justify-center shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleTestimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-[28px] border border-stonewarm p-7 shadow-card hover:-translate-y-1.5 hover:shadow-lift transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Background Decorative Quote Mark */}
            <div className="absolute top-4 right-4 text-stonewarm/35 pointer-events-none">
              <Quote className="w-12 h-12 rotate-180" />
            </div>

            <div>
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                <RatingStars rating={t.rating} size="sm" />
                <span className="text-xs font-bold text-pine ml-1.5">{t.rating}.0</span>
              </div>

              {/* Review Text */}
              <p className="text-ink/85 text-sm lg:text-[14.5px] leading-relaxed relative z-10 italic">
                “{t.text}”
              </p>
            </div>

            {/* Traveller Identity & Route */}
            <div className="mt-6 pt-5 border-t border-stonewarm/70">
              <div className="flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover border-2 border-sand shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-ink leading-snug">{t.name}</h4>
                  <p className="text-xs text-muted font-medium mt-0.5">{t.location}</p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-3.5 flex items-center justify-between text-[11px] font-bold text-moss">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-moss" />
                  Verified SukhYatri Guest
                </span>
                <span className="text-muted font-normal">Oct 2026</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate Rating Banner */}
      <div className="mt-8 bg-cream2 rounded-2xl p-4 border border-stonewarm flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-ink">
        <div className="flex items-center gap-2">
          <div className="flex text-sand">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-sand text-sand" />
            ))}
          </div>
          <span>
            <strong>4.9 / 5 Rating</strong> based on 8,200+ verified customer reviews
          </span>
        </div>
        <div className="text-muted">
          All reviews collected post-trip via encrypted guest feedback links.
        </div>
      </div>
    </section>
  );
};
