import React from 'react';
import { QrCode, CreditCard, Building2, Wallet, ShieldCheck, Lock } from 'lucide-react';
import { formatINR } from '../../utils/format';

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
  totalAmount: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  totalAmount,
}) => {
  const methods = [
    {
      id: 'upi' as PaymentMethodType,
      label: 'UPI (Instant & Free)',
      desc: 'Google Pay, PhonePe, Paytm, BHIM & QR',
      icon: QrCode,
    },
    {
      id: 'card' as PaymentMethodType,
      label: 'Credit / Debit Card',
      desc: 'Visa, MasterCard, RuPay, Amex & 0% EMI',
      icon: CreditCard,
    },
    {
      id: 'netbanking' as PaymentMethodType,
      label: 'Net Banking',
      desc: 'HDFC, ICICI, SBI, Axis, Kotak & 50+ Banks',
      icon: Building2,
    },
    {
      id: 'wallet' as PaymentMethodType,
      label: 'Wallets & Pay Later',
      desc: 'Amazon Pay, Simpl, Mobikwik',
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-moss">
          Secure Checkout
        </div>
        <h3 className="font-display text-xl font-bold text-ink mt-0.5">
          Select Payment Method
        </h3>
        <p className="text-xs text-muted mt-1">
          All transactions are secured with 256-bit bank-grade encryption in compliance with RBI guidelines.
        </p>
      </div>

      {/* Payment Method Tabs */}
      <div className="grid sm:grid-cols-2 gap-3">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMethodChange(m.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 select-none ${
                isSelected
                  ? 'border-pine bg-mosslight/40 shadow-sm ring-2 ring-pine/20'
                  : 'border-stonewarm bg-white hover:border-pine/50'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-pine text-white' : 'bg-cream2 text-pine'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink leading-tight">{m.label}</div>
                <div className="text-[11px] text-muted font-medium mt-1 truncate">
                  {m.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Razorpay Gateway Information Panel */}
      <div className="bg-white rounded-3xl border border-stonewarm p-6 shadow-xs space-y-4">
        {selectedMethod === 'upi' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-mosslight text-pine flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink">Instant UPI &amp; QR Code</h4>
                <p className="text-xs text-muted">
                  Pay instantly via Google Pay, PhonePe, Paytm, BHIM or any UPI mobile app.
                </p>
              </div>
            </div>
            <div className="p-3 bg-cream2/60 rounded-xl border border-stonewarm/60 text-xs text-muted">
              When you click <strong>Proceed to Payment</strong>, Razorpay Checkout will open with instant QR code and UPI Collect options.
            </div>
          </div>
        )}

        {selectedMethod === 'card' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-mosslight text-pine flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink">Credit &amp; Debit Cards</h4>
                <p className="text-xs text-muted">
                  Visa, MasterCard, RuPay, American Express &amp; Corporate Cards supported.
                </p>
              </div>
            </div>
            <div className="p-3 bg-cream2/60 rounded-xl border border-stonewarm/60 text-xs text-muted">
              Card details are entered directly inside the PCI-DSS Level 1 compliant Razorpay modal. SukhYatri never stores your card number or CVV.
            </div>
          </div>
        )}

        {selectedMethod === 'netbanking' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-mosslight text-pine flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink">Net Banking (50+ Indian Banks)</h4>
                <p className="text-xs text-muted">
                  HDFC, ICICI, SBI, Axis, Kotak, Punjab National Bank, and all major Indian banks.
                </p>
              </div>
            </div>
            <div className="p-3 bg-cream2/60 rounded-xl border border-stonewarm/60 text-xs text-muted">
              Direct bank redirect with 2-factor authentication powered by Razorpay.
            </div>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-mosslight text-pine flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink">Wallets &amp; Pay Later</h4>
                <p className="text-xs text-muted">
                  Amazon Pay, MobiKwik, Airtel Money, and supported pay-later instruments.
                </p>
              </div>
            </div>
            <div className="p-3 bg-cream2/60 rounded-xl border border-stonewarm/60 text-xs text-muted">
              Select your favorite wallet in Razorpay Checkout for 1-tap authorization.
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="pt-3 border-t border-stonewarm/60 flex flex-wrap items-center justify-between gap-3 text-xs text-muted font-medium">
          <div className="flex items-center gap-1.5 text-moss">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold text-[11px]">Razorpay PCI-DSS Level 1 Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[11px]">256-Bit SSL Bank-Grade Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};
