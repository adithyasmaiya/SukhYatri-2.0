import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle,
  EyeOff,
  Trash2,
  RefreshCw,
  Search,
  Star,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage: React.FC = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetReview, setTargetReview] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReviews({
        search,
        status: statusFilter,
      });
      setReviews(res.reviews || []);
    } catch (err: any) {
      toast(err.message || 'Error fetching reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      await adminService.updateReviewStatus(id, newStatus);
      setReviews((prev) =>
        prev.map((r) => ((r._id || r.id) === id ? { ...r, status: newStatus } : r))
      );
      toast(`Review status set to ${newStatus}`, 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update review status', 'error');
    }
  };

  const openDeleteModal = (r: any) => {
    setTargetReview(r);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetReview) return;
    try {
      setActionLoading(true);
      await adminService.deleteReview(targetReview._id || targetReview.id);
      toast('Review deleted successfully', 'success');
      setDeleteModalOpen(false);
      fetchReviews();
    } catch (err: any) {
      toast(err.message || 'Failed to delete review', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Review Moderation</h2>
          <p className="text-xs text-muted mt-0.5">
            Customer feedback, verified guest ratings & public review display permissions
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchReviews} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchReviews();
          }}
          className="flex items-center gap-2 bg-[#F2F4F3] rounded-xl px-3.5 py-2 w-full sm:w-80"
        >
          <Search className="w-3.5 h-3.5 text-muted shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, trip title…"
            className="bg-transparent text-xs font-medium outline-none w-full text-ink placeholder:text-muted"
          />
        </form>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F2F4F3] text-xs font-bold rounded-xl px-3 py-2 outline-none text-ink cursor-pointer"
          >
            <option value="all">All ({reviews.length})</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Moderation</option>
            <option value="rejected">Hidden / Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-[#EEF1EF] text-[10.5px] uppercase font-bold text-muted bg-[#F8FAF9]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Trip</th>
                <th className="py-3.5 px-3 text-center">Rating</th>
                <th className="py-3.5 px-4">Review Text</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F5F3]">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted">
                    <p className="font-display font-semibold text-base text-ink mb-1">
                      No customer reviews found
                    </p>
                    <p className="text-xs">No reviews match your active filter.</p>
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r._id || r.id} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3 px-4 font-semibold text-ink whitespace-nowrap">
                      {r.userName || r.user?.name || 'Yatri Guest'}
                    </td>
                    <td className="py-3 px-4 font-medium text-ink max-w-[160px] truncate">
                      {r.tripTitle || r.trip?.title || 'Curated Itinerary'}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap font-bold text-moss">
                      ★ {r.rating || 5}
                    </td>
                    <td className="py-3 px-4 max-w-sm truncate text-ink">
                      "{r.comment || r.review || r.text || 'Wonderful authentic experience.'}"
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <Badge
                        variant={
                          r.status === 'approved'
                            ? 'success'
                            : r.status === 'rejected'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {r.status || 'approved'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted text-[11px] whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(r._id || r.id, 'approved')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-moss/10 text-moss hover:bg-moss/20 font-semibold text-[11px] transition"
                          title="Approve Review"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}

                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(r._id || r.id, 'rejected')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-muted hover:bg-gray-200 font-semibold text-[11px] transition"
                          title="Hide Review"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                      )}

                      <button
                        onClick={() => openDeleteModal(r)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-clay hover:bg-clay/10 transition"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Customer Review?"
        message="Are you sure you want to permanently delete this customer review? This action cannot be undone."
        confirmText="Delete Review"
        variant="danger"
        isLoading={actionLoading}
      />
    </div>
  );
};
