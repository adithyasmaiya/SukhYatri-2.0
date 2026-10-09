import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { TripPackage } from '../types';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { ConciergeModal } from '../components/travel/ConciergeModal';
import {
  TripHero,
  TripGallery,
  TripSummary,
  BookingCard,
  ItineraryTimeline,
  InclusionList,
  AccommodationSection,
  ReviewSection,
  TripFaqAccordion,
  RelatedTrips,
  MobileBookingBar,
} from '../components/trip';
import { useSEO } from '../hooks/useSEO';

export const TripDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripPackage | null>(null);
  const [allTrips, setAllTrips] = useState<TripPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [travellers, setTravellers] = useState(2);

  // Concierge Modal state
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  useSEO({
    title: trip ? `${trip.title} | SukhYatri` : 'Curating Journey | SukhYatri',
    description: trip?.shortDescription || trip?.description?.slice(0, 155) || 'Curated luxury travel itinerary with SukhYatri.',
    image: trip?.image || (trip as any)?.images?.[0],
    canonical: trip ? `${window.location.origin}/trips/${trip.slug || slug}` : undefined,
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (slug) {
      Promise.all([
        apiService.getPackageBySlug(slug),
        apiService.getPackages(),
      ])
        .then(([pkg, packages]) => {
          if (!mounted) return;
          setTrip(pkg || null);
          setAllTrips(packages || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('[TripDetailPage] Failed to load journey:', err);
          if (!mounted) return;
          setTrip(null);
          setLoading(false);
        });
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <LoadingState message="Curating journey details…" />;
  }

  if (!trip) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <ErrorState
          title="Journey Not Found"
          message="We could not find the journey you're looking for. It may have been updated or moved."
          onRetry={() => navigate('/explore')}
        />
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/booking/${trip.id}?date=${departureDate}&travellers=${travellers}`);
  };

  const destinationName = trip.destination || trip.destName || 'India';

  return (
    <div className="bg-cream/40 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 sm:space-y-10">
        {/* ================= TRIP HEADER / HERO ================= */}
        <TripHero trip={trip} />

        {/* ================= PHOTO GALLERY ================= */}
        <TripGallery
          primaryImage={trip.image}
          galleryImages={trip.gallery}
          title={trip.title}
        />

        {/* ================= MAIN CONTENT & DESKTOP STICKY BOOKING ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-10 lg:gap-12 items-start pb-24 lg:pb-12">
          {/* Left Column: Itinerary, Stays, Reviews, FAQs */}
          <div className="space-y-12">
            {/* Trip Overview & Badges */}
            <TripSummary trip={trip} />

            {/* Expandable Day-by-Day Itinerary */}
            <ItineraryTimeline
              itinerary={trip.itinerary}
              durationDays={trip.days}
            />

            {/* Inclusions vs Exclusions */}
            <InclusionList
              inclusions={trip.inclusions}
              exclusions={trip.exclusions}
            />

            {/* Handpicked Accommodation Section */}
            <AccommodationSection
              accommodation={trip.accommodation}
              destinationName={destinationName}
            />

            {/* Guest Reviews & Ratings Breakdown */}
            <ReviewSection
              rating={trip.rating}
              reviewCount={trip.reviewCount || trip.reviewsCount || 48}
              reviews={trip.reviews}
            />

            {/* Trip Specific FAQs */}
            <TripFaqAccordion />
          </div>

          {/* Right Column: Desktop Sticky Booking Card */}
          <BookingCard
            trip={trip}
            departureDate={departureDate}
            onDateChange={setDepartureDate}
            travellers={travellers}
            onTravellersChange={setTravellers}
            onBookNow={handleBookNow}
            onOpenConcierge={() => setIsConciergeOpen(true)}
          />
        </div>

        {/* ================= RELATED TRIPS ("You May Also Like") ================= */}
        <RelatedTrips
          currentTripId={trip.id}
          destination={destinationName}
          allTrips={allTrips}
        />
      </div>

      {/* ================= MOBILE FIXED BOTTOM BOOKING BAR ================= */}
      <MobileBookingBar
        price={trip.price}
        originalPrice={trip.mrp || trip.originalPrice}
        onBookNow={handleBookNow}
      />

      {/* Concierge Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        destinationHint={trip.title}
      />
    </div>
  );
};
