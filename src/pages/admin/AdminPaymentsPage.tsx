import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Download,
  CreditCard,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const AdminPaymentsPage: React.FC = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getPayments({
        page,
        limit: 15,
        search,
        status: statusFilter,
        method: methodFilter,
      });
      setPayments(res.payments || []);
      setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err: any) {
      toast(err.message || 'Error fetching payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter, methodFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments(1);
  };

  const handleExportCsv = async () => {
    try {
      toast('Generating Payments CSV export…', 'info');
      await adminService.exportPaymentsCsv({
        search,
        status: statusFilter,
        method: methodFilter,
      });
      toast('Payments CSV exported successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Export failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Payment Transactions</h2>
          <p className="text-xs text-muted mt-0.5">
            Razorpay checkout records, payment gateway receipts & refund logs
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
            onClick={() => fetchPayments(pagination.page)}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-[#F2F4F3] rounded-xl px-3.5 py-2 w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-muted shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Payment ID, Booking ID, customer…"
            className="bg-transparent text-xs font-medium outline-none w-full text-ink placeholder:text-muted"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F2F4F3] text-xs font-bold rounded-xl px-3 py-2 outline-none text-ink cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-[#F2F4F3] text-xs font-bold rounded-xl px-3 py-2 outline-none text-ink cursor-pointer"
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="border-b border-[#EEF1EF] text-[10.5px] uppercase font-bold text-muted bg-[#F8FAF9]">
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-3 text-center">Method</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4">Gateway Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F5F3]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="py-4 px-4">
                      <div className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted">
                    <p className="font-display font-semibold text-base text-ink mb-1">
                      No payments found
                    </p>
                    <p className="text-xs">No transactions match your current search or filters.</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id || p.paymentId} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      {p.paymentId}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-moss">
                      <Link to={`/admin/bookings/${p.bookingId}`} className="hover:underline">
                        {p.bookingId}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ink leading-tight">{p.customerName}</div>
                      <div className="text-[10px] text-muted">{p.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-ink whitespace-nowrap">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3 px-3 text-center uppercase font-semibold text-muted text-[11px]">
                      {p.method || 'UPI'}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <Badge
                        variant={
                          p.status === 'paid'
                            ? 'success'
                            : p.status === 'refunded'
                            ? 'default'
                            : p.status === 'failed'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted text-[11px] truncate max-w-[140px]">
                      {p.razorpayOrderId || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-muted text-[11px] whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/bookings/${p.bookingId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F4F3] hover:bg-ink hover:text-white text-ink font-semibold text-[11px] transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Booking</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-[#EEF1EF] px-5 py-3.5 flex items-center justify-between text-xs text-muted">
            <div>
              Showing page <span className="font-bold text-ink">{pagination.page}</span> of{' '}
              <span className="font-bold text-ink">{pagination.totalPages}</span> ({pagination.total}{' '}
              total payments)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPayments(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="px-2.5 py-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPayments(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="px-2.5 py-1"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
