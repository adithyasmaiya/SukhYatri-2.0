import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const couponController = {
  async validate(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;
      const rawAmount = req.body.amount ?? req.body.bookingAmount ?? req.body.subtotal;

      if (!code || typeof code !== 'string') {
        sendError(res, 'Coupon code is required', 400, 'MISSING_COUPON_CODE');
        return;
      }

      const cleanCode = code.trim().toUpperCase();
      const subtotal = Math.max(0, Number(rawAmount) || 0);
      const now = new Date();

      const coupon = await Coupon.findOne({
        code: cleanCode,
        isActive: true,
      });

      if (!coupon) {
        sendError(res, 'Invalid coupon code. Try SUKH10 or WELCOME500.', 404, 'INVALID_COUPON');
        return;
      }

      if (coupon.validFrom && coupon.validFrom > now) {
        sendError(res, 'Coupon is not yet active.', 400, 'COUPON_NOT_STARTED');
        return;
      }

      if (coupon.validUntil && coupon.validUntil < now) {
        sendError(res, 'Coupon has expired.', 400, 'COUPON_EXPIRED');
        return;
      }

      if (coupon.minimumBookingAmount && subtotal < coupon.minimumBookingAmount) {
        sendError(
          res,
          `Minimum order value of ₹${coupon.minimumBookingAmount.toLocaleString('en-IN')} required for this coupon.`,
          400,
          'MIN_AMOUNT_NOT_MET'
        );
        return;
      }

      if (coupon.usageLimit && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        sendError(res, 'Coupon usage limit has been reached.', 400, 'USAGE_LIMIT_EXCEEDED');
        return;
      }

      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = Math.round(subtotal * (coupon.discountValue / 100));
        if (coupon.maxDiscount && coupon.maxDiscount > 0) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = Math.min(coupon.discountValue, subtotal);
      }

      sendSuccess(
        res,
        {
          valid: true,
          code: coupon.code,
          type: coupon.discountType,
          value: coupon.discountValue,
          discountAmount: discount,
          coupon,
        },
        200,
        'Coupon code applied successfully!'
      );
    } catch (err: any) {
      sendError(res, err.message || 'Failed to validate coupon', 500);
    }
  },

  async getAllCoupons(_req: Request, res: Response): Promise<void> {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      sendSuccess(res, coupons);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch coupons', 500);
    }
  },
};
