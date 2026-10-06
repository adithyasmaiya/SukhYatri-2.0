import React from 'react';
import { BedDouble, Sparkles, Check, ShieldCheck } from 'lucide-react';
import { TripAccommodation } from '../../types';
import { Badge } from '../ui/Badge';

export interface AccommodationSectionProps {
  accommodation?: TripAccommodation;
  destinationName?: string;
}

export const AccommodationSection: React.FC<AccommodationSectionProps> = ({
  accommodation,
  destinationName = 'Destination',
}) => {
  // Curated fallback if specific package doesn't have an explicit accommodation object
  const data: TripAccommodation = accommodation || {
    name: `${destinationName} Heritage Boutique Retreat`,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    category: '4★+ Handpicked Boutique / Heritage Stay',
    amenities: [
      'Daily Artisanal Breakfast',
      'Free High-Speed Wi-Fi',
      'Scenic Balcony & Garden View',
      '24×7 Concierge Desk',
      'Ayurvedic Wellness Spa',
      'Eco-Certified Sustainable Stay',
    ],
    shortDescription: `Handpicked boutique property tested by SukhYatri travel editors. Enjoy calm ambient spaces, serene green surroundings, spotless hygiene standards, and heartfelt local hospitality.`,
  };

  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BedDouble className="w-4 h-4 text-pine" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-muted">
            Handpicked Stays
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Where You’ll Stay
        </h2>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Every partner hotel undergoes a 32-point inspection for comfort, cleanliness, and character.
        </p>
      </div>

      <div className="bg-white border border-stonewarm rounded-3xl overflow-hidden shadow-sm hover:shadow-card transition-shadow grid md:grid-cols-12 gap-0">
        {/* Hotel Image (5 cols) */}
        <div className="md:col-span-5 relative h-56 sm:h-64 md:h-full min-h-[220px]">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="pine">Verified Stay</Badge>
          </div>
        </div>

        {/* Hotel Details (7 cols) */}
        <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-moss bg-mosslight px-2.5 py-0.5 rounded-full">
                {data.category}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
              {data.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#3A4542] leading-relaxed mt-2.5">
              {data.shortDescription}
            </p>
          </div>

          {/* Amenities grid */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
              Key Stay Amenities
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs font-semibold text-ink bg-cream2/60 px-3 py-1.5 rounded-xl border border-stonewarm/40"
                >
                  <Check className="w-3.5 h-3.5 text-moss shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stonewarm/60 flex items-center justify-between text-xs text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-moss" />
              SukhYatri Quality Guaranteed
            </span>
            <span className="text-pine font-bold text-[11px]">Upgrades Available On Request</span>
          </div>
        </div>
      </div>
    </section>
  );
};
