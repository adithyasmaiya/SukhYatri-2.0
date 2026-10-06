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
  Compass,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const AdminDestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDestination, setTargetDestination] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDestinations({ search });
      setDestinations(res.destinations || []);
    } catch (err: any) {
      toast(err.message || 'Unable to load destinations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleTogglePublish = async (dest: any) => {
    try {
      const updated = await adminService.toggleDestinationPublish(dest._id || dest.slug);
      setDestinations((prev) =>
        prev.map((d) =>
          (d._id || d.slug) === (dest._id || dest.slug)
            ? { ...d, isPublished: updated.isPublished }
            : d
        )
      );
      toast(
        `Destination "${dest.name}" is now ${updated.isPublished ? 'Published' : 'Draft'}`,
        'success'
      );
    } catch (err: any) {
      toast(err.message || 'Failed to update destination', 'error');
    }
  };

  const openDeleteModal = (dest: any) => {
    setTargetDestination(dest);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetDestination) return;
    try {
      setActionLoading(true);
      await adminService.deleteDestination(targetDestination._id || targetDestination.slug);
      toast(`Destination "${targetDestination.name}" deleted successfully`, 'success');
      setDeleteModalOpen(false);
      fetchDestinations();
    } catch (err: any) {
      toast(err.message || 'Failed to delete destination', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Destinations CMS</h2>
          <p className="text-xs text-muted mt-0.5">
            Manage regional destination guides, cultural highlights & travel seasons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDestinations}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            size="sm"
            onClick={() => navigate('/admin/destinations/new')}
            className="bg-moss hover:bg-moss/90 text-white flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Destination</span>
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4 flex items-center justify-between shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchDestinations();
          }}
          className="flex items-center gap-2 bg-[#F2F4F3] rounded-xl px-3.5 py-2 w-full sm:w-80"
        >
          <Search className="w-3.5 h-3.5 text-muted shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination name, state…"
            className="bg-transparent text-xs font-medium outline-none w-full text-ink placeholder:text-muted"
          />
        </form>

        <span className="text-xs font-semibold text-muted">
          {destinations.length} Regional Hubs
        </span>
      </div>

      {/* Destinations Cards Grid / Table */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-[#EEF1EF] text-[10.5px] uppercase font-bold text-muted bg-[#F8FAF9]">
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4 text-center">Best Season</th>
                <th className="py-3.5 px-4 text-center">Trips</th>
                <th className="py-3.5 px-4 text-center">Visibility</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F5F3]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : destinations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted">
                    <p className="font-display font-semibold text-base text-ink mb-2">
                      No destinations found
                    </p>
                    <Button
                      size="sm"
                      onClick={() => navigate('/admin/destinations/new')}
                      className="bg-moss hover:bg-moss/90 text-white"
                    >
                      Add Destination
                    </Button>
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr key={dest._id || dest.slug} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={dest.heroImage || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80'}
                          alt={dest.name}
                          className="w-12 h-10 object-cover rounded-lg shrink-0 border border-gray-100"
                        />
                        <div>
                          <div className="font-bold text-ink leading-tight">{dest.name}</div>
                          <div className="text-[10.5px] text-muted font-mono">/{dest.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-ink">{dest.state}</td>
                    <td className="py-3 px-4 text-center text-muted font-medium whitespace-nowrap">
                      {dest.bestTimeToVisit || 'All Year'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-ink">
                      {dest.relatedTripIds?.length || 4}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(dest)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          dest.isPublished
                            ? 'bg-moss/10 text-moss hover:bg-moss/20'
                            : 'bg-gray-100 text-muted hover:bg-gray-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {dest.isPublished ? (
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
                      {formatDate(dest.updatedAt || dest.createdAt || new Date())}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2.5 py-1 text-xs"
                        onClick={() => navigate(`/admin/destinations/${dest._id || dest.slug}/edit`)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>

                      <Link
                        to={`/destination/${dest.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#DFE5E2] text-muted hover:text-ink hover:bg-[#F2F4F3] transition"
                        title="Preview Public Guide"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => openDeleteModal(dest)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-clay hover:bg-clay/10 transition"
                        title="Delete Destination"
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
        title={`Delete Destination "${targetDestination?.name}"?`}
        message="This action will delete this destination guide and remove it from public discovery. Packages in this destination will remain intact. This action cannot be undone."
        confirmText="Delete Destination"
        variant="danger"
        isLoading={actionLoading}
      />
    </div>
  );
};
