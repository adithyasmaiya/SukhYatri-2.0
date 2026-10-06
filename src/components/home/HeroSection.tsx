import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState('Flexible (Oct 2026 – Mar 2027)');
  const [travellers, setTravellers] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('search', destination);
    navigate(`/explore?${params.toString()}`);
  };

  const handleQuickTag = (destName: string) => {
    navigate(`/explore?search=${encodeURIComponent(destName)}`);
  };

  return (
    <section className="relative overflow-hidden bg-pinedark text-white pb-14 lg:pb-20 pt-12 lg:pt-20">
      {/* Cinematic Background Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop"
          alt="Majestic Indian landscape"
          className="w-full h-full object-cover opacity-45 scale-105 animate-[pulse_14s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pinedark/70 via-pinedark/40 to-pinedark" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-8">
        {/* Social Proof Pill Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <Badge variant="outline" size="md">
            <span className="w-2 h-2 rounded-full bg-sand inline-block animate-pulse" />
            12,400+ happy yatris hosted this year
          </Badge>
          <Badge variant="sand" size="md">
            ★ 4.9 Rated · Trusted Indian Travel Startup
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-semibold text-[3.2rem] lg:text-[5.4rem] leading-[1.03] max-w-4xl tracking-tight text-white">
          Travel in Comfort.
          <br />
          <span className="italic font-medium text-sandlight">Arrive in Joy.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-white/85 text-base lg:text-lg mt-5 max-w-2xl leading-relaxed">
          SukhYatri curates slow, soulful journeys across India — from mist-covered Kerala backwaters
          and cedarwood Kashmir houseboats to royal Jaipur havelis. Handpicked verified stays,
          private rested drivers, and a 24×7 travel concierge that cares for every detail.
        </p>

        {/* Prominent Travel Search Interface */}
        <div className="mt-9 bg-white rounded-[26px] p-3.5 lg:p-4 shadow-lift max-w-5xl text-ink">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.1fr_1.1fr_auto] gap-3"
          >
            {/* 1. Destination */}
            <div className="bg-cream2 rounded-2xl px-4 py-3">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">
                <MapPin className="w-3 h-3 text-pine" /> Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent font-bold w-full outline-none text-[14.5px] cursor-pointer text-ink"
              >
                <option value="">Anywhere in India</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Travel Dates */}
            <div className="bg-cream2 rounded-2xl px-4 py-3">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">
                <Calendar className="w-3 h-3 text-pine" /> Travel Dates
              </label>
              <select
                value={travelDates}
                onChange={(e) => setTravelDates(e.target.value)}
                className="bg-transparent font-bold w-full outline-none text-[14.5px] cursor-pointer text-ink"
              >
                <option>Flexible (Oct 2026 – Mar 2027)</option>
                <option>Oct – Nov 2026 (Festive Season)</option>
                <option>Dec – Jan 2027 (Winter Holidays)</option>
                <option>Feb – Mar 2027 (Spring Bloom)</option>
                <option>Apr – Jun 2027 (Summer Escapes)</option>
              </select>
            </div>

            {/* 3. Travellers */}
            <div className="bg-cream2 rounded-2xl px-4 py-3">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">
                <Users className="w-3 h-3 text-pine" /> Travellers
              </label>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-bold text-sm text-ink">
                  {travellers} {travellers === 1 ? 'Adult' : 'Adults'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTravellers((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-stonewarm flex items-center justify-center font-bold text-ink hover:bg-stonewarm/60 transition"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravellers((p) => Math.min(12, p + 1))}
                    className="w-7 h-7 rounded-full bg-pine text-white flex items-center justify-center font-bold hover:bg-moss transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="!rounded-2xl h-full py-4 text-[14.5px] font-extrabold w-full"
            >
              Explore Trips
            </Button>
          </form>

          {/* Quick Destination Tags */}
          <div className="flex flex-wrap items-center gap-2 px-2 pt-3.5 pb-1 text-xs">
            <span className="text-muted font-bold">Popular this season:</span>
            {['Goa', 'Kerala', 'Kashmir', 'Jaipur', 'Manali', 'Coorg'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleQuickTag(name)}
                className="bg-white border border-stonewarm text-ink rounded-full px-3 py-1 font-semibold hover:bg-pine hover:text-white transition duration-200"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Social Proof Key Numbers */}
        <div className="mt-10 flex flex-wrap items-center gap-8 text-white">
          <div>
            <div className="font-display text-3xl font-semibold">48+</div>
            <div className="text-white/70 text-xs font-semibold mt-0.5">Curated Indian routes</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="font-display text-3xl font-semibold">1.2L+</div>
            <div className="text-white/70 text-xs font-semibold mt-0.5">Yatris arrived in joy</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="font-display text-3xl font-semibold">4.9/5</div>
            <div className="text-white/70 text-xs font-semibold mt-0.5">Average verified rating</div>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex -space-x-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                alt="Traveller"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                alt="Traveller"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
                alt="Traveller"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </div>
            <div className="text-xs text-white/80 font-medium">
              Loved across
              <br />
              all 28 states
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Trust Strip */}
      <div className="relative bg-cream text-ink rounded-t-[32px] mt-12 py-4 px-5 lg:px-8 border-t border-stonewarm">
        <div className="max-w-[1280px] mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted shrink-0">
            As featured in
          </span>
          <div className="flex items-center gap-8 font-display text-base text-ink/75 font-semibold shrink-0">
            <span>Condé Nast Traveller</span>
            <span>·</span>
            <span>Travel + Leisure India</span>
            <span>·</span>
            <span>YourStory</span>
            <span>·</span>
            <span>Economic Times Travel</span>
            <span>·</span>
            <span>Nat Geo Traveller</span>
          </div>
        </div>
      </div>
    </section>
  );
};
