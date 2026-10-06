import React from 'react';
import { IndianRupee, ShieldCheck, Tag, CreditCard, RotateCcw } from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/format';
import { PaymentStatusBadge } from './PaymentStatusBadge';

export interface BookingPriceSummaryProps {
  booking: Booking;
}

export const BookingPriceSummary: React.FC<BookingPriceSummaryProps> = ({ booking }) => {
  const isCancelled = (booking.bookingStatus || booking.status) === 'Cancelled' || (booking.bookingStatus || booking.status) === 'cancelled';
  const discount = booking.discountAmount || 0;
  const taxes = booking.taxAmount || 0;
  const addons = booking.addonsAmount || 0;
  const roomUpgrade = booking.roomUpgradeAmount || 0;
  const coupon = booking.couponApplied || booking.couponCode;

  return (
    <div className="bg-white rounded-3xl border border-sand-dark/25 p-6 sm:p-7 shadow-card space-y-5">
      <div className="flex items-center justify-between border-b border-sand-dark/20 pb-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink">Payment Summary</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent fare breakup & transaction status
          </p>
        </div>
        <PaymentStatusBadge status={booking.paymentStatus} />
      </div>

      <div className="space-y-3 text-xs">
        {/* Base Tour Price */}
        <div className="flex justify-between items-center text-stone-700">
          <div>
            <span>Base Tour Fare</span>
            <span className="text-[11px] text-stone-400 block">
              {booking.travellers} {booking.travellers === 1 ? 'Guest' : 'Guests'} · All Inclusive
            </span>
          </div>
          <span className="font-mono font-medium text-ink">{formatINR(booking.baseAmount)}</span>
        </div>

        {/* Addons if any */}
        {addons > 0 && (
          <div className="flex justify-between items-center text-stone-700">
            <span>Curated Experiences & Add-ons</span>
            <span className="font-mono font-medium text-ink">{formatINR(addons)}</span>
          </div>
        )}

        {/* Room upgrade if any */}
        {roomUpgrade > 0 && (
          <div className="flex justify-between items-center text-stone-700">
            <span>Accommodation Tier Upgrade</span>
            <span className="font-mono font-medium text-ink">{formatINR(roomUpgrade)}</span>
          </div>
        )}

        {/* Discount / Coupon */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/50">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Discount Savings {coupon ? `(${coupon})` : ''}</span>
            </div>
            <span className="font-mono font-bold">- {formatINR(discount)}</span>
          </div>
        )}

        {/* Taxes & GST */}
        <div className="flex justify-between items-center text-stone-700">
          <div>
            <span>Taxes & GST (5%)</span>
            <span className="text-[11px] text-stone-400 block">Ministry of Tourism Compliant SAC 998555</span>
          </div>
          <span className="font-mono font-medium text-ink">{formatINR(taxes)}</span>
        </div>

        {/* Total Price */}
        <div className="pt-3 border-t border-sand-dark/25 flex justify-between items-baseline">
          <div>
            <span className="font-display font-bold text-base text-ink">Total Amount Paid</span>
            <span className="text-[11px] text-stone-400 block">All taxes & chauffeur allowances included</span>
          </div>
          <span className="font-display font-bold text-xl text-pine">
            {formatINR(booking.totalAmount)}
          </span>
        </div>

        {/* Cancelled / Refund info */}
        {isCancelled && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                Cancellation & Refund Breakdown
              </span>
              <span className="capitalize">{booking.refundStatus || 'Processing'}</span>
            </div>
            {booking.cancellationFee !== undefined && (
              <div className="flex justify-between text-[11px] text-amber-800">
                <span>Cancellation Handling Fee:</span>
                <span className="font-mono">{formatINR(booking.cancellationFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold text-amber-950 pt-1 border-t border-amber-200/50">
              <span>Refund Amount Credited:</span>
              <span className="font-mono">
                {formatINR(booking.cancellationRefundAmount ?? Math.round(booking.totalAmount * 0.85))}
              </span>
            </div>
          </div>
        )}

        {/* Payment Meta */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-sand-dark/20">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-pine" />
            <span>Method: <strong className="uppercase text-stone-700">{booking.paymentMethod || 'UPI'}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure 256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
