import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface MyTripsEmptyStateProps {
  type: 'upcoming' | 'completed' | 'cancelled' | 'all';
  onExplore?: () => void;
}

export const MyTripsEmptyState: React.FC<MyTripsEmptyStateProps> = ({ type, onExplore }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onExplore) {
      onExplore();
    } else {
      navigate('/explore');
    }
  };

  switch (type) {
    case 'upcoming':
      return (
        <div className="bg-white rounded-3xl border border-sand-dark/25 p-10 md:p-14 text-center max-w-xl mx-auto shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-pine/10 text-pine flex items-center justify-center mx-auto mb-5">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Your next adventure is waiting.
          </h3>
          <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            You don't have any upcoming trips scheduled. Discover handpicked boutique stays, private tea trails, and soulful journeys crafted for pure comfort.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAction}
              className="bg-pine hover:bg-pinedark text-white font-medium"
            >
              Explore Trips
            </Button>
          </div>
        </div>
      );

    case 'completed':
      return (
        <div className="bg-white rounded-3xl border border-sand-dark/25 p-10 md:p-14 text-center max-w-xl mx-auto shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Your travel memories will appear here.
          </h3>
          <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Completed journeys are archived here with access to past itineraries, tax invoices, and traveler review submissions.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={handleAction}
              className="border-pine/30 text-pine hover:bg-pine/5"
            >
              Discover Journeys
            </Button>
          </div>
        </div>
      );

    case 'cancelled':
      return (
        <div className="bg-white rounded-3xl border border-sand-dark/25 p-10 md:p-14 text-center max-w-xl mx-auto shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Nothing here — that's a good thing.
          </h3>
          <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            You have no cancelled journeys on record. All your planned trips are smooth and on track!
          </p>
        </div>
      );

    default:
      return (
        <div className="bg-white rounded-3xl border border-sand-dark/25 p-10 md:p-14 text-center max-w-xl mx-auto shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-pine/10 text-pine flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            No journeys booked yet.
          </h3>
          <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Ready to embark on a restful escape? Find your next curated journey with SukhYatri.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAction}
              className="bg-pine hover:bg-pinedark text-white"
            >
              Explore Packages
            </Button>
          </div>
        </div>
      );
  }
};
