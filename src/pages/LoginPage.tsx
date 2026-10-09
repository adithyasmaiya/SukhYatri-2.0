import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, fillDemoUser } = useAuth();
  const { toast } = useToast();

  const redirectUrl = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : '/my-trips';

  const [email, setEmail] = useState('ananya@example.com');
  const [password, setPassword] = useState('sukhyatri123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Inline field errors & auth error
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

    setLoading(true);
    setAuthError('');

    try {
      const res = await login(email, password, rememberMe);

      if (!res.success) {
        setAuthError(res.error || 'Email or password is incorrect.');
        return;
      }

      if (res.requiresVerification) {
        toast('Please verify your email to access your account.', 'info');
        const verifyRedirect = searchParams.get('redirect')
          ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}`
          : '';
        navigate(`/verify-email${verifyRedirect}`);
        return;
      }

      toast(`Welcome back, ${res.user?.name.split(' ')[0] || 'Yatri'}! Ready for your next journey.`, 'success');
      navigate(redirectUrl);
    } catch {
      setAuthError('Authentication service encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = async () => {
    setEmail('ananya@example.com');
    setPassword('sukhyatri123');
    setEmailError('');
    setPasswordError('');
    setAuthError('');
    setLoading(true);
    try {
      const res = await login('ananya@example.com', 'sukhyatri123', true);
      if (res.success) {
        toast('Demo account authenticated with verified backend session!', 'success');
        navigate(redirectUrl);
      } else {
        setAuthError(res.error || 'Failed to sign in demo user.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-stonewarm bg-white shadow-lift min-h-[580px]">
        {/* Left Column: Atmospheric Visual Narrative */}
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop"
            alt="Varanasi dawn along the Ganges"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pinedark via-pinedark/40 to-transparent" />

          <div className="absolute bottom-0 inset-x-0 p-10 text-white space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 border border-white/30 rounded-full px-3 py-1">
              Namaste, fellow yatri
            </span>
            <h2 className="font-display text-3xl font-semibold leading-snug">
              “SukhYatri remembered my mother's comfort before I even had to ask.”
            </h2>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
                alt="Shalini Menon"
                className="w-11 h-11 rounded-full object-cover border-2 border-sand"
              />
              <div>
                <div className="font-bold text-sm">Shalini Menon, Kochi</div>
                <div className="text-white/70 text-xs">Travelled Spiti Valley Circuit · ★★★★★</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Focused Distraction-Free Login Form */}
        <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="flex bg-cream2 rounded-full p-1 mb-7 max-w-xs">
            <button
              type="button"
              className="flex-1 py-2 rounded-full font-bold text-xs bg-pine text-white shadow-xs cursor-default"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/signup' +
                    (searchParams.get('redirect')
                      ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}`
                      : '')
                )
              }
              className="flex-1 py-2 rounded-full font-bold text-xs text-muted hover:text-ink transition cursor-pointer"
            >
              Sign Up
            </button>
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Continue planning your next journey with SukhYatri.
          </p>

          {/* Form Level Error Banner */}
          {authError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl p-3.5 flex items-center gap-2 animate-toast-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="login-email" className="block text-xs font-bold text-ink">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="you@domain.com"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    emailError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20'
                      : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-bold text-ink">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-moss hover:text-pine transition"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-cream2/50 border rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                    passwordError
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
              {passwordError && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#3A4542] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-pine rounded w-4 h-4 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
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
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          {/* Secondary Option: Sign Up */}
          <p className="text-xs text-muted text-center mt-6 font-medium">
            Don't have a SukhYatri account?{' '}
            <Link
              to={
                '/signup' +
                (searchParams.get('redirect')
                  ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}`
                  : '')
              }
              className="text-pine font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 bg-cream2/60 border border-stonewarm rounded-2xl p-3.5 text-xs text-muted flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-moss flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Demo Yatri Access</span>
              </div>
              <div>
                <b>ananya@example.com</b> · <b>sukhyatri123</b>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="bg-white border border-stonewarm hover:border-pine text-pine font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-xs shrink-0"
            >
              Autofill &amp; Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
