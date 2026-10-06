/// <reference types="vite/client" />
import { apiClient } from './apiClient';
import { Booking } from '../types';

export interface RazorpayOrderData {
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  bookingId: string;
  amountInINR: number;
}

export interface RazorpayVerificationData {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentRecord {
  id: string;
  paymentId: string;
  bookingId: string;
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  method: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyPaymentResult {
  booking: Booking;
  payment: PaymentRecord;
  alreadyProcessed?: boolean;
}

export interface CheckoutCustomerInfo {
  name: string;
  email: string;
  phone: string;
  tripTitle?: string;
}

export interface OpenCheckoutConfig {
  order: RazorpayOrderData;
  customer: CheckoutCustomerInfo;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss?: () => void;
  onFailure?: (error: any) => void;
}

/**
 * Loads the external Razorpay Checkout SDK dynamically if not already present.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('[PaymentService] Failed to load Razorpay Checkout script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export const paymentService = {
  /**
   * 1. Create a Razorpay Order on the SukhYatri backend
   * The backend authoritatively calculates the required payable amount.
   */
  async createPaymentOrder(bookingId: string): Promise<RazorpayOrderData> {
    const res = await apiClient.post<RazorpayOrderData>('/payments/create-order', {
      bookingId,
    });
    return res;
  },

  /**
   * 2. Send Razorpay response tokens to the backend for HMAC signature verification
   * Crucial: Backend must verify signature using RAZORPAY_KEY_SECRET before marking paid.
   */
  async verifyPayment(verificationData: RazorpayVerificationData): Promise<VerifyPaymentResult> {
    const res = await apiClient.post<VerifyPaymentResult>('/payments/verify', verificationData);
    return res;
  },

  /**
   * 3. Retrieve verified payment status and identifiers
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentRecord> {
    const res = await apiClient.get<PaymentRecord>(`/payments/${paymentId}`);
    return res;
  },

  /**
   * 4. Open the official Razorpay Checkout modal with SukhYatri branding
   */
  async openRazorpayCheckout({
    order,
    customer,
    onSuccess,
    onDismiss,
    onFailure,
  }: OpenCheckoutConfig): Promise<void> {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !(window as any).Razorpay) {
      throw new Error('Could not connect to payment gateway. Please check your internet connection and try again.');
    }

    const keyId = order.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_sukhyatri_dev123';

    // Format phone number to clean 10-digit if present
    const cleanPhone = customer.phone ? customer.phone.replace(/[^0-9]/g, '').slice(-10) : '';

    const options = {
      key: keyId,
      amount: order.amount, // in paise
      currency: order.currency || 'INR',
      name: 'SukhYatri',
      description: `${customer.tripTitle || 'Curated Indian Journey'} — #${order.bookingId}`,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=200&auto=format&fit=crop',
      order_id: order.orderId,
      prefill: {
        name: customer.name || '',
        email: customer.email || '',
        contact: cleanPhone ? `+91${cleanPhone}` : '',
      },
      notes: {
        bookingId: order.bookingId,
        platform: 'SukhYatri Web Portal',
      },
      theme: {
        color: '#1E3D34', // SukhYatri deep pine green
        backdrop_color: 'rgba(15, 23, 42, 0.85)',
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss();
        },
        escape: false,
        backdropclose: false,
      },
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        onSuccess(response);
      },
    };

    const razorpayInstance = new (window as any).Razorpay(options);

    razorpayInstance.on('payment.failed', (errResponse: any) => {
      console.warn('[PaymentService] Razorpay payment.failed event received:', errResponse);
      if (onFailure) {
        onFailure(errResponse);
      }
    });

    razorpayInstance.open();
  },
};
