export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10) or fixed amount (e.g. 500)
  description: string;
  minBookingAmount?: number;
}

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'SUKH10',
    type: 'percentage',
    value: 10,
    description: '10% discount on total package fare',
  },
  {
    code: 'WELCOME500',
    type: 'fixed',
    value: 500,
    description: 'Flat ₹500 welcome credit for new yatris',
  },
  {
    code: 'SUKH15',
    type: 'percentage',
    value: 15,
    description: '15% festive early-bird discount',
  },
];

export function validateCoupon(
  code: string,
  subtotal: number
): { valid: boolean; coupon?: Coupon; error?: string; discountAmount: number } {
  const clean = code.trim().toUpperCase();
  const found = MOCK_COUPONS.find((c) => c.code === clean);

  if (!found) {
    return {
      valid: false,
      error: 'Invalid coupon code. Try SUKH10 or WELCOME500.',
      discountAmount: 0,
    };
  }

  let discount = 0;
  if (found.type === 'percentage') {
    discount = Math.round(subtotal * (found.value / 100));
  } else {
    discount = Math.min(found.value, subtotal);
  }

  return {
    valid: true,
    coupon: found,
    discountAmount: discount,
  };
}
