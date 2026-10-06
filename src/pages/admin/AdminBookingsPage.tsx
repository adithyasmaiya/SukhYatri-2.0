import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Eye,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const AdminBookingsPage: React.FC = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [bookingStatus, setBookingStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [destination, setDestination] = useState('all');
  const [sort, setSort] = useState('newest');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetBooking, setTargetBooking] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getBookings({
        page,
        limit: 10,
        search,
        bookingStatus,
        paymentStatus,
        destination,
        sort,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setBookings(res.bookings || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err: any) {
      toast(err.message || 'Error fetching bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [bookingStatus, paymentStatus, destination, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(1);
  };

  const handleExportCsv = async () => {
    try {
      toast('Generating CSV export from active filters…', 'info');
      await adminService.exportBookingsCsv({
        search,
        bookingStatus,
        paymentStatus,
        destination,
        sort,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      toast('Bookings CSV exported successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Export failed', 'error');
    }
  };

  const openCancelModal = (b: any) => {
    setTargetBooking(b);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!targetBooking) return;
    try {
      setActionLoading(true);
      await adminService.cancelBooking(targetBooking.bookingId, cancelReason || 'Admin operational adjustment');
      toast(`Booking ${targetBooking.bookingId} cancelled and refund initiated`, 'success');
      setCancelModalOpen(false);
      fetchBookings(pagination.page);
    } catch (err: any) {
      toast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Booking Management</h2>
          <p className="text-xs text-muted mt-0.5">
            Total {pagination.total} guest reservations across all active itineraries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBookings(pagination.page)}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-4.5 shadow-xs space-y-3">
        {/* Search Row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 flex items-center gap-2 bg-[#F2F4F3] rounded-xl px-3.5 py-2.5 border border-transparent focus-within:border-moss/40 focus-within:bg-white transition">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Booking ID, customer name, email, phone, trip name…"
              className="bg-transparent text-xs font-medium outline-none w-full text-ink placeholder:text-muted"
            />
          </div>
          <Button type="submit" size="sm" className="bg-ink hover:bg-ink/90 text-white shrink-0">
            Search
          </Button>
        </form>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-[#F0F4F2]">
          {/* Booking Status */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase block mb-1">
              Booking Status
            </label>
            <select
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-2.5 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase block mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-2.5 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase block mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-2.5 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_amount">Highest Amount</option>
              <option value="lowest_amount">Lowest Amount</option>
              <option value="travel_date">Travel Date</option>
            </select>
          </div>

          {/* Min Amount */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase block mb-1">Min ₹</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              onBlur={() => fetchBookings(1)}
              placeholder="0"
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-2.5 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase block mb-1">Max ₹</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              onBlur={() => fetchBookings(1)}
              placeholder="500000"
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-2.5 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="border-b border-[#EEF1EF] text-[10.5px] uppercase font-bold text-muted bg-[#F8FAF9]">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Trip</th>
                <th className="py-3 px-4">Travel Date</th>
                <th className="py-3 px-3 text-center">Guests</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Payment</th>
                <th className="py-3 px-3 text-center">Booking</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F5F3]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={10} className="py-4 px-4">
                      <div className="h-6 bg-gray-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-muted">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-display font-semibold text-base text-ink">
                        No bookings found
                      </p>
                      <p className="text-xs">
                        No bookings match your current search criteria or active filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id || b.bookingId} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-ink">
                      {b.bookingId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink leading-tight">
                        {b.primaryTraveller?.name || 'Guest'}
                      </div>
                      <div className="text-[10.5px] text-muted">{b.primaryTraveller?.email}</div>
                      <div className="text-[10px] text-muted/70">{b.primaryTraveller?.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="font-medium text-ink truncate leading-tight">
                        {b.tripSnapshot?.title || 'Custom Tour'}
                      </div>
                      <div className="text-[10.5px] text-muted">{b.destinationName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-ink whitespace-nowrap">
                      {formatDate(b.travelDate)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-muted">
                      {b.travellers || 1}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-ink whitespace-nowrap">
                      {formatINR(b.pricing?.totalAmount || b.amountPaid || 0)}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <Badge
                        variant={
                          b.paymentStatus === 'paid'
                            ? 'success'
                            : b.paymentStatus === 'refunded'
                            ? 'default'
                            : b.paymentStatus === 'failed'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {b.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <Badge
                        variant={
                          b.bookingStatus === 'confirmed'
                            ? 'success'
                            : b.bookingStatus === 'cancelled'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {b.bookingStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted text-[11px] whitespace-nowrap">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <Link
                        to={`/admin/bookings/${b.bookingId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F4F3] hover:bg-ink hover:text-white text-ink font-semibold text-[11px] transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>

                      {b.bookingStatus !== 'cancelled' && (
                        <button
                          onClick={() => openCancelModal(b)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-clay hover:bg-clay/10 font-semibold text-[11px] transition"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-side Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-[#EEF1EF] px-5 py-3.5 flex items-center justify-between text-xs text-muted">
            <div>
              Showing page <span className="font-bold text-ink">{pagination.page}</span> of{' '}
              <span className="font-bold text-ink">{pagination.totalPages}</span> ({pagination.total}{' '}
              total bookings)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchBookings(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="px-2.5 py-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchBookings(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="px-2.5 py-1"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancelBooking}
        title={`Cancel Booking ${targetBooking?.bookingId}?`}
        message="This will update the reservation status to Cancelled, calculate refundable amount per policy, and trigger refund processing. This action is irreversible."
        confirmText="Confirm Cancellation"
        variant="danger"
        isLoading={actionLoading}
      />
    </div>
  );
};
