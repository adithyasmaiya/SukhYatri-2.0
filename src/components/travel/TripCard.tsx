import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Users, ArrowRight } from 'lucide-react';
import { TripPackage } from '../../types';
import { formatINR, calculateDiscount } from '../../utils/format';
import { RatingStars } from '../ui/RatingStars';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export interface TripCardProps {
  trip: TripPackage;
  compact?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const wished = isWishlisted(trip.id);
  const origPrice = trip.originalPrice || trip.mrp || trip.price;
  const discountPercent =
    trip.discount !== undefined ? trip.discount : calculateDiscount(trip.price, origPrice);
  const destinationText = trip.destination || trip.destName;
  const shortDesc = trip.shortDescription || trip.desc;
  const durationText = trip.duration || `${trip.nights}N / ${trip.days}D`;
  const reviewCountNum = trip.reviewCount || trip.reviewsCount;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(trip.id);
    toast(
      wished
        ? `Removed <b>${trip.title}</b> from wishlist`
        : `Saved <b>${trip.title}</b> to wishlist ♥`,
      'info'
    );
  };

  const handleNavigate = () => {
    navigate(`/trip/${trip.slug}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="bg-white rounded-[24px] overflow-hidden border border-stonewarm shadow-card hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-18px_rgba(21,33,30,0.22)] transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Image Banner */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          {trip.bestseller && <Badge variant="sand">Bestseller</Badge>}
          {trip.tag && <Badge variant="white">{trip.tag}</Badge>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
            wished ? 'bg-clay text-white' : 'bg-white/90 backdrop-blur-sm text-ink hover:text-clay'
          }`}
          aria-label={wished ? `Remove ${trip.title} from wishlist` : `Save ${trip.title} to wishlist`}
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Image Stats */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
          <Badge variant="outline" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            {durationText}
          </Badge>
          {discountPercent > 0 && (
            <Badge variant="white" size="sm" className="font-extrabold text-pine">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs font-bold text-muted">
          <span className="text-moss">
            ● {destinationText}
            {trip.state ? `, ${trip.state}` : ''}
          </span>
          {trip.group && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> {trip.group}
              </span>
            </>
          )}
        </div>

        <h3 className="font-display text-[19px] leading-snug font-semibold text-ink mt-2 group-hover:text-moss transition-colors">
          {trip.title}
        </h3>

        <div className="mt-2.5">
          <RatingStars rating={trip.rating} count={reviewCountNum} size="sm" />
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#3A4542] mt-2.5 line-clamp-2 leading-relaxed">
          {shortDesc}
        </p>

        {/* Themes / Styles */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {Array.isArray(trip.travelStyle) ? (
            trip.travelStyle.slice(0, 2).map((s) => (
              <span
                key={s}
                className="text-[11px] font-bold bg-mosslight text-moss rounded-full px-2.5 py-0.5"
              >
                {s}
              </span>
            ))
          ) : trip.travelStyle ? (
            <span className="text-[11px] font-bold bg-mosslight text-moss rounded-full px-2.5 py-0.5">
              {trip.travelStyle}
            </span>
          ) : null}
          {trip.themes?.slice(0, 2).map((theme) => (
            <span
              key={theme}
              className="text-[11px] font-bold bg-cream2 text-pine rounded-full px-2.5 py-0.5"
            >
              {theme}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-stonewarm flex items-end justify-between">
          <div>
            {origPrice > trip.price && (
              <div className="text-xs text-muted line-through font-semibold">
                {formatINR(origPrice)}
              </div>
            )}
            <div className="font-extrabold text-xl text-ink">
              {formatINR(trip.price)}{' '}
              <span className="text-xs font-semibold text-muted">/ person</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            aria-label={`View Trip: ${trip.title}`}
          >
            View Trip
          </Button>
        </div>
      </div>
    </div>
  );
};
