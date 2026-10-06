import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PasswordStrengthIndicator, evaluatePassword } from '../components/auth/PasswordStrengthIndicator';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const emailParam = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    setError('');
    const criteria = evaluatePassword(password);

    if (!password) {
      setError('Please enter a new password.');
      return false;
    }
    if (!criteria.isValid) {
      setError('Password must satisfy all 4 security requirements.');
      return false;
    }
    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await resetPassword(emailParam, password);
      if (res.success) {
        setSuccess(true);
        toast('Your password has been successfully updated! Please log in.', 'success');
      } else {
        setError(res.message || 'Unable to update password. Please request a new link.');
      }
    } catch {
      setError('An unexpected error occurred while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-stonewarm p-7 sm:p-9 shadow-card space-y-6 animate-toast-in">
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-ink transition mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Login</span>
          </Link>

          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Reset Password
          </h1>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">
            Create a strong new password for your SukhYatri account.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl p-3 flex items-center gap-2 animate-toast-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-cream2/60 border border-stonewarm rounded-2xl p-6 text-center space-y-4 animate-toast-in">
            <div className="w-14 h-14 rounded-full bg-mosslight text-pine flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7 text-moss" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-ink">
                Password Reset Successfully!
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                Your new security credentials are now active. You can log in to resume booking and managing trips.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full !rounded-2xl py-3.5 font-bold"
              >
                Back to Login
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1">
              <label htmlFor="reset-new-password" className="block text-xs font-bold text-ink">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reset-new-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="At least 8 characters"
                  className="w-full bg-cream2/50 border border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Component */}
              <PasswordStrengthIndicator password={password} showRequirements={true} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="reset-confirm-password" className="block text-xs font-bold text-ink">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reset-confirm-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Repeat new password"
                  className="w-full bg-cream2/50 border border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition p-1"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full !rounded-2xl py-3.5 font-bold mt-2"
              rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
