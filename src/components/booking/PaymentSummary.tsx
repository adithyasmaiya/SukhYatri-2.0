import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/format';
import { Button } from '../ui/Button';
import { PaymentMethodType } from './PaymentMethodSelector';

export interface PaymentSummaryProps {
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  onProceedPayment: () => void;
  isProcessing: boolean;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  totalAmount,
  paymentMethod,
  onProceedPayment,
  isProcessing,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stonewarm p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-stonewarm/60">
        <div>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">
            Total Payable Now
          </div>
          <div className="font-display text-3xl font-bold text-pine mt-0.5">
            {formatINR(totalAmount)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Method Selected
          </div>
          <div className="font-extrabold text-sm text-ink uppercase mt-0.5">
            {paymentMethod}
          </div>
        </div>
      </div>

      <div className="bg-cream2/60 rounded-2xl p-4 border border-stonewarm/50 space-y-2 text-xs text-[#3A4542]">
        <div className="flex items-center gap-2 font-bold text-ink">
          <ShieldCheck className="w-4 h-4 text-moss shrink-0" />
          <span>Payment Security Protocol</span>
        </div>
        <p className="text-[11.5px] text-muted leading-relaxed">
          Clicking Proceed will open Razorpay Checkout with bank-grade 256-bit SSL encryption. Once verified by our servers, your confirmation vouchers will be generated immediately.
        </p>
      </div>

      <Button
        variant="gold"
        size="lg"
        onClick={onProceedPayment}
        disabled={isProcessing}
        className="w-full justify-center !rounded-2xl py-4 font-extrabold text-base shadow-lift tracking-wide group"
      >
        <span>Pay {formatINR(totalAmount)} &amp; Secure Booking</span>
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>

      <div className="text-center text-[11px] text-muted font-semibold flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-moss" />
        <span>PCI-DSS Compliant 256-Bit SSL End-to-End Encryption</span>
      </div>
    </div>
  );
};
