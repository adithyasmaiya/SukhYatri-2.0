import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Star } from 'lucide-react';
import { Destination } from '../../types';
import { formatINR } from '../../utils/format';
import { Badge } from '../ui/Badge';

export interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/destination/${destination.slug}`)}
      className="relative rounded-[26px] overflow-hidden h-[420px] shadow-card hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-18px_rgba(21,33,30,0.28)] transition-all duration-300 cursor-pointer group"
    >
      <img
        src={destination.image}
        alt={destination.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4">
        <Badge variant="white">{destination.region} India</Badge>
      </div>

      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-sand group-hover:text-ink transition-colors duration-300">
        <ArrowUpRight className="w-5 h-5" />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 inset-x-0 p-6 text-white">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-sand text-sand" />
          <span>{destination.rating}</span>
          <span className="opacity-70 font-medium">
            ({destination.reviews.toLocaleString()} reviews)
          </span>
        </div>

        <h3 className="font-display text-[28px] font-semibold text-white mt-1 leading-tight">
          {destination.name}
        </h3>
        <p className="text-white/75 text-xs font-medium mt-1 line-clamp-1">
          {destination.tagline}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/20 text-xs font-bold">
          <span>
            {destination.trips} trips · from {formatINR(destination.priceFrom)}
          </span>
          <span className="text-sand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Explore →
          </span>
        </div>
      </div>
    </div>
  );
};
