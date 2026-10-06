import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { OtpInput } from '../components/auth/OtpInput';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerification, currentUser } = useAuth();
  const { toast } = useToast();

  const redirectUrl = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : '/my-trips';

  const targetEmail =
    searchParams.get('email') ||
    currentUser?.email ||
    sessionStorage.getItem('sukhyatri_pending_verification') ||
    'your email address';

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer for resend (60s)
  const [countdown, setCountdown] = useState<number>(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const otpString = otpDigits.join('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (otpString.length < 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyEmail(otpString, targetEmail);

      if (!res.success) {
        setError(res.error || 'Invalid verification code. Please try again.');
        return;
      }

      toast('Email verified successfully! Welcome to the SukhYatri circle.', 'success');
      navigate(redirectUrl);
    } catch {
      setError('Encountered an issue verifying code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    setResending(true);
    setError('');

    try {
      const res = await resendVerification(targetEmail);
      if (res.success) {
        toast(res.message, 'info');
        setCountdown(60);
        setOtpDigits(['', '', '', '', '', '']);
      } else {
        setError(res.message);
        if (res.cooldown) {
          setCountdown(res.cooldown);
        }
      }
    } catch {
      setError('Failed to resend code. Please try again in a few moments.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-stonewarm p-7 sm:p-9 shadow-card text-center space-y-6 animate-toast-in">
        {/* Shield Icon Header */}
        <div className="w-18 h-18 w-16 h-16 rounded-full bg-mosslight text-pine flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-8 h-8 text-moss" />
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Verify your email
          </h1>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            We've sent a verification code to your email.
          </p>
          <div className="inline-flex items-center gap-1.5 bg-cream2 px-3 py-1 rounded-full text-xs font-bold text-pine mt-2 border border-stonewarm/60">
            <Mail className="w-3.5 h-3.5 text-muted" />
            <span className="truncate max-w-[240px]">{targetEmail}</span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl p-3 flex items-center gap-2 text-left animate-toast-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 6-Digit OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <OtpInput
            value={otpDigits}
            onChange={(digits) => {
              setOtpDigits(digits);
              if (error) setError('');
            }}
            disabled={loading}
            hasError={!!error}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || otpString.length < 6}
            className="w-full !rounded-2xl py-3.5 font-bold"
            rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        {/* Resend Code Section */}
        <div className="pt-2 border-t border-stonewarm/60 text-xs text-muted space-y-2 font-medium">
          <div>
            Didn't receive the email?{' '}
            {countdown > 0 ? (
              <span className="font-bold text-pine">
                Resend code in <b className="font-mono">{countdown}s</b>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-bold text-moss hover:text-pine underline cursor-pointer transition inline-flex items-center gap-1"
              >
                {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>Resend code</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted">
            Check your spam or junk folder if you don't see it in your inbox.
          </p>
        </div>

        {/* Back Link */}
        <div className="pt-1">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
