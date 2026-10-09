import { DESTINATIONS } from '../data/destinations';
import { PACKAGES } from '../data/packages';
import { ADMIN_CUSTOMERS, ADMIN_KPIS, INITIAL_ADMIN_BOOKINGS } from '../data/admin';
import { Booking, BookingStatus, Destination, Region, TravelStyle, TravelTheme, TripPackage } from '../types';
import { apiClient } from './apiClient';

export interface PackageFilters {
  search?: string;
  destination?: string;
  destinations?: string[];
  region?: Region;
  travelStyle?: TravelStyle | TravelStyle[];
  theme?: TravelTheme;
  themes?: TravelTheme[];
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  durations?: string[];
  departureSlot?: string;
  bestsellerOnly?: boolean;
  minRating?: number;
  sortBy?: 'popular' | 'rating' | 'price_low' | 'price_high' | 'duration_short' | 'newest';
  sort?: string;
}

export type ExploreFilterOptions = PackageFilters;

export function normalizeTripPackage(data: any): TripPackage {
  if (!data) return data;
  const images = Array.isArray(data.images) && data.images.length > 0 ? data.images : [];
  const primaryImage =
    data.image ||
    images[0] ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop';
  const gallery =
    Array.isArray(data.gallery) && data.gallery.length > 0
      ? data.gallery
      : images.length > 0
        ? images
        : [primaryImage];
  const destName = data.destination || data.destName || data.destinationName || 'India';
  const destId =
    data.destId ||
    data.destinationId ||
    (destName ? destName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'india');

  // Normalize accommodation
  let accommodation = data.accommodation;
  if (accommodation) {
    if (!accommodation.name || !Array.isArray(accommodation.amenities)) {
      accommodation = {
        name: accommodation.hotelName || accommodation.name || `${destName} Heritage Boutique Retreat`,
        image: accommodation.image || primaryImage,
        category: accommodation.tier || accommodation.category || '4★+ Handpicked Boutique / Heritage Stay',
        amenities:
          Array.isArray(accommodation.highlights) && accommodation.highlights.length > 0
            ? accommodation.highlights
            : Array.isArray(accommodation.amenities) && accommodation.amenities.length > 0
              ? accommodation.amenities
              : [
                  'Daily Artisanal Breakfast',
                  'Free High-Speed Wi-Fi',
                  'Scenic Balcony & Garden View',
                  '24×7 Concierge Desk',
                  'Ayurvedic Wellness Spa',
                  'Eco-Certified Sustainable Stay',
                ],
        shortDescription:
          accommodation.shortDescription ||
          `Handpicked boutique property tested by SukhYatri travel editors in ${destName}.`,
      };
    }
  }

  return {
    ...data,
    id: data.id || data._id || data.slug,
    destination: destName,
    destName,
    destId,
    image: primaryImage,
    gallery,
    price: typeof data.price === 'number' ? data.price : 24900,
    mrp: data.mrp || data.originalPrice || Math.round((data.price || 24900) * 1.15),
    originalPrice: data.originalPrice || data.mrp || Math.round((data.price || 24900) * 1.15),
    rating: data.rating || 4.8,
    reviewCount: data.reviewCount || data.reviewsCount || 48,
    reviewsCount: data.reviewsCount || data.reviewCount || 48,
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
    exclusions: Array.isArray(data.exclusions) ? data.exclusions : [],
    itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    accommodation,
    travelStyle: data.travelStyle || 'Relaxation',
    themes: Array.isArray(data.themes) ? data.themes : [],
  };
}

