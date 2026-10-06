import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Star, MapPin } from 'lucide-react';
import { Destination } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatINR } from '../../utils/format';

export interface DestinationHeroProps {
  destination: Destination;
  tripsCount: number;
}

export const DestinationHero: React.FC<DestinationHeroProps> = ({
  destination,
  tripsCount,
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[58vh] lg:min-h-[70vh] flex flex-col justify-between overflow-hidden bg-pinedark text-white">
      {/* Background Cinematic Visual */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={destination.heroImage || destination.image}
          alt={destination.name}
          className="w-full h-full object-cover scale-105 animate-[pulse_16s_ease-in-out_infinite] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pinedark via-black/45 to-black/60" />
      </div>

      {/* Top Breadcrumb Navigation */}
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 lg:px-8 pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-white/70">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/destinations" className="hover:text-white transition">
            Destinations
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-sand font-bold">{destination.name}</span>
        </nav>
      </div>

      {/* Hero Body */}
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 lg:px-8 pb-12 pt-16">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="sand" size="sm">
              <MapPin className="w-3 h-3 mr-1" /> {destination.state || `${destination.region} India`}
            </Badge>
            <Badge variant="outline" size="sm">
              ★ {destination.rating} · ({destination.reviews.toLocaleString()} reviews)
            </Badge>
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase text-white leading-none">
            {destination.name}
          </h1>

          <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
            {destination.shortDescription || destination.tagline}
          </p>

          {/* CTA & Quick Metas */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate(`/explore?destination=${encodeURIComponent(destination.name)}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="!rounded-2xl font-extrabold text-sm px-7 py-3.5 shadow-lift"
            >
              Explore {destination.name} Trips
            </Button>

            <span className="text-xs text-white/80 font-semibold pl-1">
              Starting from{' '}
              <strong className="text-white text-sm font-extrabold">
                {formatINR(destination.priceFrom)}
              </strong>{' '}
              / person · {tripsCount} curated routes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
