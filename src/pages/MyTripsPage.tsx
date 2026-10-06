import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import { LoadingState } from '../components/ui/LoadingState';

// Trip Reusable Components
import {
  MyTripsHeader,
  TripTabs,
  TripTabType,
  UpcomingTripCard,
  CompletedTripCard,
  CancelledTripCard,
  MyTripsEmptyState,
  InvoiceModal,
  ReviewModal,
} from '../components/trips';
import { useSEO } from '../hooks/useSEO';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useSEO({
    title: 'My Trips | SukhYatri',
    noIndex: true,
  });

  const [activeTab, setActiveTab] = useState<TripTabType>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  // Load user-owned bookings
  const loadBookings = async () => {
    if (!currentUser) return;
    try {
      const userBookings = await bookingService.getUserBookings(currentUser.id, currentUser.email);
      setBookings(userBookings);
    } catch (err) {
      console.error('Failed to fetch user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [currentUser]);

  // Handle Review Submission
  const handleSubmitReview = async (
    bookingId: string,
    rating: number,
    title: string,
    comment: string
  ) => {
    const res = await bookingService.submitReview(bookingId, rating, title, comment);
    if (res.success && res.booking) {
      // Refresh local bookings list
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId || b.bookingId === bookingId ? res.booking! : b))
      );
      toast('Thank you! Your travel review has been submitted.', 'success');
      setSelectedBookingForReview(null);
    } else {
      throw new Error(res.error || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading your SukhYatri journeys…" />
      </div>
    );
  }

  // Filter categories
  const upcomingBookings = bookings.filter((b) => {
    const s = (b.bookingStatus || b.status || '').toLowerCase();
    return s === 'confirmed' || s === 'pending';
  });

  const completedBookings = bookings.filter((b) => {
    const s = (b.bookingStatus || b.status || '').toLowerCase();
    return s === 'completed';
  });

  const cancelledBookings = bookings.filter((b) => {
    const s = (b.bookingStatus || b.status || '').toLowerCase();
    return s === 'cancelled';
  });

  const counts = {
    upcoming: upcomingBookings.length,
    completed: completedBookings.length,
    cancelled: cancelledBookings.length,
    all: bookings.length,
  };

  // Determine current display list
  const currentList = (() => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBookings;
      case 'completed':
        return completedBookings;
      case 'cancelled':
        return cancelledBookings;
      case 'all':
      default:
        return bookings;
    }
  })();

  return (
    <div className="min-h-screen bg-sand/15 py-8 lg:py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Metric Summary */}
        <MyTripsHeader
          upcomingCount={counts.upcoming}
          completedCount={counts.completed}
          totalCount={counts.all}
          userName={currentUser?.name}
        />

        {/* Filter Tabs */}
        <div className="bg-white rounded-3xl border border-sand-dark/25 p-2 sm:p-3 shadow-xs">
          <TripTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />
        </div>

        {/* Bookings Content Area */}
        <div className="space-y-6 min-h-[340px]">
          {currentList.length === 0 ? (
            <MyTripsEmptyState
              type={activeTab}
              onExplore={() => navigate('/explore')}
            />
          ) : (
            <div className="space-y-5">
              {currentList.map((booking) => {
                const normStatus = (booking.bookingStatus || booking.status || '').toLowerCase();

                if (normStatus === 'cancelled') {
                  return (
                    <CancelledTripCard
                      key={booking.bookingId || booking.id}
                      booking={booking}
                    />
                  );
                }

                if (normStatus === 'completed') {
                  return (
                    <CompletedTripCard
                      key={booking.bookingId || booking.id}
                      booking={booking}
                      onWriteReview={(b) => setSelectedBookingForReview(b)}
                    />
                  );
                }

                // Default upcoming / confirmed
                return (
                  <UpcomingTripCard
                    key={booking.bookingId || booking.id}
                    booking={booking}
                    onDownloadInvoice={(b) => setSelectedBookingForInvoice(b)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          isOpen={!!selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
          booking={selectedBookingForInvoice}
        />
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          booking={selectedBookingForReview}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
};
