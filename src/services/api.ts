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
      if (Array.isArray(data) && data.length > 0) return data;
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
    return list;
  },

  async getPackageBySlug(slug: string): Promise<TripPackage | null> {
    try {
      const data = await apiClient.get<TripPackage>(`/trips/${slug.toLowerCase()}`);
      if (data) return data;
    } catch {
      // Fallback
    }
    const clean = slug.toLowerCase();
    const pkg = PACKAGES.find((p) => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean);
    return pkg || null;
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
