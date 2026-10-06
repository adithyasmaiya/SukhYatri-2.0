import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  HelpCircle,
  MessageCircle,
  Phone,
  ShieldAlert,
  Sparkles,
  Repeat,
  Star,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/bookingService';
import { Booking, TripPackage } from '../types';
import { LoadingState } from '../components/ui/LoadingState';
import { Button } from '../components/ui/Button';

// Trip Reusable Components
import {
  BookingDetailsHeader,
  JourneyDetails,
  TravellerList,
  BookingTimeline,
  BookingPriceSummary,
  CancellationModal,
  ReviewModal,
  InvoiceModal,
} from '../components/trips';
import { ItineraryTimeline } from '../components/trip/ItineraryTimeline';

export const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [pkg, setPkg] = useState<TripPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);

  // Modals
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    if (!bookingId) return;

    setLoading(true);
    setIsUnauthorized(false);

    bookingService
      .getBookingById(bookingId, currentUser?.id, currentUser?.email)
      .then((res) => {
        if (!mounted) return;
        if (res.unauthorized) {
          setIsUnauthorized(true);
          setBooking(null);
        } else if (res.booking) {
          setBooking(res.booking);
          const foundPkg = bookingService.getPackageForBooking(res.booking);
          setPkg(foundPkg || null);
        } else {
          setBooking(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed to load booking:', err);
        setBooking(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [bookingId, currentUser]);

  // Handle Cancellation
  const handleConfirmCancellation = async (
    targetBookingId: string,
    reason: string,
    customReason?: string
  ) => {
    const res = await bookingService.cancelBooking(targetBookingId, reason, customReason);
    if (res.success && res.booking) {
      setBooking(res.booking);
      toast(
        `Booking <b>${targetBookingId}</b> has been cancelled. Estimated refund of <b>₹${res.refundAmount.toLocaleString(
          'en-IN'
        )}</b> initiated to your source account.`,
        'info'
      );
    } else {
      throw new Error(res.error || 'Failed to cancel reservation');
    }
  };

  // Handle Review Submission
  const handleSubmitReview = async (
    targetBookingId: string,
    rating: number,
    title: string,
    comment: string
  ) => {
    const res = await bookingService.submitReview(targetBookingId, rating, title, comment);
    if (res.success && res.booking) {
      setBooking(res.booking);
      toast('Thank you for sharing your travel experience! Your review is recorded.', 'success');
    } else {
      throw new Error(res.error || 'Could not save review');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading your digital booking voucher & journey itinerary…" />
      </div>
    );
  }

  // Unauthorized Access State (Security Edge Case)
  if (isUnauthorized) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <div className="bg-white rounded-3xl border border-sand-dark/25 p-8 md:p-12 shadow-card space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-display font-semibold text-2xl text-ink">
            Access Restricted
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed max-w-md mx-auto">
            This booking voucher belongs to another Yatri account. For privacy and passenger security, reservations can only be viewed by the verified account holder.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/my-trips')}
              className="bg-pine hover:bg-pinedark text-white"
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/explore')}
            >
              Explore Journeys
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <div className="bg-white rounded-3xl border border-sand-dark/25 p-8 md:p-12 shadow-card space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-display font-semibold text-2xl text-ink">
            Booking Not Found
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed max-w-md mx-auto">
            We could not find a reservation matching reference <strong className="font-mono text-stone-800">{bookingId}</strong>. It may have been modified or is not linked with your profile.
          </p>
          <div className="pt-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/my-trips')}
              className="bg-pine hover:bg-pinedark text-white"
            >
              Return to My Trips
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const normStatus = (booking.bookingStatus || booking.status || 'confirmed').toLowerCase();
  const isUpcoming = normStatus === 'confirmed' || normStatus === 'pending';
  const isCompleted = normStatus === 'completed';
  const isCancelled = normStatus === 'cancelled';

  const tripSlug = pkg?.slug || 'kerala-backwaters-tea-hills';

  return (
    <div className="min-h-screen bg-sand/20 py-8 lg:py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Booking Top Header Banner */}
        <BookingDetailsHeader
          booking={booking}
          onOpenInvoice={() => setIsInvoiceOpen(true)}
        />

        {/* Main Grid: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2 Cols): Journey Particulars, Travellers, Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Journey Details */}
            <JourneyDetails booking={booking} />

            {/* Travellers List */}
            <TravellerList booking={booking} />

            {/* Trip Itinerary Section (Reusing ItineraryTimeline without duplication) */}
            {pkg?.itinerary && pkg.itinerary.length > 0 && (
              <div className="bg-white rounded-3xl border border-sand-dark/25 p-6 sm:p-7 shadow-card space-y-4">
                <div className="border-b border-sand-dark/20 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-moss">
                    Day-by-Day Experience
                  </span>
                  <h2 className="font-display font-semibold text-xl text-ink mt-0.5">
                    Curated Trip Itinerary
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Your day-to-day rhythm crafted for tranquility and comfort
                  </p>
                </div>

                <ItineraryTimeline
                  itinerary={pkg.itinerary}
                  durationDays={pkg.days || pkg.itinerary.length}
                />
              </div>
            )}

            {/* Completed Journey Actions: Review & Book Again */}
            {isCompleted && (
              <div className="bg-white rounded-3xl border border-sand-dark/25 p-6 sm:p-7 shadow-card space-y-4">
                <div className="flex items-center gap-2 text-moss font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Journey Memories & Feedback</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-ink">
                  How was your time in {booking.destination || booking.destName}?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your insights inspire fellow travellers and help us continue perfecting our slow-travel hospitality.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {!booking.reviewSubmitted ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="bg-pine hover:bg-pinedark text-white font-medium"
                      leftIcon={<Star className="w-3.5 h-3.5" />}
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Review submitted for this trip. Thank you!</span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/trip/${tripSlug}`)}
                    className="border-sand-dark/40 text-ink hover:bg-sand/30"
                    leftIcon={<Repeat className="w-3.5 h-3.5 text-pine" />}
                  >
                    Book Again
                  </Button>
                </div>
              </div>
            )}

            {/* Support / Help Section */}
            <div className="bg-cream/40 rounded-3xl border border-sand-dark/25 p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-pine font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Need help with your booking?</span>
              </div>
              <h3 className="font-display font-semibold text-lg text-ink">
                Dedicated SukhYatri Concierge
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Have special food requests, train transfer questions, or flight adjustments? Our dedicated travel designer is available on WhatsApp and phone.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-cream2 text-ink transition-colors border border-sand-dark/30 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-pine" />
                  <span>Contact Support</span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-cream2 text-ink transition-colors border border-sand-dark/30 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-pine" />
                  <span>View FAQs & Helpline</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Booking Timeline, Price Breakup, Manage Booking */}
          <div className="space-y-8">
            {/* Booking Timeline */}
            <BookingTimeline booking={booking} />

            {/* Payment Summary */}
            <BookingPriceSummary booking={booking} />

            {/* Secondary Area: Manage Booking (Cancellation Option) */}
            <div className="bg-white rounded-3xl border border-sand-dark/25 p-6 sm:p-7 shadow-card space-y-4">
              <div className="border-b border-sand-dark/20 pb-3">
                <h3 className="font-display font-semibold text-base text-ink">
                  Manage Booking
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Voucher copies, adjustments, and policy options
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-sand/30 hover:bg-sand/60 text-xs font-medium text-ink transition-colors border border-sand-dark/30"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-pine" />
                    <span>Download Tax Invoice</span>
                  </div>
                  <span className="text-[11px] text-stone-400">PDF / Print</span>
                </button>

                {/* Cancellation Button: only shown for eligible upcoming trips */}
                {isUpcoming && (
                  <div className="pt-3 border-t border-sand-dark/20">
                    <p className="text-[11px] text-stone-500 mb-2">
                      Need to reschedule or cancel due to unexpected circumstances?
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100/70 transition-colors border border-rose-200/70 text-center"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                {isCancelled && (
                  <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-800 border border-rose-200/60">
                    This reservation was cancelled on{' '}
                    <strong>{booking.cancelledAt || 'record'}</strong>. The estimated refund has been routed to your bank account.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isInvoiceOpen && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          booking={booking}
        />
      )}

      {isCancelModalOpen && (
        <CancellationModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          booking={booking}
          onConfirmCancellation={handleConfirmCancellation}
        />
      )}

      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          booking={booking}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
};
