export type Region = 'North' | 'South' | 'West' | 'East' | 'Islands';

export type TravelTheme =
  | 'Slow & Relaxed'
  | 'Adventure'
  | 'Heritage & Culture'
  | 'Honeymoon'
  | 'Family'
  | 'Spiritual'
  | 'Luxury'
  | 'Nature'
  | 'Romantic'
  | 'Cultural';

export type TravelStyle =
  | 'Adventure'
  | 'Relaxation'
  | 'Family'
  | 'Romantic'
  | 'Cultural'
  | 'Luxury'
  | 'Nature';

export type DurationFilter = '1-3' | '4-6' | '7-10' | '10+' | '';

export type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'duration-asc'
  | 'duration-desc';

export interface DestinationExperience {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
}

export interface DestinationFaq {
  question: string;
  answer: string;
}

export interface TripAccommodation {
  name: string;
  image: string;
  category: string;
  amenities: string[];
  shortDescription: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  state: string;
  region: Region;
  image: string;
  heroImage: string;
  tagline: string;
  shortDescription: string;
  description: string;
  desc: string;
  rating: number;
  reviews: number;
  trips: number;
  bestTime: string;
  bestTimeToVisit: string;
  ideal: string;
  recommendedDuration: string;
  priceFrom: number;
  travelHighlights: string[];
  highlights: string[];
  experiences: DestinationExperience[];
  gallery: string[];
  faqs: DestinationFaq[];
  relatedTripIds: string[];
  travelStyle?: string;
  popularActivities?: string[];
  generalTravelTips?: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  stay: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  location?: string;
}

export interface TripPackage {
  id: string;
  slug: string;
  title: string;
  destination: string;
  destName: string;
  destId: string;
  state: string;
  days: number;
  nights: number;
  duration: string;
  price: number;
  mrp: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  travelStyle: TravelStyle | TravelStyle[];
  themes: TravelTheme[];
  group: string;
  pickup: string;
  bestseller?: boolean;
  tag?: string;
  shortDescription: string;
  desc: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  reviews: Review[];
  accommodation?: TripAccommodation;
  bestTime?: string;
}

export interface CuratedExperience {
  id: string;
  title: string;
  description: string;
  image: string;
  tag?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  description: string;
  date: string;
}

export interface AddonOption {
  id: string;
  title: string;
  price: number;
  description: string;
}

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'payment_failed'
  | 'Confirmed'
  | 'Pending'
  | 'Cancelled'
  | 'Completed'
  | 'Pending Payment'
  | 'Payment Failed';

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'Paid'
  | 'Pending'
  | 'Failed';

export type RefundStatus = 'not_applicable' | 'initiated' | 'processing' | 'refunded';

export interface PrimaryTraveller {
  name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  country?: string;
  specialRequests?: string;
}

export interface AdditionalTraveller {
  name: string;
  age?: number | string;
  gender?: string;
}

export interface Booking {
  id: string;
  bookingId?: string;
  userId?: string;
  packageId: string;
  packageTitle: string;
  packageImage: string;
  destName: string;
  destination?: string;
  travelDate: string;
  endDate?: string;
  duration?: string;
  slot?: string;
  travellers: number;
  adults?: number;
  children?: number;
  rooms?: number;
  roomCategory?: 'Deluxe' | 'Luxury' | 'Suite' | string;
  leadGuest: PrimaryTraveller;
  primaryTraveller?: PrimaryTraveller;
  additionalTravellers?: AdditionalTraveller[];
  addons?: string[];
  couponApplied?: string;
  couponCode?: string;
  baseAmount: number;
  addonsAmount?: number;
  roomUpgradeAmount?: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid?: number;
  tokenPaid?: number;
  status: BookingStatus;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  paymentMethod: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancellationFee?: number;
  cancellationRefundAmount?: number;
  refundStatus?: RefundStatus;
  reviewSubmitted?: boolean;
  review?: {
    rating: number;
    title: string;
    text: string;
    createdAt: string;
  };
}

export type UserRole = 'user' | 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  role: UserRole;
  tier?: 'Bronze' | 'Silver' | 'Gold';
  sukhCoins?: number;
}

export interface AdminKPI {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  tripsCount: number;
  lifetimeValue: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  lastActive: string;
}
