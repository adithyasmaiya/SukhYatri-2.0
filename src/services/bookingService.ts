import { Booking, BookingStatus, RefundStatus, TripPackage } from '../types';
import { PACKAGES } from '../data/packages';

const STORAGE_KEY_BOOKINGS = 'sukhyatri_bookings';

// Initial seed bookings with Ananya Sharma as the primary user
const SEED_BOOKINGS: Booking[] = [
  {
    id: 'SKY-2026-8F42K',
    bookingId: 'SKY-2026-8F42K',
    userId: 'u-ananya',
    packageId: 'p1',
    packageTitle: 'Kerala Slow Backwaters & Tea Trails',
    packageImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    destName: 'Kerala',
    destination: 'Kerala',
    travelDate: '2026-10-24',
    endDate: '2026-10-29',
    duration: '5N / 6D',
    slot: 'Morning departure (09:00 AM)',
    travellers: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    roomCategory: 'Deluxe',
    leadGuest: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
      dob: '1995-05-15',
      gender: 'Female',
      country: 'India',
      specialRequests: 'High-floor quiet room away from elevator, Jain meals preferred.',
    },
    primaryTraveller: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
      dob: '1995-05-15',
      gender: 'Female',
      country: 'India',
    },
    additionalTravellers: [
      {
        name: 'Rohan Sharma',
        age: 31,
        gender: 'Male',
      },
    ],
    baseAmount: 97000,
    discountAmount: 9700,
    couponApplied: 'SUKH10',
    couponCode: 'SUKH10',
    taxAmount: 4365,
    totalAmount: 91665,
    tokenPaid: 91665,
    status: 'Confirmed',
    bookingStatus: 'confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'upi',
    createdAt: '2026-10-02',
  },
  {
    id: 'SKY-2026-3N89P',
    bookingId: 'SKY-2026-3N89P',
    userId: 'u-ananya',
    packageId: 'p3',
    packageTitle: 'Royal Rajasthan — Palaces & Desert Stars',
    packageImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop',
    destName: 'Rajasthan',
    destination: 'Rajasthan',
    travelDate: '2026-11-20',
    endDate: '2026-11-26',
    duration: '6N / 7D',
    slot: 'Morning departure (09:00 AM)',
    travellers: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    roomCategory: 'Luxury',
    leadGuest: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
      dob: '1995-05-15',
      gender: 'Female',
      country: 'India',
    },
    primaryTraveller: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
      dob: '1995-05-15',
      gender: 'Female',
      country: 'India',
    },
    additionalTravellers: [
      {
        name: 'Sunita Sharma',
        age: 58,
        gender: 'Female',
      },
    ],
    baseAmount: 112800,
    discountAmount: 500,
    couponApplied: 'WELCOME500',
    couponCode: 'WELCOME500',
    taxAmount: 5615,
    totalAmount: 117915,
    tokenPaid: 117915,
    status: 'Confirmed',
    bookingStatus: 'confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'card',
    createdAt: '2026-10-04',
  },
  {
    id: 'SKY-2026-1M72Q',
    bookingId: 'SKY-2026-1M72Q',
    userId: 'u-ananya',
    packageId: 'p4',
    packageTitle: 'Kashmir Slow Paradise — Srinagar & Gulmarg',
    packageImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
    destName: 'Kashmir',
    destination: 'Kashmir',
    travelDate: '2026-07-15',
    endDate: '2026-07-20',
    duration: '5N / 6D',
    slot: 'Morning departure (09:00 AM)',
    travellers: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    roomCategory: 'Deluxe',
    leadGuest: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
      dob: '1995-05-15',
      gender: 'Female',
      country: 'India',
    },
    primaryTraveller: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
    },
    additionalTravellers: [
      {
        name: 'Rohan Sharma',
        age: 31,
        gender: 'Male',
      },
    ],
    baseAmount: 78000,
    discountAmount: 0,
    taxAmount: 3900,
    totalAmount: 81900,
    tokenPaid: 81900,
    status: 'Completed',
    bookingStatus: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'upi',
    createdAt: '2026-06-20',
  },
  {
    id: 'SKY-2026-5T90B',
    bookingId: 'SKY-2026-5T90B',
    userId: 'u-ananya',
    packageId: 'p8',
    packageTitle: 'Goa Heritage & Slow Coast',
    packageImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
    destName: 'Goa',
    destination: 'Goa',
    travelDate: '2026-05-10',
    endDate: '2026-05-14',
    duration: '4N / 5D',
    travellers: 1,
    adults: 1,
    children: 0,
    rooms: 1,
    leadGuest: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
    },
    baseAmount: 34000,
    discountAmount: 0,
    taxAmount: 1700,
    totalAmount: 35700,
    tokenPaid: 35700,
    status: 'Completed',
    bookingStatus: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'upi',
    createdAt: '2026-04-12',
    reviewSubmitted: true,
    review: {
      rating: 5,
      title: 'Peaceful coastal retreat with wonderful host',
      text: 'The Portuguese villa stay in Siolim was exceptionally serene. Rested driver and authentic Goan meals.',
      createdAt: '2026-05-16',
    },
  },
  {
    id: 'SKY-2026-9C41L',
    bookingId: 'SKY-2026-9C41L',
    userId: 'u-ananya',
    packageId: 'p2',
    packageTitle: 'Ladakh High Adventure — Pangong & Nubra',
    packageImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
    destName: 'Ladakh',
    destination: 'Ladakh',
    travelDate: '2026-09-12',
    endDate: '2026-09-18',
    duration: '6N / 7D',
    travellers: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    leadGuest: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
    },
    baseAmount: 105800,
    discountAmount: 0,
    taxAmount: 5290,
    totalAmount: 111090,
    tokenPaid: 111090,
    status: 'Cancelled',
    bookingStatus: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'upi',
    createdAt: '2026-08-01',
    cancelledAt: '2026-08-25',
    cancellationReason: 'Change of personal travel schedule',
    cancellationFee: 5000,
    cancellationRefundAmount: 106090,
    refundStatus: 'refunded',
  },
  // Other users for ownership isolation testing
  {
    id: 'SKY-2026-OTHER1',
    bookingId: 'SKY-2026-OTHER1',
    userId: 'u-rohan',
    packageId: 'p6',
    packageTitle: 'Andaman Blue Escape',
    packageImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
    destName: 'Andaman',
    destination: 'Andaman',
    travelDate: '2026-11-12',
    travellers: 2,
    leadGuest: {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 98111 22334',
    },
    baseAmount: 85000,
    discountAmount: 0,
    taxAmount: 4250,
    totalAmount: 89250,
    status: 'Confirmed',
    bookingStatus: 'confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'card',
    createdAt: '2026-09-20',
  },
];

