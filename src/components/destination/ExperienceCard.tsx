import React from 'react';
import { DestinationExperience } from '../../types';

export interface ExperienceCardProps {
  experience: DestinationExperience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <div className="group bg-white rounded-3xl border border-stonewarm overflow-hidden shadow-card hover:-translate-y-1 hover:shadow-lift transition-all duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-cream2">
        <img
          src={experience.image}
          alt={experience.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
        <h4 className="font-display font-semibold text-lg text-ink group-hover:text-pine transition-colors leading-snug">
          {experience.title}
        </h4>
        <p className="text-xs text-[#3A4542] leading-relaxed line-clamp-3">
          {experience.shortDescription}
        </p>
      </div>
    </div>
  );
};
