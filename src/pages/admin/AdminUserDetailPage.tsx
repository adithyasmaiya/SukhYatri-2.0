import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Shield,
  CreditCard,
  CalendarCheck,
  CheckCircle,
  AlertCircle,
  Eye,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const AdminUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Role modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  // Status modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const fetchUser = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await adminService.getUserDetails(id);
      setData(res);
    } catch (err: any) {
      toast(err.message || 'Error loading user details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleToggleRole = async () => {
    if (!data?.user) return;
    const newRole = data.user.role === 'admin' ? 'user' : 'admin';
    try {
      setActionLoading(true);
      await adminService.updateUserRole(data.user._id, newRole);
      toast(`User role updated to ${newRole === 'admin' ? 'Administrator' : 'Customer'}`, 'success');
      setRoleModalOpen(false);
      fetchUser();
    } catch (err: any) {
      toast(err.message || 'Failed to update user role', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!data?.user) return;
    const newStatus = data.user.status === 'suspended' ? 'active' : 'suspended';
    try {
      setActionLoading(true);
      await adminService.updateUserStatus(data.user._id, newStatus);
      toast(`User account is now ${newStatus}`, 'success');
      setStatusModalOpen(false);
      fetchUser();
    } catch (err: any) {
      toast(err.message || 'Failed to update account status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-48" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-48 bg-gray-200 rounded-3xl" />
          <div className="h-48 bg-gray-200 rounded-3xl" />
          <div className="h-48 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-clay mx-auto" />
        <h3 className="font-display text-xl font-bold text-ink">User Not Found</h3>
        <p className="text-xs text-muted">The requested user profile does not exist.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  const { user, bookings = [], metrics = { totalBookings: 0, totalSpent: 0 } } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="w-9 h-9 rounded-xl bg-white border border-[#DFE5E2] text-ink flex items-center justify-center hover:bg-[#F2F4F3] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-ink">{user.name}</h2>
              <Badge variant={user.role === 'admin' ? 'sand' : 'default'}>
                {user.role === 'admin' ? 'Admin' : 'Customer'}
              </Badge>
              {user.status === 'suspended' && (
                <Badge variant="error">Suspended</Badge>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Account Administration Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRoleModalOpen(true)}
            className="text-xs"
          >
            <Shield className="w-3.5 h-3.5 mr-1 text-moss" />
            {user.role === 'admin' ? 'Demote to Customer' : 'Make Administrator'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusModalOpen(true)}
            className={`text-xs ${
              user.status === 'suspended'
                ? 'text-moss border-moss/30'
                : 'text-clay border-clay/30'
            }`}
          >
            {user.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
          </Button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-5 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Total Journeys
          </div>
          <div className="font-display text-3xl font-bold text-ink">
            {metrics.totalBookings}
          </div>
          <div className="text-[11px] text-muted font-medium">Reservations placed</div>
        </div>

        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-5 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Lifetime Spend
          </div>
          <div className="font-display text-3xl font-bold text-ink">
            {formatINR(metrics.totalSpent)}
          </div>
          <div className="text-[11px] text-moss font-semibold">Realized spend</div>
        </div>

        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-5 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Email Verification
          </div>
          <div className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            {user.emailVerified ? (
              <span className="text-moss flex items-center gap-1.5 text-xl">
                <CheckCircle className="w-5 h-5 inline" /> Verified
              </span>
            ) : (
              <span className="text-amber-600 text-xl">Unverified</span>
            )}
          </div>
          <div className="text-[11px] text-muted font-medium">Authentication status</div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink">Account Profile Information</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted block text-[11px]">Primary Email</span>
            <span className="font-semibold text-ink text-sm">{user.email}</span>
          </div>
          <div>
            <span className="text-muted block text-[11px]">Phone Number</span>
            <span className="font-semibold text-ink text-sm">
              {user.phone || 'None provided'}
            </span>
          </div>
          <div>
            <span className="text-muted block text-[11px]">Access Role</span>
            <span className="font-semibold text-ink uppercase text-xs">{user.role}</span>
          </div>
          <div>
            <span className="text-muted block text-[11px]">Account Status</span>
            <span className="font-semibold text-ink capitalize text-xs">
              {user.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink">
          Booking History ({bookings.length} Orders)
        </h3>

        {bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted">
            This customer has not booked any trips yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-[#EEF1EF] text-[10px] text-muted uppercase font-bold">
                  <th className="pb-2.5">Booking ID</th>
                  <th className="pb-2.5">Trip</th>
                  <th className="pb-2.5">Travel Date</th>
                  <th className="pb-2.5 text-center">Travellers</th>
                  <th className="pb-2.5 text-right">Amount</th>
                  <th className="pb-2.5 text-center">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F5F3]">
                {bookings.map((b: any) => (
                  <tr key={b._id || b.bookingId} className="hover:bg-[#F9FAF9] transition">
                    <td className="py-3 font-mono font-bold text-ink">{b.bookingId}</td>
                    <td className="py-3 font-semibold text-ink max-w-[200px] truncate">
                      {b.tripSnapshot?.title || b.destinationName}
                    </td>
                    <td className="py-3 text-muted">{formatDate(b.travelDate)}</td>
                    <td className="py-3 text-center font-bold text-muted">{b.travellers}</td>
                    <td className="py-3 text-right font-bold text-ink">
                      {formatINR(b.pricing?.totalAmount || b.amountPaid || 0)}
                    </td>
                    <td className="py-3 text-center">
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
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/bookings/${b.bookingId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F4F3] hover:bg-ink hover:text-white text-ink font-semibold text-[11px] transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Confirmation Modal */}
      <ConfirmationModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onConfirm={handleToggleRole}
        title={`Change Role for ${user.name}?`}
        message={`Are you sure you want to change this user's role from ${user.role} to ${
          user.role === 'admin' ? 'user' : 'admin'
        }? Administrators have full operational and CMS access.`}
        confirmText="Confirm Role Change"
        variant="warning"
        isLoading={actionLoading}
      />

      {/* Status Confirmation Modal */}
      <ConfirmationModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={`${user.status === 'suspended' ? 'Reactivate' : 'Suspend'} Account?`}
        message={
          user.status === 'suspended'
            ? 'This will restore this user’s ability to sign in and book trips.'
            : 'Suspended users will not be able to log in or create new bookings.'
        }
        confirmText="Confirm Status Update"
        variant={user.status === 'suspended' ? 'primary' : 'danger'}
        isLoading={actionLoading}
      />
    </div>
  );
};
