import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  User,
  Shield,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        page,
        limit: 15,
        search,
        role: roleFilter,
        status: statusFilter,
      });
      setUsers(res.users || []);
      setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err: any) {
      toast(err.message || 'Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleExportCsv = async () => {
    try {
      toast('Generating Users CSV export…', 'info');
      await adminService.exportUsersCsv({
        search,
        role: roleFilter,
        status: statusFilter,
      });
      toast('Users CSV exported successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Export failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">User & Guest Management</h2>
          <p className="text-xs text-muted mt-0.5">
            Registered travelers, account permissions, booking history & customer lifetime metrics
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
            onClick={() => fetchUsers(pagination.page)}
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
            placeholder="Search by name, email, phone…"
            className="bg-transparent text-xs font-medium outline-none w-full text-ink placeholder:text-muted"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#F2F4F3] text-xs font-bold rounded-xl px-3 py-2 outline-none text-ink cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">Travelers / Guests</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F2F4F3] text-xs font-bold rounded-xl px-3 py-2 outline-none text-ink cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="border-b border-[#EEF1EF] text-[10.5px] uppercase font-bold text-muted bg-[#F8FAF9]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-3 text-center">Role</th>
                <th className="py-3.5 px-3 text-center">Email Verified</th>
                <th className="py-3.5 px-3 text-center">Bookings</th>
                <th className="py-3.5 px-4 text-right">Total Spent</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F5F3]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="py-4 px-4">
                      <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted">
                    <p className="font-display font-semibold text-base text-ink mb-1">
                      No users found
                    </p>
                    <p className="text-xs">No registered accounts match your current filters.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sand text-ink flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-ink leading-tight flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.status === 'suspended' && (
                              <span className="text-[9px] bg-clay/10 text-clay px-1.5 py-0.2 rounded font-bold">
                                Suspended
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted font-medium">
                      {u.phone || 'Not provided'}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-moss/10 text-moss'
                            : 'bg-gray-100 text-muted'
                        }`}
                      >
                        {u.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {u.emailVerified ? (
                        <span className="text-moss font-semibold flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 inline" /> Verified
                        </span>
                      ) : (
                        <span className="text-muted text-[11px]">Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-ink">
                      {u.bookingCount || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-ink whitespace-nowrap">
                      {formatINR(u.totalSpent || 0)}
                    </td>
                    <td className="py-3 px-4 text-muted text-[11px] whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/users/${u._id || u.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F4F3] hover:bg-ink hover:text-white text-ink font-semibold text-[11px] transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
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
              registered users)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="px-2.5 py-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(pagination.page + 1)}
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
