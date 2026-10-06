import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Users,
  Compass,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const AdminBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getBookingById(id);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Unable to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      await adminService.cancelBooking(id, cancelReason || 'Admin operational adjustment');
      toast(`Booking ${id} has been cancelled successfully`, 'success');
      setCancelModalOpen(false);
      fetchBooking();
    } catch (err: any) {
      toast(err.message || 'Cancellation failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-48" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-3xl" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-8 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-clay mx-auto" />
        <h3 className="font-display text-xl font-bold text-ink">Booking Not Found</h3>
        <p className="text-xs text-muted max-w-sm mx-auto">
          {error || `No booking matching ID "${id}" was found in the database.`}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/bookings')}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  const { booking, payment, user } = data;
  const isCancelled = booking.bookingStatus === 'cancelled';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="w-9 h-9 rounded-xl bg-white border border-[#DFE5E2] text-ink flex items-center justify-center hover:bg-[#F2F4F3] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-ink">{booking.bookingId}</h2>
              <Badge
                variant={
                  booking.bookingStatus === 'confirmed'
                    ? 'success'
                    : isCancelled
                    ? 'error'
                    : 'warning'
                }
              >
                {booking.bookingStatus}
              </Badge>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Booked on {formatDate(booking.createdAt)}
            </p>
          </div>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2">
          {!isCancelled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="text-clay border-clay/30 hover:bg-clay/5"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Cancel Booking
            </Button>
          )}

          {user && (
            <Link
              to={`/admin/users/${user._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F4F3] hover:bg-ink hover:text-white text-xs font-semibold text-ink transition"
            >
              <User className="w-3.5 h-3.5" />
              View Customer
            </Link>
          )}
        </div>
      </div>

      {/* Cancellation Notice Banner (If cancelled) */}
      {isCancelled && (
        <div className="p-5 bg-clay/10 border border-clay/20 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-clay font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Booking Cancelled</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-xs pt-1">
            <div>
              <span className="text-muted block">Cancellation Date</span>
              <span className="font-semibold text-ink">
                {formatDate(booking.cancellation?.cancelledAt)}
              </span>
            </div>
            <div>
              <span className="text-muted block">Reason</span>
              <span className="font-semibold text-ink">
                {booking.cancellation?.reason || 'Administrative adjustment'}
              </span>
            </div>
            <div>
              <span className="text-muted block">Refund Status & Amount</span>
              <span className="font-semibold text-ink">
                {booking.refundStatus?.toUpperCase() || 'INITIATED'} · {formatINR(booking.cancellation?.refundAmount || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Info Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 1. Customer Details */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F2]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sand/20 text-ink flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-ink">Primary Guest</h3>
            </div>
            {user && (
              <span className="text-[10px] bg-moss/10 text-moss px-2 py-0.5 rounded-full font-bold">
                Registered
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted block text-[11px]">Full Name</span>
              <span className="font-semibold text-ink text-sm">
                {booking.primaryTraveller?.name || 'Guest'}
              </span>
            </div>
            <div>
              <span className="text-muted block text-[11px]">Email Address</span>
              <span className="font-semibold text-ink">{booking.primaryTraveller?.email}</span>
            </div>
            <div>
              <span className="text-muted block text-[11px]">Contact Phone</span>
              <span className="font-semibold text-ink">{booking.primaryTraveller?.phone}</span>
            </div>
            <div>
              <span className="text-muted block text-[11px]">Special Requests</span>
              <span className="text-ink italic">
                {booking.specialRequests || 'No special requirements specified'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Trip Details */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F2]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-moss/10 text-moss flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-ink">Trip Details</h3>
            </div>
            <span className="text-[10px] bg-[#F2F4F3] text-ink px-2 py-0.5 rounded-full font-bold">
              {booking.destinationName}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted block text-[11px]">Itinerary Title</span>
              <span className="font-semibold text-ink text-sm">
                {booking.tripSnapshot?.title || 'Custom Tour'}
              </span>
            </div>
            <div>
              <span className="text-muted block text-[11px]">Travel Date</span>
              <span className="font-semibold text-ink flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-moss" />
                {formatDate(booking.travelDate)}
              </span>
            </div>
            <div>
              <span className="text-muted block text-[11px]">Duration</span>
              <span className="font-semibold text-ink">
                {booking.tripSnapshot?.duration || 'Multi-day itinerary'}
              </span>
            </div>
            <div>
              <span className="text-muted block text-[11px]">Room / Departure Slot</span>
              <span className="font-semibold text-ink">
                {booking.roomCategory || 'Standard'} · {booking.slot || 'Standard Morning'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Pricing Breakdown */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F2]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pine/10 text-pine flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-ink">Pricing Summary</h3>
            </div>
            <span className="text-xs font-bold text-moss">
              {booking.paymentStatus === 'paid' ? 'Paid in Full' : booking.paymentStatus?.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal ({booking.travellers || 1} Guests)</span>
              <span className="font-medium text-ink">
                {formatINR(booking.pricing?.subtotal || booking.pricing?.totalAmount || 0)}
              </span>
            </div>

            {booking.pricing?.discount > 0 && (
              <div className="flex justify-between text-moss">
                <span>Promotional Discount</span>
                <span>-{formatINR(booking.pricing.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted">Taxes & GST (5%)</span>
              <span className="font-medium text-ink">
                {formatINR(booking.pricing?.taxes || 0)}
              </span>
            </div>

            <div className="pt-2 border-t border-[#F0F4F2] flex justify-between items-center">
              <span className="font-bold text-ink">Total Order Amount</span>
              <span className="font-display text-lg font-bold text-ink">
                {formatINR(booking.pricing?.totalAmount || booking.amountPaid || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center text-moss font-bold text-[11px]">
              <span>Realized Amount Paid</span>
              <span>{formatINR(booking.amountPaid || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Passenger Manifest & Verified Payment Gateway Records */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Passenger Manifest */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F4F2]">
            <Users className="w-4 h-4 text-muted" />
            <h3 className="font-display font-bold text-base text-ink">
              Traveller Manifest ({1 + (booking.additionalTravellers?.length || 0)} Guests)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EEF1EF] text-[10px] text-muted uppercase font-bold">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2 text-center">Age / Gender</th>
                  <th className="pb-2">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F5F3]">
                {/* Primary Traveller */}
                <tr>
                  <td className="py-2.5 font-bold text-moss">Primary</td>
                  <td className="py-2.5 font-semibold text-ink">
                    {booking.primaryTraveller?.name}
                  </td>
                  <td className="py-2.5 text-center text-muted">Lead Guest</td>
                  <td className="py-2.5 text-muted">{booking.primaryTraveller?.phone}</td>
                </tr>

                {/* Additional Travellers */}
                {booking.additionalTravellers?.map((traveller: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2.5 text-muted font-medium">Guest #{idx + 2}</td>
                    <td className="py-2.5 font-semibold text-ink">{traveller.name}</td>
                    <td className="py-2.5 text-center text-muted">
                      {traveller.age ? `${traveller.age}y` : '-'} · {traveller.gender || '-'}
                    </td>
                    <td className="py-2.5 text-muted">{traveller.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Razorpay Gateway Audit Trail */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F4F2]">
            <ShieldCheck className="w-4 h-4 text-moss" />
            <h3 className="font-display font-bold text-base text-ink">Gateway Payment Record</h3>
          </div>

          {payment ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted block text-[11px]">Payment Reference</span>
                <span className="font-mono font-bold text-ink">{payment.paymentId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted block text-[11px]">Razorpay Order ID</span>
                  <span className="font-mono text-ink text-[11px] truncate block">
                    {payment.razorpayOrderId || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Razorpay Payment ID</span>
                  <span className="font-mono text-ink text-[11px] truncate block">
                    {payment.razorpayPaymentId || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted block text-[11px]">Payment Method</span>
                  <span className="font-semibold text-ink uppercase">{payment.method || 'UPI'}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Gateway Status</span>
                  <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Processed At</span>
                <span className="font-medium text-ink">{formatDate(payment.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted space-y-2">
              <Clock className="w-8 h-8 text-muted/50 mx-auto" />
              <p>No separate payment transaction record found.</p>
              <p className="text-[11px]">
                Booking registered status: <span className="font-bold">{booking.paymentStatus}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        title={`Cancel Booking ${booking.bookingId}?`}
        message="This operation will formally cancel this trip reservation, trigger the cancellation refund policy, and notify operations. This cannot be undone."
        confirmText="Confirm Cancellation"
        variant="danger"
        isLoading={actionLoading}
      />
    </div>
  );
};
