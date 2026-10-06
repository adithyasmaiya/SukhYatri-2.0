import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(cleanEmail);
      if (res.success) {
        setSubmitted(true);
        toast(`Password reset instructions sent to <b>${cleanEmail}</b>`, 'success');
      } else {
        setError(res.message || 'Failed to dispatch reset instructions.');
      }
    } catch {
      setError('An error occurred while connecting to service.');
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
            Forgot your password?
          </h1>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">
            Enter your email and we'll help you reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl p-3 flex items-center gap-2 animate-toast-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="bg-cream2/60 border border-stonewarm rounded-2xl p-5 space-y-4 text-center animate-toast-in">
            <div className="w-12 h-12 rounded-full bg-mosslight text-pine flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-moss" />
            </div>

            <div className="space-y-1">
              <div className="font-display font-bold text-sm text-ink">Instructions Dispatched</div>
              <p className="text-xs text-muted leading-relaxed">
                We've sent a password reset token to <b>{email}</b>. Please check your inbox and spam folder.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-pine text-white text-xs font-bold py-3 rounded-xl hover:bg-moss transition shadow-xs"
              >
                <span>Continue to Set New Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-muted hover:text-ink py-1 transition"
              >
                Try a different email address
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="forgot-email" className="block text-xs font-bold text-ink">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@domain.com"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    error
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                  }`}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full !rounded-2xl py-3.5 font-bold"
              rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