export const apiService = {
  // Destinations
  async getDestinations(): Promise<Destination[]> {
    try {
      const data = await apiClient.get<Destination[]>('/destinations');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn('[apiService] Falling back to local destinations data', e);
    }
    return DESTINATIONS;
  },

  async getDestinationBySlug(slug: string): Promise<Destination | null> {
    try {
      const data = await apiClient.get<Destination>(`/destinations/${slug.toLowerCase()}`);
      if (data) return data;
    } catch {
      // Fallback
    }
    const clean = slug.toLowerCase();
    const found = DESTINATIONS.find((d) => d.slug.toLowerCase() === clean || d.id.toLowerCase() === clean);
    return found || null;
  },

  // Trips / Packages
  async getPackages(filters: PackageFilters = {}): Promise<TripPackage[]> {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.destination) params.set('destination', filters.destination);
      if (filters.destinations && filters.destinations.length > 0) {
        params.set('destination', filters.destinations.join(','));
      }
      if (filters.travelStyle) {
        const styles = Array.isArray(filters.travelStyle) ? filters.travelStyle : [filters.travelStyle];
        params.set('style', styles.join(','));
      }
      if (filters.minPrice !== undefined) params.set('price_min', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.set('price_max', filters.maxPrice.toString());
      if (filters.minRating !== undefined) params.set('min_rating', filters.minRating.toString());
      if (filters.sortBy) params.set('sort', filters.sortBy);
      params.set('limit', '50');

      const data = await apiClient.get<TripPackage[]>(`/trips?${params.toString()}`);
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeTripPackage);
      }
    } catch (e) {
      console.warn('[apiService] Falling back to local packages data', e);
    }

    // Local client-side fallback
    let list = [...PACKAGES];
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.destination?.toLowerCase().includes(q) ||
          p.destName?.toLowerCase().includes(q)
      );
    }
    if (filters.destinations && filters.destinations.length > 0) {
      const targets = filters.destinations.map((d) => d.toLowerCase());
      list = list.filter((p) => targets.includes((p.destination || p.destName || '').toLowerCase()));
    }
    if (filters.minPrice !== undefined) list = list.filter((p) => p.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) list = list.filter((p) => p.price <= filters.maxPrice!);
    return list.map(normalizeTripPackage);
  },

  async getPackageBySlug(slug: string): Promise<TripPackage | null> {
    try {
      const data = await apiClient.get<any>(`/trips/${slug.toLowerCase()}`);
      if (data) return normalizeTripPackage(data);
    } catch {
      // Fallback
    }
    const clean = slug.toLowerCase();
    const pkg = PACKAGES.find((p) => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean);
    return pkg ? normalizeTripPackage(pkg) : null;
  },

  async getPackageById(id: string): Promise<TripPackage | null> {
    return this.getPackageBySlug(id);
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const data = await apiClient.get<Booking[]>('/bookings/my');
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback
    }
    return INITIAL_ADMIN_BOOKINGS;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const data = await apiClient.get<Booking>(`/bookings/${id}`);
      if (data) return data;
    } catch {
      // Fallback
    }
    const clean = id.trim().toLowerCase();
    const found = INITIAL_ADMIN_BOOKINGS.find(
      (b) => b.id.toLowerCase() === clean || (b.bookingId && b.bookingId.toLowerCase() === clean)
    );
    return found || null;
  },

  async createBooking(bookingData: any): Promise<Booking> {
    try {
      const created = await apiClient.post<Booking>('/bookings', bookingData);
      if (created) return created;
    } catch (e: any) {
      console.warn('[apiService] Backend booking creation failed, falling back to local record', e);
    }
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingId = bookingData.bookingId || `SKY-2026-${randomChars}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      bookingId,
      createdAt: new Date().toISOString().split('T')[0],
      status: bookingData.bookingStatus || 'Confirmed',
      bookingStatus: bookingData.bookingStatus || 'confirmed',
      paymentStatus: bookingData.paymentStatus || 'Pending',
    };
    return newBooking;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    try {
      if (status === 'Cancelled' || status === 'cancelled') {
        const cancelled = await apiClient.post<any>(`/bookings/${id}/cancel`, {
          reason: 'Cancelled via customer dashboard',
        });
        if (cancelled?.booking) return cancelled.booking;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  // Admin APIs
  async getAdminKPIs() {
    return Promise.resolve(ADMIN_KPIS);
  },

  async getAdminCustomers() {
    return Promise.resolve(ADMIN_CUSTOMERS);
  },

  async createPackage(newPkg: Omit<TripPackage, 'id'>): Promise<TripPackage> {
    try {
      const created = await apiClient.post<TripPackage>('/trips', newPkg);
      if (created) return created;
    } catch {
      // Fallback
    }
    return { ...newPkg, id: 'p' + Date.now() } as TripPackage;
  },

  async updatePackage(id: string, updates: Partial<TripPackage>): Promise<TripPackage | null> {
    try {
      const updated = await apiClient.patch<TripPackage>(`/trips/${id}`, updates);
      if (updated) return updated;
    } catch {
      // Fallback
    }
    return null;
  },
};
