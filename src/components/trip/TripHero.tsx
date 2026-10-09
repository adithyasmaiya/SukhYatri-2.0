import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Share2, Clock, Users, Plane, Star, MapPin } from 'lucide-react';
import { TripPackage } from '../../types';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export interface TripHeroProps {
  trip: TripPackage;
}

export const TripHero: React.FC<TripHeroProps> = ({ trip }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const wished = isWishlisted(trip.id);

  const destinationName = trip.destination || trip.destName || (trip as any).destinationName || 'India';
  const reviewCount = trip.reviewCount || trip.reviewsCount || 48;
  const durationText = trip.duration || `${trip.nights || 5}N / ${trip.days || 6}D`;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('Trip link copied to clipboard!', 'info');
    }
  };

  const handleWishlist = () => {
    toggleWishlist(trip.id);
    toast(wished ? `Removed <b>${trip.title}</b> from wishlist` : `Saved <b>${trip.title}</b> to wishlist ♥`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between text-xs font-semibold text-muted">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-pine transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/explore" className="hover:text-pine transition">
            Trips
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/destination/${trip.destId || (destinationName ? destinationName.toLowerCase() : 'all')}`} className="hover:text-pine transition">
            {destinationName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink font-bold truncate max-w-[180px] sm:max-w-xs">
            {trip.title}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWishlist}
            className={`p-2.5 rounded-full border border-stonewarm transition shadow-sm ${
              wished ? 'bg-clay text-white border-clay' : 'bg-white hover:bg-cream2 text-ink'
            }`}
            aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full border border-stonewarm bg-white hover:bg-cream2 text-ink transition shadow-sm"
            aria-label="Share trip link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Badges & Title */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {trip.bestseller && <Badge variant="sand">★ Bestseller</Badge>}
          {trip.tag && <Badge variant="mosslight">{trip.tag}</Badge>}
          {trip.travelStyle && (
            <Badge variant="white">
              {Array.isArray(trip.travelStyle) ? trip.travelStyle.join(' · ') : trip.travelStyle}
            </Badge>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight leading-tight">
          {trip.title}
        </h1>

        {/* Metas Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted pt-1">
          <div className="flex items-center gap-1.5 text-ink">
            <MapPin className="w-3.5 h-3.5 text-moss" />
            <span className="font-bold">{destinationName}</span>
            {trip.state && <span>, {trip.state}</span>}
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 text-ink">
            <RatingStars rating={trip.rating} count={reviewCount} size="sm" />
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 text-ink">
            <Clock className="w-3.5 h-3.5 text-pine" />
            <span>{durationText}</span>
          </div>
          {trip.group && (
            <>
              <span>·</span>
              <div className="flex items-center gap-1 text-ink">
                <Users className="w-3.5 h-3.5 text-pine" />
                <span>{trip.group}</span>
              </div>
            </>
          )}
          {trip.pickup && (
            <>
              <span>·</span>
              <div className="flex items-center gap-1 text-ink">
                <Plane className="w-3.5 h-3.5 text-pine" />
                <span>Pickup: {trip.pickup}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
