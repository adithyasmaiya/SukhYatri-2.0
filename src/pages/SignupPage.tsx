import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { PasswordStrengthIndicator, evaluatePassword } from '../components/auth/PasswordStrengthIndicator';

// Validation helpers
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

const validateIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  const { toast } = useToast();

  const redirectUrl = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : '/my-trips';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreed?: string;
    general?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Please enter at least 2 characters.';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required for WhatsApp dispatch.';
      isValid = false;
    } else if (!validateIndianPhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
      isValid = false;
    }

    const passCriteria = evaluatePassword(password);
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (!passCriteria.isValid) {
      newErrors.password = 'Password must meet all 4 security requirements.';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    if (!agreed) {
      newErrors.agreed = 'Please accept the Terms of Service and Privacy Policy to proceed.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      if (!res.success) {
        setErrors({ general: res.error || 'Failed to create account.' });
        return;
      }

      toast(`Account created for ${name.split(' ')[0]}! Verification code sent.`, 'success');
      const verifyUrl =
        '/verify-email' +
        `?email=${encodeURIComponent(email.trim())}` +
        (searchParams.get('redirect') ? `&redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : '');
      navigate(verifyUrl);
    } catch {
      setErrors({ general: 'Encountered an issue connecting to authentication service.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-stonewarm bg-white shadow-lift min-h-[640px]">
        {/* Left Column: Atmospheric Brand Visual */}
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop"
            alt="Himalayan dawn serenity"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pinedark via-pinedark/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-10 text-white space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-sand text-ink rounded-full px-3 py-1">
              Join 1.2 Lakh Yatris
            </span>
            <h2 className="font-display text-3xl font-semibold leading-snug">
              “India, felt deeply. Travelled softly.”
            </h2>
            <p className="text-white/75 text-xs leading-relaxed max-w-sm">
              Create your account to unlock curated routes, verified boutique homestays, and a dedicated 24×7 travel concierge.
            </p>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="flex bg-cream2 rounded-full p-1 mb-7 max-w-xs">
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/login' +
                    (searchParams.get('redirect')
                      ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}`
                      : '')
                )
              }
              className="flex-1 py-2 rounded-full font-bold text-xs text-muted hover:text-ink transition cursor-pointer"
            >
              Log In
            </button>
            <button
              type="button"
              className="flex-1 py-2 rounded-full font-bold text-xs bg-pine text-white shadow-xs cursor-default"
            >
              Sign Up
            </button>
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink">
            Create your SukhYatri account
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Begin your mindful journey with handpicked stays and trusted drivers.
          </p>

          {/* Form-level Error */}
          {errors.general && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl p-3.5 flex items-center gap-2 animate-toast-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="signup-name" className="block text-xs font-bold text-ink">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    errors.name
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20'
                      : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label htmlFor="signup-email" className="block text-xs font-bold text-ink">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="you@domain.com"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20'
                      : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label htmlFor="signup-phone" className="block text-xs font-bold text-ink">
                Mobile Number (WhatsApp Active) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="e.g. +91 98200 11223"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    errors.phone
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20'
                      : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="signup-password" className="block text-xs font-bold text-ink">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Create secure password"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20'
                      : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                  }`}
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

              {/* Dynamic Password Strength & Requirements Checklist */}
              <PasswordStrengthIndicator password={password} showRequirements={true} />

              {errors.password && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="signup-confirm-password" className="block text-xs font-bold text-ink">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Re-enter password"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20'
                      : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                  }`}
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
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-[#3A4542] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: undefined }));
                  }}
                  className="accent-pine rounded w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                />
                <span className="leading-relaxed">
                  I agree to the{' '}
                  <span className="font-bold text-pine underline">Terms of Service</span> and{' '}
                  <span className="font-bold text-pine underline">Privacy Policy</span>.
                </span>
              </label>
              {errors.agreed && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.agreed}</span>
                </p>
              )}
            </div>

            {/* Primary Submit CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full !rounded-2xl py-3.5 font-bold mt-2"
              rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Secondary Link: Already have an account? Login */}
          <p className="text-xs text-muted text-center mt-6 font-medium">
            Already have an account?{' '}
            <Link
              to={
                '/login' +
                (searchParams.get('redirect')
                  ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}`
                  : '')
              }
              className="text-pine font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
