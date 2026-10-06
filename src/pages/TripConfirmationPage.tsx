import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Booking } from '../types';
import { LoadingState } from '../components/ui/LoadingState';
import { BookingSuccess, BookingError } from '../components/booking';

export const TripConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (bookingId) {
      apiService.getBookingById(bookingId).then((b) => {
        if (!mounted) return;
        setBooking(b);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [bookingId]);

  if (loading) return <LoadingState message="Retrieving your confirmed booking…" />;

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <BookingError
          title="Booking Not Found"
          message={`We could not locate any reservation with reference "${bookingId}". Please check your booking reference or view your trips.`}
          returnPath="/my-trips"
        />
      </div>
    );
  }

  return <BookingSuccess booking={booking} />;
};
