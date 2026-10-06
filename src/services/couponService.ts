import { apiClient } from './apiClient';
import { MOCK_COUPONS, validateCoupon as localValidateCoupon } from '../data/coupons';

export interface CouponValidationResult {
  valid: boolean;
  coupon?: any;
  error?: string;
  discountAmount: number;
}

export const couponService = {
  async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    try {
      const res = await apiClient.post<any>('/coupons/validate', {
        code,
        amount: subtotal,
      });

      if (res) {
        return {
          valid: true,
          coupon: res.coupon || { code: res.code, type: res.type, value: res.value },
          discountAmount: res.discountAmount || 0,
        };
      }
    } catch (err: any) {
      if (err.statusCode === 400 || err.statusCode === 404) {
        return {
          valid: false,
          error: err.message || 'Invalid coupon code',
          discountAmount: 0,
        };
      }
      console.warn('[couponService] Backend coupon validation unavailable, using local fallback', err);
    }

    // Local fallback
    return localValidateCoupon(code, subtotal);
  },
};
