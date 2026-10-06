import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { Region } from '../types';
import { DestinationCard } from '../components/travel/DestinationCard';
import { Tabs } from '../components/ui/Tabs';

export const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regionTabs = [
    { id: 'all', label: 'All India', count: DESTINATIONS.length },
    { id: 'North', label: 'North India', count: DESTINATIONS.filter((d) => d.region === 'North').length },
    { id: 'South', label: 'South India', count: DESTINATIONS.filter((d) => d.region === 'South').length },
    { id: 'West', label: 'West India', count: DESTINATIONS.filter((d) => d.region === 'West').length },
    { id: 'Islands', label: 'Islands', count: DESTINATIONS.filter((d) => d.region === 'Islands').length },
  ];

  const filteredDestinations =
    selectedRegion === 'all'
      ? DESTINATIONS
      : DESTINATIONS.filter((d) => d.region === (selectedRegion as Region));

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-pinedark text-white relative overflow-hidden py-14 lg:py-20">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1800&auto=format&fit=crop"
          alt="Indian landscape"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pinedark/60 to-pinedark" />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand mb-2">
            Curated Circuits · 8 Epic Regions
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-semibold tracking-tight">
            India, felt deeply.
            <br />
            <span className="italic text-sandlight font-medium">Travelled softly.</span>
          </h1>
          <p className="text-white/75 text-sm lg:text-base mt-4 max-w-xl leading-relaxed">
            From the tea-scented hills of Munnar to Pangong’s crystalline waters. Handpicked boutique
            stays, rested drivers, and private curated moments in each circuit.
          </p>
        </div>
      </section>

      {/* Tabs & Grid */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 space-y-8">
        <div className="flex justify-center sm:justify-start">
          <Tabs
            tabs={regionTabs}
            activeTab={selectedRegion}
            onChange={setSelectedRegion}
            variant="pills"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>
    </div>
  );
};
