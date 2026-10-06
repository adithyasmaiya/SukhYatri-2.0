import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const AdminPackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetPackage, setTargetPackage] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPackages({
        search,
        status: statusFilter,
      });
      setPackages(res.packages || []);
    } catch (err: any) {
      toast(err.message || 'Unable to load packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [statusFilter]);

  const handleTogglePublish = async (pkg: any) => {
    try {
      const updated = await adminService.togglePackagePublish(pkg._id || pkg.id);
      setPackages((prev) =>
        prev.map((p) =>
          (p._id || p.id) === (pkg._id || pkg.id) ? { ...p, isPublished: updated.isPublished } : p
        )
      );
      toast(
        `Package "${pkg.title}" is now ${updated.isPublished ? 'Published' : 'Draft'}`,
        'success'
      );
    } catch (err: any) {
      toast(err.message || 'Failed to update package status', 'error');
    }
  };

  const openDeleteModal = (pkg: any) => {
    setTargetPackage(pkg);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetPackage) return;
    try {
      setActionLoading(true);
      await adminService.deletePackage(targetPackage._id || targetPackage.id);
      toast(`Package "${targetPackage.title}" deleted successfully`, 'success');
      setDeleteModalOpen(false);
      fetchPackages();
    } catch (err: any) {
      toast(err.message || 'Failed to delete package', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Package Management</h2>
          <p className="text-xs text-muted mt-0.5">
            Curate and administer verified tour packages, itineraries & pricing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPackages}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            size="sm"
            onClick={() => navigate('/admin/packages/new')}
            className="bg-moss hover:bg-moss/90 text-white flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Package</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPackages();
          }}
          className="flex items-center gap-2 bg-[#F2F4F3] rounded-xl px-3.5 py-2 w-full sm:w-80"
        >
          <Search className="w-3.5 h-3.5 text-muted shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search package title, destination, slug…"
            className="bg-transparent text-xs font-medium outline-none w-full text-ink placeholder:text-muted"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F2F4F3] text-xs font-bold rounded-xl px-3 py-2 outline-none text-ink cursor-pointer"
          >
            <option value="all">All Packages ({packages.length})</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Packages Table & Cards */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="border-b border-[#EEF1EF] text-[10.5px] uppercase font-bold text-muted bg-[#F8FAF9]">
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4 text-right">Price/Person</th>
                <th className="py-3.5 px-3 text-center">Rating</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F5F3]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="py-4 px-4">
                      <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted">
                    <div className="max-w-xs mx-auto space-y-3">
                      <p className="font-display font-semibold text-base text-ink">No packages yet</p>
                      <p className="text-xs">
                        {search
                          ? 'No packages matched your search keyword.'
                          : 'Create your first travel package to begin taking bookings.'}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => navigate('/admin/packages/new')}
                        className="bg-moss hover:bg-moss/90 text-white"
                      >
                        Create New Package
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg._id || pkg.id} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pkg.heroImage || pkg.image || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=400&q=80'}
                          alt={pkg.title}
                          className="w-12 h-10 object-cover rounded-lg shrink-0 border border-gray-100"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-ink leading-tight truncate max-w-[220px]">
                            {pkg.title}
                          </div>
                          <div className="text-[10px] text-muted font-mono truncate">
                            /{pkg.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-ink">
                      {pkg.destinationName || pkg.destination?.name || 'India'}
                    </td>
                    <td className="py-3 px-4 text-muted font-medium whitespace-nowrap">
                      {pkg.duration || `${pkg.days || 4} Days`}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-ink whitespace-nowrap">
                      {formatINR(pkg.price)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap font-bold text-moss">
                      ★ {pkg.rating || 4.8}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(pkg)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          pkg.isPublished
                            ? 'bg-moss/10 text-moss hover:bg-moss/20'
                            : 'bg-gray-100 text-muted hover:bg-gray-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {pkg.isPublished ? (
                          <>
                            <Eye className="w-2.5 h-2.5" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-muted text-[11px] whitespace-nowrap">
                      {formatDate(pkg.updatedAt || pkg.createdAt || new Date())}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2.5 py-1 text-xs"
                        onClick={() => navigate(`/admin/packages/${pkg._id || pkg.id}/edit`)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>

                      <Link
                        to={`/booking/${pkg._id || pkg.id}`}
                        target="_blank"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#DFE5E2] text-muted hover:text-ink hover:bg-[#F2F4F3] transition"
                        title="Preview Customer Checkout"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => openDeleteModal(pkg)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-clay hover:bg-clay/10 transition"
                        title="Delete Package"
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
        title={`Delete "${targetPackage?.title}"?`}
        message="Are you sure you want to delete this package? This package will no longer be available for booking. This action cannot be undone."
        confirmText="Delete Package"
        variant="danger"
        isLoading={actionLoading}
      />
    </div>
  );
};
