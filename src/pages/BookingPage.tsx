import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  Star,
  Calendar,
  Users,
  Clock,
  Compass,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { apiService } from '../services/api';
import { paymentService } from '../services/paymentService';
import { TripPackage, Booking, PrimaryTraveller, AdditionalTraveller } from '../types';
import { validateCoupon } from '../data/coupons';
import { formatINR } from '../utils/format';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  BookingProgress,
  TripBookingSummary,
  DateSelector,
  TravellerCounter,
  TravellerForm,
  FormErrors,
  PriceBreakdown,
  CouponInput,
  TermsCheckbox,
  PaymentMethodSelector,
  PaymentMethodType,
  PaymentSummary,
  BookingError,
} from '../components/booking';

// Helper validation functions
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

const validateIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
};

export const BookingPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [trip, setTrip] = useState<TripPackage | null>(null);
  const [loading, setLoading] = useState(true);

  // Active checkout step: 1 (Details), 2 (Travellers), 3 (Review), 4 (Payment)
  const [step, setStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Calculate default departure date (tomorrow + 7 days for realistic planning)
  const defaultDepartureDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })();

  // Step 1: Trip Options
  const [travelDate, setTravelDate] = useState<string>(
    searchParams.get('date') || defaultDepartureDate
  );
  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const [adults, setAdults] = useState<number>(
    Math.max(1, Number(searchParams.get('adults')) || Number(searchParams.get('travellers')) || 2)
  );
  const [childrenCount, setChildrenCount] = useState<number>(
    Math.max(0, Number(searchParams.get('children')) || 0)
  );

  const totalTravellers = adults + childrenCount;

  // Step 2: Traveller Details
  const [primaryTraveller, setPrimaryTraveller] = useState<PrimaryTraveller>({
    name: currentUser?.name || 'Ananya Sharma',
    email: currentUser?.email || 'ananya@example.com',
    phone: currentUser?.phone || '9820011223',
    dob: '1995-05-15',
    gender: 'Female',
    country: 'India',
    specialRequests: '',
  });

  const [additionalTravellers, setAdditionalTravellers] = useState<AdditionalTraveller[]>([
    { name: 'Rohan Sharma', age: 31, gender: 'Male' },
  ]);

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Step 3: Review, Coupon & Terms
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMsg, setProcessingMsg] = useState<string>('Securing your booking...');

  // Draft Booking State for Razorpay Payment Linkage
  const [draftBooking, setDraftBooking] = useState<Booking | null>(null);
  const [draftBookingId, setDraftBookingId] = useState<string | null>(null);

  // Polished payment error / pending states
  const [paymentFailure, setPaymentFailure] = useState<{
    title: string;
    message: string;
    code?: string;
  } | null>(null);
  const [paymentPending, setPaymentPending] = useState<boolean>(false);
  const [isVerifyingPending, setIsVerifyingPending] = useState<boolean>(false);

  // Load selected trip
  useEffect(() => {
    let mounted = true;
    if (tripId) {
      apiService.getPackageById(tripId).then((pkg) => {
        if (!mounted) return;
        setTrip(pkg);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [tripId]);

  // Sync additional travellers array with total count
  useEffect(() => {
    const neededAdditional = Math.max(0, totalTravellers - 1);
    setAdditionalTravellers((prev) => {
      if (prev.length === neededAdditional) return prev;
      if (prev.length < neededAdditional) {
        const added: AdditionalTraveller[] = [];
        for (let i = prev.length; i < neededAdditional; i++) {
          added.push({
            name: '',
            age: 26,
            gender: 'Female',
          });
        }
        return [...prev, ...added];
      }
      return prev.slice(0, neededAdditional);
    });
  }, [totalTravellers]);

  // Load any previously saved session draft for this trip
  useEffect(() => {
    if (!tripId) return;
    try {
      const saved = sessionStorage.getItem(`sukhyatri_booking_${tripId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.travelDate) setTravelDate(parsed.travelDate);
        if (parsed.adults) setAdults(parsed.adults);
        if (parsed.childrenCount !== undefined) setChildrenCount(parsed.childrenCount);
        if (parsed.primaryTraveller) setPrimaryTraveller(parsed.primaryTraveller);
        if (parsed.additionalTravellers) setAdditionalTravellers(parsed.additionalTravellers);
        if (parsed.appliedCoupon) setAppliedCoupon(parsed.appliedCoupon);
        if (parsed.couponDiscount) setCouponDiscount(parsed.couponDiscount);
        if (parsed.draftBookingId) setDraftBookingId(parsed.draftBookingId);
      }
    } catch {
      // Ignore parse errors
    }
  }, [tripId]);

  // Persist form state changes in sessionStorage draft
  useEffect(() => {
    if (!tripId) return;
    try {
      const draft = {
        travelDate,
        adults,
        childrenCount,
        primaryTraveller,
        additionalTravellers,
        appliedCoupon,
        couponDiscount,
        draftBookingId,
      };
      sessionStorage.setItem(`sukhyatri_booking_${tripId}`, JSON.stringify(draft));
    } catch {
      // Ignore storage errors
    }
  }, [
    tripId,
    travelDate,
    adults,
    childrenCount,
    primaryTraveller,
    additionalTravellers,
    appliedCoupon,
    couponDiscount,
    draftBookingId,
  ]);

  if (loading) return <LoadingState message="Preparing your booking portal…" />;

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <BookingError
          title="Trip Not Found"
          message="Could not load the requested package for checkout. Please return to explore and select a journey."
          returnPath="/explore"
        />
      </div>
    );
  }

  // Cost calculations
  const pricePerPerson = trip.price;
  const baseAmount = pricePerPerson * totalTravellers;
  const subtotal = baseAmount;

  // Re-calculate coupon discount dynamically if coupon is applied
  let calculatedDiscount = 0;
  if (appliedCoupon) {
    const val = validateCoupon(appliedCoupon, subtotal);
    if (val.valid) {
      calculatedDiscount = val.discountAmount;
    }
  }

  const discountAmount = calculatedDiscount;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05); // 5% GST
  const totalAmount = taxableAmount + taxAmount;

  // Validation handlers
  const validateStep1 = (): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateStr = tomorrow.toISOString().split('T')[0];

    if (!travelDate) {
      setDateError('Please select a departure travel date');
      return false;
    }

    if (travelDate < minDateStr) {
      setDateError('Departure date cannot be today or in the past. Please select tomorrow onwards.');
      return false;
    }

    setDateError(undefined);
    return true;
  };

  const validateStep2 = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Primary Name
    if (!primaryTraveller.name || !primaryTraveller.name.trim()) {
      errors.primaryName = 'Full legal name is required as per government ID';
      isValid = false;
    } else if (primaryTraveller.name.trim().length < 2) {
      errors.primaryName = 'Please enter your full name (at least 2 characters)';
      isValid = false;
    }

    // Primary Email
    if (!primaryTraveller.email || !primaryTraveller.email.trim()) {
      errors.primaryEmail = 'Email address is required for vouchers';
      isValid = false;
    } else if (!validateEmail(primaryTraveller.email)) {
      errors.primaryEmail = 'Please enter a valid email address (e.g. name@domain.com)';
      isValid = false;
    }

    // Primary Phone
    if (!primaryTraveller.phone || !primaryTraveller.phone.trim()) {
      errors.primaryPhone = 'Mobile number is required for driver & concierge dispatch';
      isValid = false;
    } else if (!validateIndianPhone(primaryTraveller.phone)) {
      errors.primaryPhone = 'Please enter a valid 10-digit Indian phone number';
      isValid = false;
    }

    // Additional Travellers
    const neededAdditional = Math.max(0, totalTravellers - 1);
    const additionalErrors: Record<number, { name?: string; age?: string }> = {};

    for (let i = 0; i < neededAdditional; i++) {
      const trav = additionalTravellers[i];
      const travErr: { name?: string; age?: string } = {};

      if (!trav?.name || !trav.name.trim()) {
        travErr.name = `Traveller ${i + 2} name is required`;
        isValid = false;
      }

      if (trav?.age === undefined || trav?.age === '') {
        travErr.age = 'Age is required';
        isValid = false;
      } else {
        const numAge = Number(trav.age);
        if (isNaN(numAge) || numAge < 1 || numAge > 120) {
          travErr.age = 'Valid age (1–120) required';
          isValid = false;
        }
      }

      if (Object.keys(travErr).length > 0) {
        additionalErrors[i] = travErr;
      }
    }

    if (Object.keys(additionalErrors).length > 0) {
      errors.additionalTravellers = additionalErrors;
    }

    setFormErrors(errors);

    if (!isValid) {
      toast('Please complete all required traveller details before proceeding', 'error');
    }

    return isValid;
  };

  // Step Navigation Handlers
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    if (!completedSteps.includes(1)) {
      setCompletedSteps((prev) => [...prev, 1]);
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    if (!completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronously or asynchronously ensure a persisted draft booking in MongoDB
  const ensureDraftBooking = async (): Promise<Booking> => {
    if (draftBooking && (draftBooking.bookingStatus === 'pending_payment' || draftBooking.status === 'pending_payment')) {
      return draftBooking;
    }

    const bookingPayload: any = {
      bookingId: draftBookingId || undefined,
      userId: currentUser?.id || 'u-ananya',
      packageId: trip.id,
      tripId: trip.id,
      packageTitle: trip.title,
      packageImage: trip.image,
      destName: trip.destination || trip.destName,
      destinationName: trip.destination || trip.destName,
      travelDate,
      duration: trip.duration || `${trip.nights}N / ${trip.days}D`,
      travellers: totalTravellers,
      adults,
      children: childrenCount,
      leadGuest: primaryTraveller,
      primaryTraveller,
      additionalTravellers: additionalTravellers.slice(0, Math.max(0, totalTravellers - 1)),
      couponApplied: appliedCoupon || undefined,
      couponCode: appliedCoupon || undefined,
      baseAmount,
      discountAmount,
      taxAmount,
      totalAmount,
      amountPaid: 0,
      paymentMethod,
      paymentStatus: 'pending',
      bookingStatus: 'pending_payment',
    };

    const created = await apiService.createBooking(bookingPayload);
    setDraftBooking(created);
    setDraftBookingId(created.bookingId || created.id);

    try {
      const currentDraft = sessionStorage.getItem(`sukhyatri_booking_${trip.id}`);
      const parsed = currentDraft ? JSON.parse(currentDraft) : {};
      parsed.draftBookingId = created.bookingId || created.id;
      sessionStorage.setItem(`sukhyatri_booking_${trip.id}`, JSON.stringify(parsed));
    } catch {}

    return created;
  };

  const handleStep3Submit = () => {
    if (!agreedToTerms) {
      toast('Please review and agree to the booking terms and cancellation policy', 'error');
      return;
    }

    if (!completedSteps.includes(3)) {
      setCompletedSteps((prev) => [...prev, 3]);
    }
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Pre-create/update draft booking in pending_payment state
    ensureDraftBooking().catch((err) => {
      console.warn('[BookingPage] Pre-seeding draft booking failed:', err);
    });
  };

  // Allow clicking on previous completed steps in progress bar
  const handleStepClick = (targetStep: number) => {
    if (targetStep === step) return;

    // Cannot jump forward beyond completed steps
    if (targetStep > step) {
      if (step === 1 && !validateStep1()) return;
      if (step === 2 && !validateStep2()) return;
      if (step === 3 && !agreedToTerms) {
        toast('Please accept terms to continue to payment', 'error');
        return;
      }
    }

    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Primary traveller field updates
  const handlePrimaryChange = (field: keyof PrimaryTraveller, value: string) => {
    setPrimaryTraveller((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error
    if (field === 'name' && formErrors.primaryName) {
      setFormErrors((prev) => ({ ...prev, primaryName: undefined }));
    } else if (field === 'email' && formErrors.primaryEmail) {
      setFormErrors((prev) => ({ ...prev, primaryEmail: undefined }));
    } else if (field === 'phone' && formErrors.primaryPhone) {
      setFormErrors((prev) => ({ ...prev, primaryPhone: undefined }));
    }
  };

  // Additional traveller field updates
  const handleAdditionalChange = (
    index: number,
    field: keyof AdditionalTraveller,
    value: string | number
  ) => {
    setAdditionalTravellers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });

    // Clear error
    if (formErrors.additionalTravellers?.[index]) {
      setFormErrors((prev) => {
        const copy = { ...prev.additionalTravellers };
        if (copy[index]) {
          delete copy[index][field as 'name' | 'age'];
          if (Object.keys(copy[index]).length === 0) {
            delete copy[index];
          }
        }
        return { ...prev, additionalTravellers: copy };
      });
    }
  };

  // Coupon handling
  const handleApplyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();

    if (appliedCoupon && appliedCoupon.toUpperCase() === clean) {
      return { success: false, message: 'This coupon is already applied to your booking.' };
    }

    const res = validateCoupon(clean, subtotal);
    if (!res.valid) {
      return {
        success: false,
        message: res.error || 'Invalid promo code. Try SUKH10 or WELCOME500.',
      };
    }

    setAppliedCoupon(res.coupon!.code);
    setCouponDiscount(res.discountAmount);
    toast(`Promo code <b>${res.coupon!.code}</b> applied! Saved ${formatINR(res.discountAmount)}.`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    toast('Coupon removed from booking', 'info');
  };

  // Real Razorpay Payment Checkout & Verification Flow
  const handleProceedPayment = async () => {
    if (!isAuthenticated || !currentUser) {
      toast('Please sign in to proceed with payment and secure your booking.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/booking/${trip?.id || tripId}`)}`);
      return;
    }

    setIsProcessing(true);
    setPaymentFailure(null);
    setPaymentPending(false);
    setProcessingMsg('Securing your booking reservation...');

    try {
      // 1. Ensure booking exists before payment
      const activeBooking = await ensureDraftBooking();
      const bookingRef = activeBooking.bookingId || activeBooking.id;

      // 2. Call backend create-order API (backend calculates amount authoritatively)
      setProcessingMsg('Creating secure order with Razorpay…');
      const orderData = await paymentService.createPaymentOrder(bookingRef);

      // 3. Open official Razorpay Checkout modal
      setProcessingMsg('Awaiting payment confirmation…');

      await paymentService.openRazorpayCheckout({
        order: orderData,
        customer: {
          name: primaryTraveller.name,
          email: primaryTraveller.email,
          phone: primaryTraveller.phone,
          tripTitle: trip.title,
        },
        onSuccess: async (rzpResponse) => {
          setIsProcessing(true);
          setProcessingMsg('Verifying payment signature with SukhYatri backend…');

          try {
            const verifyResult = await paymentService.verifyPayment({
              bookingId: bookingRef,
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
            });

            // Clear cached draft
            try {
              sessionStorage.removeItem(`sukhyatri_booking_${trip.id}`);
            } catch {}

            setIsProcessing(false);
            toast('Payment verified! Your journey is confirmed.', 'success');
            const targetId =
              verifyResult.booking.bookingId || verifyResult.booking.id || bookingRef;
            navigate(`/booking/success/${targetId}`);
          } catch (verifyErr: any) {
            console.error('[BookingPage] Signature verification error:', verifyErr);
            setIsProcessing(false);
            setPaymentFailure({
              title: "Payment wasn't completed",
              message:
                verifyErr.message ||
                'Payment signature verification could not be confirmed. Your booking has not been charged.',
              code: verifyErr.code || 'SIGNATURE_MISMATCH',
            });
          }
        },
        onDismiss: () => {
          setIsProcessing(false);
          setPaymentFailure({
            title: "Payment wasn't completed",
            message: 'Your booking has not been charged.',
            code: 'MODAL_DISMISSED',
          });
        },
        onFailure: (errResponse: any) => {
          setIsProcessing(false);
          const desc =
            errResponse?.error?.description || 'Your booking has not been charged.';
          setPaymentFailure({
            title: "Payment wasn't completed",
            message: desc.includes('not been charged')
              ? desc
              : `${desc}. Your booking has not been charged.`,
            code: errResponse?.error?.code || 'GATEWAY_DECLINE',
          });
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      console.error('[BookingPage] Payment initialization error:', err);

      if (
        err.statusCode === 401 ||
        err.code === 'UNAUTHORIZED' ||
        err.message?.toLowerCase().includes('authentication') ||
        err.message?.toLowerCase().includes('token')
      ) {
        toast('Please sign in to your account to complete your booking.', 'info');
        navigate(`/login?redirect=${encodeURIComponent(`/booking/${trip?.id || tripId}`)}`);
        return;
      }

      const isGatewayOrAdblock =
        err.message?.toLowerCase().includes('gateway') ||
        err.message?.toLowerCase().includes('connect') ||
        err.message?.toLowerCase().includes('reach');

      setPaymentFailure({
        title: isGatewayOrAdblock ? 'Payment Gateway Unreachable' : "Payment wasn't completed",
        message: isGatewayOrAdblock
          ? `${err.message}. If you have an AdBlocker or Brave Shields active, please disable it for SukhYatri and retry.`
          : `${err.message || 'Payment could not be initialized'}. Your booking has not been charged.`,
        code: err.code || 'INIT_ERROR',
      });
    }
  };

  const handleCheckPendingStatus = async () => {
    if (!draftBookingId) return;
    setIsVerifyingPending(true);
    try {
      const b = await apiService.getBookingById(draftBookingId);
      if (b && (b.paymentStatus === 'paid' || b.bookingStatus === 'confirmed')) {
        toast('Payment confirmed! Navigating to your reservation…', 'success');
        navigate(`/booking/success/${b.bookingId || b.id}`);
      } else {
        toast('Payment status is still being confirmed with your bank.', 'info');
      }
    } catch {
      toast('Could not verify status yet. Please try again.', 'error');
    } finally {
      setIsVerifyingPending(false);
    }
  };

  const destinationText = trip.destination || trip.destName;
  const durationText = trip.duration || `${trip.nights}N / ${trip.days}D`;
  const travelStyleText = Array.isArray(trip.travelStyle)
    ? trip.travelStyle.join(', ')
    : trip.travelStyle || 'Curated Comfort';

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Top Header & Breadcrumb */}
      <div>
        <Link
          to={`/trip/${trip.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-ink transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to {trip.title}</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-ink tracking-tight">
            Checkout &amp; Reserve Journey
          </h1>
          <div className="flex items-center gap-2 text-xs text-moss font-bold bg-mosslight/70 px-3 py-1.5 rounded-full border border-moss/20 w-fit">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Free Cancellation for 48 Hours</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <BookingProgress
        currentStep={step}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {/* Global Two-Column Layout */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Left Column: Active Step Form */}
        <div className="space-y-6">
          {/* STEP 1: TRIP DETAILS */}
          {step === 1 && (
            <div className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-8 shadow-xs space-y-7 animate-toast-in">
              <div className="border-b border-stonewarm/70 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-moss">
                  Step 1 of 4
                </span>
                <h2 className="font-display text-2xl font-bold text-ink mt-0.5">
                  Trip Details &amp; Party Size
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Confirm your departure date and the number of yatris joining this journey.
                </p>
              </div>

              {/* Compact Summary of Selected Trip */}
              <div className="bg-cream2/60 rounded-2xl p-4 sm:p-5 border border-stonewarm/70 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full sm:w-28 h-28 object-cover rounded-2xl shadow-xs shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="mosslight" size="sm">
                      {destinationText}
                    </Badge>
                    <span className="text-xs font-semibold text-muted flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-pine" /> {travelStyleText}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ink leading-snug">
                    {trip.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium pt-0.5">
                    <span className="flex items-center gap-1 text-ink font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{trip.rating}</span>
                      <span className="text-muted font-normal">({trip.reviewsCount || trip.reviewCount || 42} reviews)</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pine" /> {durationText}
                    </span>
                    <span>·</span>
                    <span className="font-bold text-pine">
                      {formatINR(trip.price)} <span className="font-normal text-muted">/ person</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Date Selector & Traveller Counter Form */}
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <DateSelector
                  selectedDate={travelDate}
                  onDateChange={(d) => {
                    setTravelDate(d);
                    setDateError(undefined);
                  }}
                  error={dateError}
                />

                <div className="pt-2">
                  <TravellerCounter
                    adults={adults}
                    childrenCount={childrenCount}
                    onAdultsChange={setAdults}
                    onChildrenChange={setChildrenCount}
                  />
                </div>

                <div className="pt-4 border-t border-stonewarm flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="!rounded-2xl px-6 py-3 font-bold text-sm"
                  >
                    Continue to Traveller Details →
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: TRAVELLER DETAILS */}
          {step === 2 && (
            <div className="space-y-6 animate-toast-in">
              <div className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-stonewarm/70 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-moss">
                      Step 2 of 4
                    </span>
                    <h2 className="font-display text-2xl font-bold text-ink mt-0.5">
                      Traveller Information
                    </h2>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      Please enter legal details as per Government ID for permits and hotel check-in.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-pine bg-cream2 px-3 py-1.5 rounded-xl border border-stonewarm">
                    {totalTravellers} {totalTravellers === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-6">
                  <TravellerForm
                    primaryTraveller={primaryTraveller}
                    onPrimaryChange={handlePrimaryChange}
                    additionalTravellers={additionalTravellers}
                    onAdditionalChange={handleAdditionalChange}
                    totalTravellers={totalTravellers}
                    errors={formErrors}
                  />

                  <div className="pt-4 border-t border-stonewarm flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setStep(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="!rounded-2xl"
                    >
                      ← Back to Trip Details
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="!rounded-2xl px-6 py-3 font-bold text-sm"
                    >
                      Continue to Review →
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW BOOKING */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-8 shadow-xs space-y-7 animate-toast-in">
              <div className="border-b border-stonewarm/70 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-moss">
                  Step 3 of 4
                </span>
                <h2 className="font-display text-2xl font-bold text-ink mt-0.5">
                  Review Your Booking
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Verify your itinerary, travellers, and fare before proceeding to payment.
                </p>
              </div>

              {/* Trip Overview Card */}
              <div className="bg-cream2/60 rounded-2xl p-5 border border-stonewarm/70 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stonewarm/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-moss">
                    Trip Overview
                  </span>
                  <Badge variant="pine" size="sm">
                    {destinationText}
                  </Badge>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                  />
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">
                      {trip.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-pine" /> {travelDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-pine" /> {durationText}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-pine" /> {totalTravellers} Guests
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travellers List with Edit CTA */}
              <div className="bg-white rounded-2xl border border-stonewarm p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stonewarm/60">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      Confirmed Travellers ({totalTravellers})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-pine hover:text-moss underline flex items-center gap-1 cursor-pointer transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Travellers</span>
                  </button>
                </div>

                <div className="divide-y divide-stonewarm/40 text-xs">
                  {/* Primary Traveller */}
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-ink flex items-center gap-2">
                        <span>{primaryTraveller.name}</span>
                        <span className="text-[10px] bg-mosslight text-pine px-2 py-0.5 rounded-full font-extrabold uppercase">
                          Lead Guest
                        </span>
                      </div>
                      <div className="text-[11px] text-muted mt-0.5">
                        {primaryTraveller.email} · {primaryTraveller.phone} · {primaryTraveller.gender || 'Not specified'}
                      </div>
                    </div>
                    <span className="text-muted font-medium">Adult (Primary)</span>
                  </div>

                  {/* Additional Travellers */}
                  {additionalTravellers
                    .slice(0, Math.max(0, totalTravellers - 1))
                    .map((trav, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-ink">
                            {trav.name || `Traveller ${idx + 2}`}
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">
                            Age: {trav.age || '—'} · Gender: {trav.gender || 'Female'}
                          </div>
                        </div>
                        <span className="text-muted font-medium">Guest #{idx + 2}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Coupon Section */}
              <CouponInput
                appliedCoupon={appliedCoupon}
                discountAmount={discountAmount}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />

              {/* Price Breakdown */}
              <PriceBreakdown
                pricePerPerson={trip.price}
                travellers={totalTravellers}
                baseAmount={baseAmount}
                discountAmount={discountAmount}
                couponCode={appliedCoupon || undefined}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
              />

              {/* Terms & Conditions Checkbox */}
              <TermsCheckbox
                agreed={agreedToTerms}
                onAgreeChange={setAgreedToTerms}
              />

              {/* Navigation CTAs */}
              <div className="pt-4 border-t border-stonewarm flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="!rounded-2xl"
                >
                  ← Back to Travellers
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={!agreedToTerms}
                  onClick={handleStep3Submit}
                  className="!rounded-2xl px-6 py-3 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT */}
          {step === 4 && (
            <div className="space-y-6 animate-toast-in">
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                totalAmount={totalAmount}
              />

              <PaymentSummary
                totalAmount={totalAmount}
                paymentMethod={paymentMethod}
                onProceedPayment={handleProceedPayment}
                isProcessing={isProcessing}
              />

              <div className="pt-2 flex justify-start">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="!rounded-2xl"
                >
                  ← Back to Review
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Summary */}
        <TripBookingSummary
          trip={trip}
          travelDate={travelDate}
          adults={adults}
          childrenCount={childrenCount}
          totalTravellers={totalTravellers}
          baseAmount={baseAmount}
          discountAmount={discountAmount}
          couponCode={appliedCoupon || undefined}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
        />
      </div>

      {/* Payment Processing Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[400] bg-pinedark/95 backdrop-blur-md flex items-center justify-center p-6 text-center text-white animate-toast-in">
          <div className="max-w-md w-full p-8 bg-white/5 border border-white/10 rounded-3xl shadow-2xl space-y-5">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-sand animate-spin" />
              <ShieldCheck className="w-6 h-6 text-sand absolute inset-0 m-auto" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Securing your booking...
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xs mx-auto leading-relaxed">
                {processingMsg}
              </p>
            </div>

            <div className="text-[11px] text-white/50 pt-2 border-t border-white/10">
              Please do not refresh or close this tab while your transaction is processed.
            </div>
          </div>
        </div>
      )}

      {/* Polished Payment Failure State Modal */}
      {paymentFailure && (
        <div className="fixed inset-0 z-[500] bg-ink/75 backdrop-blur-sm flex items-center justify-center p-4 animate-toast-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stonewarm text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <XCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-ink">
                {paymentFailure.title}
              </h3>
              <p className="text-sm font-semibold text-pine">
                Your booking has not been charged.
              </p>
              {paymentFailure.message && (
                <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
                  {paymentFailure.message}
                </p>
              )}
            </div>

            <div className="bg-cream2/60 rounded-2xl p-3.5 border border-stonewarm/60 text-xs text-ink/80 text-left space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-moss">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Risk Guarantee</span>
              </div>
              <p className="text-[11px] text-muted leading-normal">
                If funds were debited by your bank or UPI app, Razorpay will automatically reverse them to your source account within 2–4 business days.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 justify-center !rounded-2xl py-3 font-bold text-sm"
                onClick={() => {
                  setPaymentFailure(null);
                  handleProceedPayment();
                }}
              >
                Try Again
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 justify-center !rounded-2xl py-3 font-bold text-sm"
                onClick={() => {
                  setPaymentFailure(null);
                  setStep(3);
                }}
              >
                Back to Booking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Polished Payment Pending State Modal */}
      {paymentPending && (
        <div className="fixed inset-0 z-[500] bg-ink/75 backdrop-blur-sm flex items-center justify-center p-4 animate-toast-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stonewarm text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-ink">
                We're confirming your payment
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Please hold on while we verify your transaction with your banking provider. Do not close or refresh this tab.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 justify-center !rounded-2xl py-3 font-bold text-sm"
                disabled={isVerifyingPending}
                onClick={handleCheckPendingStatus}
              >
                {isVerifyingPending ? 'Checking…' : 'Check Status'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 justify-center !rounded-2xl py-3 font-bold text-sm"
                onClick={() => setPaymentPending(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
