import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';
import { formatINR } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DestinationsSection: React.FC = () => {
  const navigate = useNavigate();

  // Specifically select the required 6 featured destinations:
  // Goa, Manali, Coorg, Jaipur, Kerala, Kashmir
  const targetIds = ['kerala', 'goa', 'kashmir', 'jaipur', 'manali', 'coorg'];
  const featuredDestinations = targetIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter(Boolean) as typeof DESTINATIONS;

  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
            01 — Curated Destinations
          </div>
          <h2 className="font-display text-3xl lg:text-[44px] leading-tight font-semibold tracking-tight text-ink">
            Where will comfort
            <br />
            take you next?
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/destinations')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          View all 8 Indian circuits
        </Button>
      </div>

      {/* Grid of 6 Featured Destinations: 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredDestinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => navigate(`/destination/${dest.slug}`)}
            className="group relative rounded-[28px] overflow-hidden h-[380px] lg:h-[420px] shadow-card hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-18px_rgba(21,33,30,0.28)] transition-all duration-500 cursor-pointer bg-cream2"
          >
            {/* Destination Image with Zoom on Hover */}
            <img
              src={dest.image}
              alt={dest.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300" />

            {/* Region Pill (Top Left) */}
            <div className="absolute top-4 left-4">
              <Badge variant="white" size="sm" className="font-bold">
                {dest.region} India
              </Badge>
            </div>

            {/* Interactive Corner Arrow (Top Right) */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-sand group-hover:text-ink transition-all duration-300 shadow-sm">
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            {/* Card Content & Interactive Hover (Bottom) */}
            <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-sand text-sand" />
                <span>{dest.rating}</span>
                <span className="opacity-70 font-medium">
                  ({dest.reviews.toLocaleString()} reviews)
                </span>
              </div>

              <h3 className="font-display text-2xl lg:text-3xl font-semibold leading-tight text-white group-hover:text-sandlight transition-colors">
                {dest.name}
              </h3>

              <p className="text-white/80 text-xs font-medium line-clamp-1">
                {dest.tagline}
              </p>

              {/* Bottom interactive metadata */}
              <div className="flex items-center justify-between pt-3 border-t border-white/20 text-xs font-bold">
                <span className="text-white/90">
                  {dest.trips} curated trips · from {formatINR(dest.priceFrom)}
                </span>
                <span className="text-sand group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                  Explore →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
