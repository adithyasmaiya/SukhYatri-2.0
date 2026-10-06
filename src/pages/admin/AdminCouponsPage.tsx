import React, { useState, useEffect } from 'react';
import {
  TicketPercent,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage: React.FC = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create/Edit Modal State
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 5000,
    minBookingAmount: 20000,
    usageLimit: 100,
    validFrom: new Date().toISOString().slice(0, 10),
    validUntil: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetCoupon, setTargetCoupon] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCoupons({ search });
      setCoupons(res.coupons || []);
    } catch (err: any) {
      toast(err.message || 'Error fetching coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      maxDiscount: 5000,
      minBookingAmount: 20000,
      usageLimit: 100,
      validFrom: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      isActive: true,
    });
    setFormModalOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType || 'percentage',
      discountValue: c.discountValue || c.discount || 10,
      maxDiscount: c.maxDiscount || 5000,
      minBookingAmount: c.minBookingAmount || 20000,
      usageLimit: c.usageLimit || 100,
      validFrom: c.validFrom ? new Date(c.validFrom).toISOString().slice(0, 10) : '',
      validUntil: c.validUntil ? new Date(c.validUntil).toISOString().slice(0, 10) : '',
      isActive: c.isActive !== undefined ? c.isActive : true,
    });
    setFormModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast('Coupon code is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon._id || editingCoupon.id, formData);
        toast(`Coupon "${formData.code.toUpperCase()}" updated successfully`, 'success');
      } else {
        await adminService.createCoupon(formData);
        toast(`Coupon "${formData.code.toUpperCase()}" created successfully`, 'success');
      }
      setFormModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast(err.message || 'Failed to save coupon', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (c: any) => {
    try {
      const res = await adminService.toggleCouponActive(c._id || c.id);
      setCoupons((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (c._id || c.id) ? { ...item, isActive: res.isActive } : item
        )
      );
      toast(`Coupon "${c.code}" is now ${res.isActive ? 'Active' : 'Inactive'}`, 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const openDeleteModal = (c: any) => {
    setTargetCoupon(c);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetCoupon) return;
    try {
      setActionLoading(true);
      await adminService.deleteCoupon(targetCoupon._id || targetCoupon.id);
      toast(`Coupon "${targetCoupon.code}" deleted successfully`, 'success');
      setDeleteModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast(err.message || 'Failed to delete coupon', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Coupons & Promotions</h2>
          <p className="text-xs text-muted mt-0.5">
            Configure promotional promo codes, booking discount thresholds & usage caps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCoupons}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="bg-moss hover:bg-moss/90 text-white flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </Button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-[#EEF1EF] text-[10.5px] uppercase font-bold text-muted bg-[#F8FAF9]">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-3 text-center">Min Booking</th>
                <th className="py-3.5 px-3 text-center">Usage</th>
                <th className="py-3.5 px-4">Validity Range</th>
                <th className="py-3.5 px-3 text-center">Status</th>
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
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted">
                    <p className="font-display font-semibold text-base text-ink mb-1">
                      No promo coupons active
                    </p>
                    <p className="text-xs mb-3">Create your first discount coupon code.</p>
                    <Button size="sm" onClick={openCreateModal} className="bg-moss text-white">
                      Create Coupon
                    </Button>
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-ink bg-gray-100 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                          {c.code}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-moss">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue || c.discount || 10}% OFF (Up to ${formatINR(c.maxDiscount || 5000)})`
                        : `${formatINR(c.discountValue || c.discount || 2000)} Flat OFF`}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-ink">
                      {formatINR(c.minBookingAmount || 0)}
                    </td>
                    <td className="py-3 px-3 text-center text-muted font-medium">
                      {c.usedCount || 0} / {c.usageLimit || '∞'}
                    </td>
                    <td className="py-3 px-4 text-muted text-[11px] whitespace-nowrap">
                      {c.validUntil ? formatDate(c.validUntil) : 'Ongoing'}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition ${
                          c.isActive
                            ? 'bg-moss/10 text-moss hover:bg-moss/20'
                            : 'bg-gray-100 text-muted hover:bg-gray-200'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2.5 py-1 text-xs"
                        onClick={() => openEditModal(c)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>

                      <button
                        onClick={() => openDeleteModal(c)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-clay hover:bg-clay/10 transition"
                        title="Delete Coupon"
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

      {/* Create / Edit Coupon Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : 'Create Promo Coupon'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveCoupon} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Coupon Code *</label>
              <input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MONSOON2026"
                className="w-full bg-[#F2F4F3] text-xs font-mono font-bold rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink uppercase"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none text-ink"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">
                Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'}) *
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: Number(e.target.value) })
                }
                className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none text-ink"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">Max Discount Cap (₹)</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none text-ink"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Min Booking Order (₹)</label>
              <input
                type="number"
                value={formData.minBookingAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minBookingAmount: Number(e.target.value) })
                }
                className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none text-ink"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">Usage Limit (Times)</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none text-ink"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Valid From</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3 py-2 outline-none text-ink"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">Valid Until</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3 py-2 outline-none text-ink"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-ink">Active State</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                formData.isActive ? 'bg-moss text-white' : 'bg-gray-200 text-ink'
              }`}
            >
              {formData.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-moss text-white" loading={submitting}>
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete Coupon "${targetCoupon?.code}"?`}
        message="Are you sure you want to delete this coupon? Travelers with unsubmitted checkouts will no longer be able to apply it. This cannot be undone."
        confirmText="Delete Coupon"
        variant="danger"
        isLoading={actionLoading}
      />
    </div>
  );
};
