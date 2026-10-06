import React, { useState } from 'react';
import { Tag, Check, X, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/format';

export interface CouponInputProps {
  appliedCoupon: string | null;
  discountAmount: number;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  appliedCoupon,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!inputCode.trim()) return;

    const res = onApplyCoupon(inputCode.trim());
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setInputCode('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stonewarm p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-pine" />
          <span>Offers &amp; Promo Code</span>
        </label>
        <span className="text-[11px] text-muted">Try SUKH10 or WELCOME500</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-mosslight text-pine px-3.5 py-2.5 rounded-xl border border-moss/20">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-moss shrink-0" />
            <div>
              <div className="text-xs font-bold flex items-center gap-1">
                <span>{appliedCoupon}</span>
                <span className="text-[10px] bg-moss text-white px-1.5 py-0.2 rounded font-extrabold uppercase">
                  Applied
                </span>
              </div>
              <div className="text-[11px] text-pine/80 font-medium">
                You saved {formatINR(discountAmount)} on this booking
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-xs font-bold text-clay hover:underline flex items-center gap-1 ml-2"
          >
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter promo code"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setErrorMsg(null);
              }}
              className={`w-full bg-cream2/60 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-ink uppercase tracking-wider outline-none transition ${
                errorMsg
                  ? 'border-red-500 focus:ring-1 focus:ring-red-200'
                  : 'border-stonewarm focus:border-pine'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={!inputCode.trim()}
            className="bg-pine hover:bg-moss text-white text-xs font-bold px-4 py-2.5 rounded-xl transition disabled:opacity-40 shrink-0"
          >
            Apply
          </button>
        </form>
      )}

      {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
    </div>
  );
};