function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load bookings from localStorage', e);
  }
  // Initialize with seed data
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(SEED_BOOKINGS));
  return SEED_BOOKINGS;
}

function saveStoredBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
}

// Simulated network latency
const delay = (ms: number = 250) => new Promise((resolve) => setTimeout(resolve, ms));

import { apiClient, ApiError } from './apiClient';

export const bookingService = {
  async getUserBookings(userId?: string, userEmail?: string): Promise<Booking[]> {
    try {
      const data = await apiClient.get<Booking[]>('/bookings/my');
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn('[bookingService] Falling back to local bookings', e);
    }

    const all = getStoredBookings();
    if (!userId && !userEmail) return [];

    const cleanId = (userId || '').trim().toLowerCase();
    const cleanEmail = (userEmail || '').trim().toLowerCase();

    return all.filter((b) => {
      const bUserId = (b.userId || '').toLowerCase();
      const bEmail = (b.leadGuest?.email || b.primaryTraveller?.email || '').toLowerCase();
      return (cleanId && bUserId === cleanId) || (cleanEmail && bEmail === cleanEmail);
    });
  },

  async getBookingById(
    bookingId: string,
    userId?: string,
    userEmail?: string
  ): Promise<{ booking: Booking | null; unauthorized?: boolean }> {
    try {
      const data = await apiClient.get<Booking>(`/bookings/${bookingId}`);
      if (data) {
        return { booking: data };
      }
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 403) {
        return { booking: null, unauthorized: true };
      }
      if (err instanceof ApiError && err.statusCode === 404) {
        return { booking: null };
      }
      console.warn('[bookingService] Falling back to local booking search', err);
    }

    const all = getStoredBookings();
    const cleanId = bookingId.trim().toLowerCase();

    const found = all.find(
      (b) =>
        b.id.toLowerCase() === cleanId ||
        (b.bookingId && b.bookingId.toLowerCase() === cleanId)
    );

    if (!found) {
      return { booking: null };
    }

    // Ownership verification: If user credentials are provided, ensure match
    if (userId || userEmail) {
      const currentUserId = (userId || '').toLowerCase();
      const currentUserEmail = (userEmail || '').toLowerCase();

      const bUserId = (found.userId || '').toLowerCase();
      const bEmail = (found.leadGuest?.email || found.primaryTraveller?.email || '').toLowerCase();

      const isOwner =
        (currentUserId && bUserId === currentUserId) ||
        (currentUserEmail && bEmail === currentUserEmail);

      if (!isOwner && currentUserId !== 'u-admin') {
        return { booking: null, unauthorized: true };
      }
    }

    return { booking: found };
  },

  async createBooking(bookingPayload: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    try {
      const data = await apiClient.post<Booking>('/bookings', bookingPayload);
      if (data) return data;
    } catch (err) {
      console.warn('[bookingService] Backend createBooking failed, falling back to local', err);
    }

    const all = getStoredBookings();
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newId = `SKY-2026-${randomChars}`;

    const newBooking: Booking = {
      ...bookingPayload,
      id: newId,
      bookingId: newId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      bookingStatus: 'confirmed',
      paymentStatus: 'Paid',
    };

    all.unshift(newBooking);
    saveStoredBookings(all);
    return newBooking;
  },

  calculateRefund(booking: Booking): {
    refundAmount: number;
    cancellationFee: number;
    policyTier: string;
    policyText: string;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const travelDate = new Date(booking.travelDate);
    travelDate.setHours(0, 0, 0, 0);

    const diffMs = travelDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const total = booking.totalAmount;

    let feePct = 0;
    let policyTier = '';
    let policyText = '';

    if (diffDays >= 15) {
      // Free or minimal fee > 15 days
      feePct = 0.05; // 5% nominal handling
      policyTier = '15+ Days Before Travel';
      policyText = 'Complimentary cancellation: 95% full refund returned to source.';
    } else if (diffDays >= 7) {
      feePct = 0.15; // 15% cancellation fee
      policyTier = '7–14 Days Before Travel';
      policyText = 'Standard cancellation: 85% refund returned to source account.';
    } else if (diffDays >= 3) {
      feePct = 0.5; // 50% cancellation fee
      policyTier = '3–6 Days Before Travel';
      policyText = 'Late cancellation: 50% refund returned due to confirmed hotel blocking.';
    } else {
      feePct = 0.8; // 80% fee
      policyTier = 'Within 48 Hours';
      policyText = 'Last-minute cancellation: 20% partial refund after chauffeur & hotel retention.';
    }

    const cancellationFee = Math.round(total * feePct);
    const refundAmount = Math.max(0, total - cancellationFee);

    return {
      refundAmount,
      cancellationFee,
      policyTier,
      policyText,
    };
  },

  async cancelBooking(
    bookingId: string,
    reason: string,
    customReason?: string
  ): Promise<{ success: boolean; booking?: Booking; refundAmount: number; error?: string }> {
    try {
      const res = await apiClient.post<any>(`/bookings/${bookingId}/cancel`, {
        reason,
        customReason,
      });
      if (res && res.booking) {
        return {
          success: true,
          booking: res.booking,
          refundAmount: res.refundAmount,
        };
      }
    } catch (e: any) {
      console.warn('[bookingService] Backend cancelBooking failed, applying local cancellation', e);
    }

    const all = getStoredBookings();
    const cleanId = bookingId.trim().toLowerCase();

    const idx = all.findIndex(
      (b) =>
        b.id.toLowerCase() === cleanId ||
        (b.bookingId && b.bookingId.toLowerCase() === cleanId)
    );

    if (idx === -1) {
      return { success: false, refundAmount: 0, error: 'Booking not found.' };
    }

    const target = all[idx];
    const { refundAmount, cancellationFee } = this.calculateRefund(target);

    const updated: Booking = {
      ...target,
      status: 'Cancelled',
      bookingStatus: 'cancelled',
      paymentStatus: 'refunded',
      cancelledAt: new Date().toISOString().split('T')[0],
      cancellationReason: customReason ? `${reason}: ${customReason}` : reason,
      cancellationFee,
      cancellationRefundAmount: refundAmount,
      refundStatus: 'initiated',
    };

    all[idx] = updated;
    saveStoredBookings(all);
    return { success: true, booking: updated, refundAmount };
  },

  getBookingStatus(booking: Booking): {
    isUpcoming: boolean;
    isCompleted: boolean;
    isCancelled: boolean;
    countdownDays: number;
    countdownLabel: string;
  } {
    const statusNormalized = (booking.status || '').toLowerCase();
    const isCancelled = statusNormalized === 'cancelled';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const travelDate = new Date(booking.travelDate);
    travelDate.setHours(0, 0, 0, 0);

    const diffMs = travelDate.getTime() - today.getTime();
    const countdownDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let isCompleted = statusNormalized === 'completed' || (!isCancelled && countdownDays < 0);
    let isUpcoming = !isCancelled && !isCompleted;

    let countdownLabel = '';
    if (countdownDays === 0) {
      countdownLabel = 'Your trip starts today!';
    } else if (countdownDays === 1) {
      countdownLabel = 'Your trip starts tomorrow!';
    } else if (countdownDays > 1) {
      countdownLabel = `Your trip starts in ${countdownDays} days`;
    } else {
      countdownLabel = 'Trip concluded';
    }

    return {
      isUpcoming,
      isCompleted,
      isCancelled,
      countdownDays,
      countdownLabel,
    };
  },

  async submitReview(
    bookingId: string,
    ratingOrReview: number | { rating: number; title: string; text?: string; comment?: string },
    titleArg?: string,
    commentArg?: string
  ): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    let rating: number;
    let title: string;
    let comment: string;

    if (typeof ratingOrReview === 'number') {
      rating = ratingOrReview;
      title = titleArg || 'Travel Review';
      comment = commentArg || '';
    } else {
      rating = ratingOrReview.rating;
      title = ratingOrReview.title;
      comment = ratingOrReview.comment || ratingOrReview.text || '';
    }

    try {
      const res = await apiClient.post<any>('/reviews', {
        bookingId,
        rating,
        title,
        comment,
      });
      if (res && res.booking) {
        return { success: true, booking: res.booking };
      }
    } catch (e: any) {
      console.warn('[bookingService] Backend submitReview failed, saving locally', e);
    }

    const all = getStoredBookings();
    const cleanId = bookingId.trim().toLowerCase();

    const idx = all.findIndex(
      (b) =>
        b.id.toLowerCase() === cleanId ||
        (b.bookingId && b.bookingId.toLowerCase() === cleanId)
    );

    if (idx === -1) {
      return { success: false, error: 'Booking record not found' };
    }

    const reviewData = {
      rating,
      title,
      text: comment,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    all[idx].reviewSubmitted = true;
    all[idx].review = reviewData;

    saveStoredBookings(all);
    return { success: true, booking: all[idx] };
  },

  // Helper to retrieve associated trip package data synchronously
  getPackageForBooking(bookingOrId: Booking | string): TripPackage | null {
    if (!bookingOrId) return null;
    const idOrSlug =
      typeof bookingOrId === 'string'
        ? bookingOrId.toLowerCase()
        : (bookingOrId.packageId || bookingOrId.id || '').toLowerCase();

    const title =
      typeof bookingOrId === 'object' && bookingOrId.packageTitle
        ? bookingOrId.packageTitle.toLowerCase()
        : '';

    const pkg = PACKAGES.find(
      (p) =>
        p.id.toLowerCase() === idOrSlug ||
        p.slug.toLowerCase() === idOrSlug ||
        (title && p.title.toLowerCase() === title)
    );
    return pkg || null;
  },
};
