import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Lock,
  LogOut,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  X,
  Coins,
  Sparkles,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PasswordStrengthIndicator, evaluatePassword } from '../components/auth/PasswordStrengthIndicator';
import { useSEO } from '../hooks/useSEO';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const { toast } = useToast();

  useSEO({
    title: 'My Profile | SukhYatri',
    noIndex: true,
  });

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password state
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passError, setPassError] = useState('');
  const [savingPass, setSavingPass] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="font-display text-2xl font-bold">Please log in</h2>
        <p className="text-xs text-muted mt-2">You must be logged in to view your profile.</p>
        <Button className="mt-4" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast('Please enter your name', 'error');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
      });
      setIsEditingProfile(false);
      toast('Profile updated successfully!', 'success');
    } catch {
      toast('Failed to update profile details', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!currentPass) {
      setPassError('Current password is required.');
      return;
    }

    const criteria = evaluatePassword(newPass);
    if (!criteria.isValid) {
      setPassError('New password must satisfy all 4 criteria.');
      return;
    }

    if (newPass !== confirmNewPass) {
      setPassError('New passwords do not match.');
      return;
    }

    setSavingPass(true);
    try {
      const res = await changePassword(currentPass, newPass);
      if (res.success) {
        toast('Password changed successfully!', 'success');
        setIsChangingPass(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmNewPass('');
      } else {
        setPassError(res.message);
      }
    } catch {
      setPassError('Could not change password. Please check your credentials.');
    } finally {
      setSavingPass(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast('Logged out successfully. Have a serene day ahead.', 'info');
    navigate('/');
  };

  const formattedDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      })
    : 'August 2025';

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-toast-in">
      {/* Profile Header Hero */}
      <div className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-cream2 shadow-md shrink-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pine text-sand flex items-center justify-center font-display text-3xl font-bold border-4 border-cream2 shadow-md shrink-0">
              {currentUser.name.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                {currentUser.name}
              </h1>
              <Badge variant="mosslight" size="sm">
                <Award className="w-3 h-3 mr-1 inline text-moss" />
                {currentUser.tier || 'Gold'} Member
              </Badge>
            </div>
            <div className="text-xs text-muted font-medium">{currentUser.email}</div>
            <div className="text-[11px] text-muted flex items-center gap-1.5 pt-0.5">
              <Calendar className="w-3.5 h-3.5 text-pine" />
              <span>Yatri since {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Quick Loyalty Card & Logout */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <div className="bg-cream2/70 border border-stonewarm rounded-2xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sand/30 text-pine flex items-center justify-center">
              <Coins className="w-4 h-4 text-pine" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
                SukhCoins Balance
              </div>
              <div className="font-display font-bold text-sm text-ink">
                {currentUser.sukhCoins?.toLocaleString('en-IN') || '2,450'} Pts
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="!rounded-xl text-clay border-clay/30 hover:bg-red-50 hover:border-clay"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Grid: Personal Information (Left) & Account Security (Right) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Personal Information */}
        <div className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stonewarm/70">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-moss">
                Personal Details
              </div>
              <h2 className="font-display text-xl font-bold text-ink mt-0.5">
                Personal Information
              </h2>
            </div>
            {!isEditingProfile && (
              <button
                type="button"
                onClick={() => {
                  setEditName(currentUser.name);
                  setEditPhone(currentUser.phone || '');
                  setIsEditingProfile(true);
                }}
                className="text-xs font-bold text-pine hover:text-moss underline flex items-center gap-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 animate-toast-in">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-cream2/50 border border-stonewarm rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink outline-none focus:border-pine"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink">WhatsApp / Mobile</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  className="w-full bg-cream2/50 border border-stonewarm rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink outline-none focus:border-pine"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={savingProfile}
                  className="!rounded-xl"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(false)}
                  className="!rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream2/50">
                <div className="flex items-center gap-2.5 text-muted">
                  <User className="w-4 h-4 text-pine" />
                  <span className="font-medium">Full Name</span>
                </div>
                <div className="font-bold text-ink">{currentUser.name}</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream2/50">
                <div className="flex items-center gap-2.5 text-muted">
                  <Mail className="w-4 h-4 text-pine" />
                  <span className="font-medium">Email Address</span>
                </div>
                <div className="font-bold text-ink">{currentUser.email}</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-cream2/50">
                <div className="flex items-center gap-2.5 text-muted">
                  <Phone className="w-4 h-4 text-pine" />
                  <span className="font-medium">Phone Number</span>
                </div>
                <div className="font-bold text-ink">{currentUser.phone || 'Not added'}</div>
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-stonewarm/60 flex items-center justify-between text-xs">
            <span className="text-muted font-medium">Have bookings lined up?</span>
            <Link to="/my-trips" className="font-bold text-pine hover:text-moss underline">
              View My Bookings →
            </Link>
          </div>
        </div>

        {/* Card 2: Account Security & Status */}
        <div className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-7 shadow-xs space-y-5">
          <div className="pb-3 border-b border-stonewarm/70">
            <div className="text-[11px] font-bold uppercase tracking-wider text-moss">
              Trust &amp; Credentials
            </div>
            <h2 className="font-display text-xl font-bold text-ink mt-0.5">
              Account Security
            </h2>
          </div>

          {/* Email Verification Status */}
          <div className="p-4 rounded-2xl border border-stonewarm/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-pine" />
                <span>Email Verification</span>
              </div>
              {currentUser.emailVerified ? (
                <span className="text-[11px] font-extrabold bg-mosslight text-pine px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-moss" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="text-[11px] font-extrabold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Pending</span>
                </span>
              )}
            </div>

            <p className="text-[11.5px] text-muted leading-relaxed">
              {currentUser.emailVerified
                ? 'Your registered email is confirmed and receives itinerary vouchers, private rates, and live updates.'
                : 'Your email address is unverified. Verify to ensure seamless ticket dispatch.'}
            </p>

            {!currentUser.emailVerified && (
              <div className="pt-1">
                <Link
                  to={`/verify-email?email=${encodeURIComponent(currentUser.email)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-moss hover:underline"
                >
                  <span>Verify Email Now →</span>
                </Link>
              </div>
            )}
          </div>

          {/* Password Action */}
          <div className="p-4 rounded-2xl border border-stonewarm/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-pine" />
                <span>Password</span>
              </div>
              {!isChangingPass && (
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPass(true);
                    setPassError('');
                  }}
                  className="text-xs font-bold text-pine hover:text-moss underline"
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPass ? (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-1 animate-toast-in">
                {passError && (
                  <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-xl">
                    {passError}
                  </p>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-ink mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-cream2/50 border border-stonewarm rounded-xl px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-pine"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-cream2/50 border border-stonewarm rounded-xl px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-pine"
                    required
                  />
                  <PasswordStrengthIndicator password={newPass} showRequirements={true} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-cream2/50 border border-stonewarm rounded-xl px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-pine"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={savingPass}
                    className="!rounded-xl text-xs"
                  >
                    {savingPass ? 'Updating...' : 'Update Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsChangingPass(false);
                      setPassError('');
                    }}
                    className="!rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-[11.5px] text-muted">
                Last updated password credentials are encrypted and active.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
