import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, MapPin, Check } from 'lucide-react';
import { apiService } from '../services/api';
import { Destination, TripPackage } from '../types';
import { TripCard } from '../components/travel/TripCard';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { ConciergeModal } from '../components/travel/ConciergeModal';
import { DestinationHero } from '../components/destination/DestinationHero';
import { ExperienceCard } from '../components/destination/ExperienceCard';
import { DestinationGallery } from '../components/destination/DestinationGallery';
import { TravelInfoSection } from '../components/destination/TravelInfoSection';
import { DestinationFaq } from '../components/destination/DestinationFaq';
import { DestinationCta } from '../components/destination/DestinationCta';
import { useSEO } from '../hooks/useSEO';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<TripPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  useSEO({
    title: destination ? `${destination.name} Luxury Guide | SukhYatri` : 'Destination Guide | SukhYatri',
    description: destination?.shortDescription || destination?.description?.slice(0, 155) || 'Discover quintessential travel destinations with SukhYatri.',
    image: destination?.heroImage,
    canonical: destination ? `${window.location.origin}/destinations/${destination.slug || slug}` : undefined,
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (slug) {
      apiService.getDestinationBySlug(slug).then((dest) => {
        if (!mounted) return;
        setDestination(dest);

        if (dest) {
          // Fetch all packages and strictly filter by destination
          apiService.getPackages().then((allPkgs) => {
            if (mounted) {
              const matching = allPkgs.filter(
                (p) =>
                  (p.destination && p.destination.toLowerCase() === dest.name.toLowerCase()) ||
                  (p.destName && p.destName.toLowerCase() === dest.name.toLowerCase()) ||
                  (p.destId && p.destId.toLowerCase() === dest.id.toLowerCase()) ||
                  (dest.relatedTripIds && dest.relatedTripIds.includes(p.id))
              );
              setPackages(matching);
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <LoadingState message="Gathering curated destination details…" />;
  }

  // Error / Invalid destination slug handling
  if (!destination) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-5">
        <ErrorState
          title="Destination Not Found"
          message={`We could not find a destination matching "${slug}". Browse all our handcrafted Indian circuits to pick your journey.`}
          onRetry={() => navigate('/destinations')}
        />
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate('/explore')}>
            Explore All Trips Instead
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. Cinematic Destination Hero */}
      <DestinationHero destination={destination} tripsCount={packages.length} />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 space-y-16 lg:space-y-24">
        {/* 2. Destination Intro */}
        <section className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-10 shadow-card">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
                About The Region
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
                Discover {destination.name}
              </h2>
              <p className="text-[#3A4542] text-sm sm:text-base leading-relaxed">
                {destination.description || destination.desc}
              </p>

              {/* Highlights List */}
              <div className="pt-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted mb-3">
                  Signature Highlights
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(destination.travelHighlights || destination.highlights || []).map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-bold text-ink">
                      <div className="w-5 h-5 rounded-full bg-mosslight text-moss flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Intro Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-lift h-[320px] bg-cream2">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6 text-white">
                <div>
                  <div className="text-xs font-bold text-sand uppercase tracking-wider">
                    {destination.region} India
                  </div>
                  <div className="font-display text-xl font-bold mt-0.5">
                    {destination.name} with SukhYatri
                  </div>
                  <div className="text-xs text-white/80 mt-1">
                    Boutique verified stays &amp; private transit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Experiences Section */}
        {destination.experiences && destination.experiences.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-1">
                  Handcrafted Moments
                </div>
                <h3 className="font-display text-3xl font-semibold text-ink">
                  Experiences in {destination.name}
                </h3>
              </div>
              <p className="text-xs text-muted max-w-sm sm:text-right">
                Thoughtfully arranged slow encounters you won't find on regular tourist trails.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destination.experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Popular Trips Related to Destination */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-1">
                Curated Routes
              </div>
              <h3 className="font-display text-3xl font-semibold text-ink">
                Popular {destination.name} Trips ({packages.length})
              </h3>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/explore?destination=${encodeURIComponent(destination.name)}`)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View all {destination.name} trips
            </Button>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <TripCard key={pkg.id} trip={pkg} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stonewarm p-8 text-center space-y-3">
              <p className="text-muted text-sm">
                Custom itineraries for {destination.name} are available upon request.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate(`/explore?destination=${encodeURIComponent(destination.name)}`)}
              >
                Browse All Destinations
              </Button>
            </div>
          )}
        </section>

        {/* 5. Destination Gallery */}
        {destination.gallery && destination.gallery.length > 0 && (
          <DestinationGallery
            images={destination.gallery}
            destinationName={destination.name}
          />
        )}

        {/* 6. Travel Information Section */}
        <TravelInfoSection destination={destination} />

        {/* 7. FAQ Accordion */}
        {destination.faqs && destination.faqs.length > 0 && (
          <DestinationFaq
            faqs={destination.faqs}
            destinationName={destination.name}
          />
        )}

        {/* 8. Destination CTA */}
        <DestinationCta
          destinationName={destination.name}
          onOpenConcierge={() => setIsConciergeOpen(true)}
        />
      </div>

      {/* Concierge Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        destinationHint={destination.name}
      />
    </div>
  );
};
