import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, ArrowLeft, MapPin, ShieldAlert, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface NotFoundPageProps {
  type?: 'general' | 'trip' | 'destination' | 'booking' | 'admin';
  title?: string;
  message?: string;
  returnPath?: string;
  returnLabel?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  type = 'general',
  title,
  message,
  returnPath,
  returnLabel,
}) => {
  const navigate = useNavigate();

  const configs = {
    general: {
      badge: '404 — Page Not Found',
      title: title || 'This trail leads nowhere',
      message:
        message ||
        'The page you are searching for might have shifted to a different circuit or is currently under seasonal maintenance.',
      icon: <Compass className="w-10 h-10 text-moss" />,
      primaryPath: returnPath || '/',
      primaryLabel: returnLabel || 'Back to Homepage',
      secondaryPath: '/explore',
      secondaryLabel: 'Explore Journeys',
    },
    trip: {
      badge: '404 — Trip Package Not Found',
      title: title || 'Itinerary Not Available',
      message:
        message ||
        'This curated travel itinerary may have concluded its seasonal window or been moved to our archives.',
      icon: <Compass className="w-10 h-10 text-pine" />,
      primaryPath: returnPath || '/explore',
      primaryLabel: returnLabel || 'Browse Available Trips',
      secondaryPath: '/destinations',
      secondaryLabel: 'View Destinations',
    },
    destination: {
      badge: '404 — Destination Not Found',
      title: title || 'Destination Not Found',
      message:
        message ||
        'We could not locate this destination sanctuary. Discover our other handcrafted regions across India.',
      icon: <MapPin className="w-10 h-10 text-moss" />,
      primaryPath: returnPath || '/destinations',
      primaryLabel: returnLabel || 'Explore Destinations',
      secondaryPath: '/explore',
      secondaryLabel: 'View Curated Packages',
    },
    booking: {
      badge: '404 — Reservation Not Found',
      title: title || 'Booking Not Found',
      message:
        message ||
        'We could not locate this reservation record. Please verify the booking reference in your My Trips dashboard.',
      icon: <Calendar className="w-10 h-10 text-clay" />,
      primaryPath: returnPath || '/my-trips',
      primaryLabel: returnLabel || 'View My Trips',
      secondaryPath: '/explore',
      secondaryLabel: 'Plan a New Journey',
    },
    admin: {
      badge: '404 — Admin Resource Not Found',
      title: title || 'Administrative Page Not Found',
      message:
        message ||
        'The requested admin management resource does not exist or has been relocated.',
      icon: <ShieldAlert className="w-10 h-10 text-pine" />,
      primaryPath: returnPath || '/admin',
      primaryLabel: returnLabel || 'Back to Admin Dashboard',
      secondaryPath: '/',
      secondaryLabel: 'Customer Portal',
    },
  };

  const current = configs[type] || configs.general;

  return (
    <div className="max-w-md mx-auto py-20 px-5 text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-cream2 flex items-center justify-center mx-auto shadow-sm border border-sand-dark/20">
        {current.icon}
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand mb-2">
          {current.badge}
        </div>
        <h1 className="font-display text-3xl font-bold text-ink tracking-tight">
          {current.title}
        </h1>
        <p className="text-xs text-muted mt-2 leading-relaxed">
          {current.message}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
        <Button
          variant="primary"
          onClick={() => navigate(current.primaryPath)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="justify-center !rounded-xl"
        >
          {current.primaryLabel}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(current.secondaryPath)}
          className="justify-center !rounded-xl"
        >
          {current.secondaryLabel}
        </Button>
      </div>
    </div>
  );
};
