import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, IndianRupee, HelpCircle, CheckCircle } from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/format';
import { bookingService } from '../../services/bookingService';

export interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirmCancellation: (bookingId: string, reason: string, customReason?: string) => Promise<void>;
}

const CANCELLATION_REASONS = [
  'Change of plans',
  'Travel dates changed',
  'Found another option',
  'Personal reasons',
  'Other',
];

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmCancellation,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Change of plans');
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate dynamic policy estimate
  const refundEstimate = bookingService.calculateRefund(booking);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onConfirmCancellation(
        booking.bookingId || booking.id,
        selectedReason,
        selectedReason === 'Other' ? customReason : undefined
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to process cancellation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          className="relative bg-white rounded-3xl max-w-lg w-full text-left shadow-2xl border border-sand-dark/20 overflow-hidden transform transition-all my-8 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-sand-dark/20 flex items-start justify-between bg-cream/50">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-ink">
                  Cancel this booking?
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Booking ref: <strong className="font-mono text-stone-700">{booking.bookingId || booking.id}</strong> · {booking.packageTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-stone-400 hover:text-ink p-1.5 rounded-full hover:bg-sand/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Refund Estimate Preview */}
            <div className="p-4 rounded-2xl bg-sand/30 border border-sand-dark/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Cancellation Policy Tier</span>
                <span className="font-semibold text-pine bg-pine/10 px-2 py-0.5 rounded-full">
                  {refundEstimate.policyTier}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {refundEstimate.policyText}
              </p>

              <div className="pt-2 border-t border-sand-dark/30 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Package Amount Paid:</span>
                  <span className="font-medium text-ink">{formatINR(booking.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Cancellation Handling Fee:</span>
                  <span className="font-medium text-rose-700">
                    - {formatINR(refundEstimate.cancellationFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-sand-dark/20 text-ink">
                  <span>Estimated Refund:</span>
                  <span className="text-emerald-700">{formatINR(refundEstimate.refundAmount)}</span>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 flex items-center gap-1 pt-1">
                <HelpCircle className="w-3 h-3 text-stone-400 shrink-0" />
                <span>Credited back to your original payment method in 3–5 working days.</span>
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Reason for cancellation <span className="text-rose-600">*</span>
              </label>
              <div className="space-y-2">
                {CANCELLATION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedReason === reason
                        ? 'border-pine bg-pine/5 text-ink font-medium shadow-sm'
                        : 'border-sand-dark/30 hover:border-sand-dark/60 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="text-pine focus:ring-pine/20 h-4 w-4"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom reason textarea if "Other" */}
            {selectedReason === 'Other' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Please specify (optional)
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Share details to help us improve SukhYatri journeys…"
                  rows={2}
                  maxLength={250}
                  className="w-full text-xs p-3 rounded-xl border border-sand-dark/40 focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine resize-none"
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-sand/60 hover:bg-sand text-ink transition-colors border border-sand-dark/30 text-center"
              >
                Keep My Booking
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm disabled:opacity-50 text-center flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Cancelling…</span>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
