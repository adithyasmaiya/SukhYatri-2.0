import { ITrip } from '../models/Trip.js';
import { Coupon, ICoupon } from '../models/Coupon.js';
import { IBooking, IBookingPricing } from '../models/Booking.js';

export interface PriceCalculationResult {
  pricing: IBookingPricing;
  appliedCoupon?: ICoupon;
  couponError?: string;
}

export interface RefundCalculationResult {
  refundAmount: number;
  cancellationFee: number;
  policyTier: string;
  policyText: string;
}

export const pricingService = {
  async calculateBookingPricing(
    trip: ITrip,
    travellerCount: number,
    couponCode?: string
  ): Promise<PriceCalculationResult> {
    const baseAmount = trip.price * travellerCount;
    let discount = 0;
    let appliedCoupon: ICoupon | undefined = undefined;
    let couponError: string | undefined = undefined;

    if (couponCode && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const now = new Date();

      const foundCoupon = await Coupon.findOne({
        code: cleanCode,
        isActive: true,
        $and: [
          { $or: [{ validFrom: { $exists: false } }, { validFrom: null }, { validFrom: { $lte: now } }] },
          { $or: [{ validUntil: { $exists: false } }, { validUntil: null }, { validUntil: { $gte: now } }] },
        ],
      });

      if (!foundCoupon) {
        couponError = 'Invalid or expired coupon code.';
      } else if (
        foundCoupon.minimumBookingAmount &&
        baseAmount < foundCoupon.minimumBookingAmount
      ) {
        couponError = `Coupon requires minimum booking amount of ₹${foundCoupon.minimumBookingAmount.toLocaleString('en-IN')}.`;
      } else if (
        foundCoupon.usageLimit &&
        foundCoupon.usageLimit > 0 &&
        foundCoupon.usedCount >= foundCoupon.usageLimit
      ) {
        couponError = 'Coupon usage limit has been reached.';
      } else {
        // Valid coupon
        appliedCoupon = foundCoupon;
        if (foundCoupon.discountType === 'percentage') {
          discount = Math.round(baseAmount * (foundCoupon.discountValue / 100));
          if (foundCoupon.maxDiscount && foundCoupon.maxDiscount > 0) {
            discount = Math.min(discount, foundCoupon.maxDiscount);
          }
        } else {
          discount = Math.min(foundCoupon.discountValue, baseAmount);
        }
      }
    }

    const subtotal = baseAmount;
    const taxableAmount = Math.max(0, baseAmount - discount);
    const taxes = Math.round(taxableAmount * 0.05); // 5% Ministry of Tourism GST SAC 998555
    const totalAmount = taxableAmount + taxes;

    return {
      pricing: {
        baseAmount,
        travellerCount,
        subtotal,
        discount,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        taxes,
        totalAmount,
        currency: 'INR',
      },
      appliedCoupon,
      couponError,
    };
  },

  calculateRefund(booking: IBooking): RefundCalculationResult {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const travelDate = new Date(booking.travelDate);
    travelDate.setHours(0, 0, 0, 0);

    const diffMs = travelDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const total = booking.pricing?.totalAmount || 0;

    let feePct = 0;
    let policyTier = '';
    let policyText = '';

    if (diffDays >= 15) {
      feePct = 0.05; // 5% nominal processing fee
      policyTier = '15+ Days Before Travel';
      policyText = 'Complimentary cancellation: 95% full refund returned to source.';
    } else if (diffDays >= 7) {
      feePct = 0.15; // 15% cancellation fee
      policyTier = '7–14 Days Before Travel';
      policyText = 'Standard cancellation: 85% refund returned to source account.';
    } else if (diffDays >= 3) {
      feePct = 0.5; // 50% cancellation fee
      policyTier = '3–6 Days Before Travel';
      policyText = 'Late cancellation: 50% refund returned due to confirmed hotel blocking.';
    } else {
      feePct = 0.8; // 80% cancellation fee
      policyTier = 'Within 48 Hours';
      policyText = 'Last-minute cancellation: 20% partial refund after chauffeur & hotel retention.';
    }

    const cancellationFee = Math.round(total * feePct);
    const refundAmount = Math.max(0, total - cancellationFee);

    return {
      refundAmount,
      cancellationFee,
      policyTier,
      policyText,
    };
  },
};
