import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = searchParams.get('email') || 'your email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast('Email verified successfully! Welcome to the SukhYatri circle.', 'success');
      navigate('/my-trips');
    }, 1000);
  };

  const handleResend = () => {
    toast(`A new 6-digit verification code has been dispatched to <b>${email}</b>`, 'info');
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="bg-white rounded-3xl border border-stonewarm p-8 shadow-card text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-mosslight text-moss flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Verify Your Account</h1>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            We have sent a 6-digit verification security code to <b>{email}</b>.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6 pt-2">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-11 h-13 text-center text-lg font-bold bg-cream2 border border-stonewarm rounded-xl outline-none focus:border-moss focus:bg-white"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full !rounded-2xl"
            isLoading={loading}
          >
            Confirm &amp; Continue
          </Button>
        </form>

        <div className="text-xs text-muted pt-2">
          Didn't receive the code?{' '}
          <button onClick={handleResend} className="text-moss font-bold hover:underline">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};
