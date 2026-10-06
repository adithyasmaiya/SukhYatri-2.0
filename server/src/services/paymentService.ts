import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ENV } from '../config/env.js';
import { Payment, IPayment } from '../models/Payment.js';
import { Booking, IBooking } from '../models/Booking.js';
import { Coupon } from '../models/Coupon.js';
import { emailService } from './emailService.js';
import { invoiceService } from './invoiceService.js';
import { generatePaymentId } from '../utils/bookingIdGenerator.js';

// Initialize Razorpay SDK client with backend credentials
const razorpayClient = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

export interface CreateOrderParams {
  bookingId: string;
  userId: string;
  userRole?: string;
}

export interface CreateOrderResult {
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  bookingId: string;
  amountInINR: number;
}

export interface VerifyPaymentParams {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
  userRole?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  alreadyProcessed?: boolean;
  message: string;
  booking: IBooking;
  payment: IPayment;
}

export class PaymentService {
  /**
   * Helper to verify Razorpay checkout payment signature
   */
  public verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string = ENV.RAZORPAY_KEY_SECRET
  ): boolean {
    if (!orderId || !paymentId || !signature || !secret) {
      return false;
    }
    try {
      const generated = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const generatedBuf = Buffer.from(generated, 'utf-8');
      const signatureBuf = Buffer.from(signature, 'utf-8');

      if (generatedBuf.length !== signatureBuf.length) {
        return false;
      }
      return crypto.timingSafeEqual(generatedBuf, signatureBuf);
    } catch (err) {
      console.error('[PaymentService] Error verifying HMAC signature:', err);
      return false;
    }
  }

  /**
   * Helper to verify Razorpay webhook signature
   */
  public verifyWebhookSignature(
    rawBody: string | Buffer,
    signature: string,
    secret: string = ENV.RAZORPAY_WEBHOOK_SECRET
  ): boolean {
    if (!rawBody || !signature || !secret) {
      return false;
    }
    try {
      const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
      const generated = crypto
        .createHmac('sha256', secret)
        .update(bodyStr)
        .digest('hex');

      const generatedBuf = Buffer.from(generated, 'utf-8');
      const signatureBuf = Buffer.from(signature, 'utf-8');

      if (generatedBuf.length !== signatureBuf.length) {
        return false;
      }
      return crypto.timingSafeEqual(generatedBuf, signatureBuf);
    } catch (err) {
      console.error('[PaymentService] Error verifying webhook HMAC signature:', err);
      return false;
    }
  }

  /**
   * 1. Create a Razorpay payment order for an authenticated user's booking
   * Authoritatively computes total amount from the database booking.
   */
  async createOrder({ bookingId, userId, userRole }: CreateOrderParams): Promise<CreateOrderResult> {
    const cleanId = bookingId.trim().toUpperCase();

    // 1. Retrieve booking
    const booking = await Booking.findOne({
      $or: [
        { bookingId: cleanId },
        { _id: bookingId.match(/^[0-9a-fA-F]{24}$/) ? bookingId : null },
      ],
    });

    if (!booking) {
      const err = new Error('Booking reservation not found');
      (err as any).statusCode = 404;
      (err as any).code = 'BOOKING_NOT_FOUND';
      throw err;
    }

    // 2. Ownership verification
    if (booking.userId.toString() !== userId.toString() && userRole !== 'admin') {
      const err = new Error('Unauthorized. You do not own this reservation.');
      (err as any).statusCode = 403;
      (err as any).code = 'FORBIDDEN';
      throw err;
    }

    // 3. Payable check
    if (booking.paymentStatus === 'paid' && booking.bookingStatus === 'confirmed') {
      const err = new Error('This booking is already paid and confirmed.');
      (err as any).statusCode = 400;
      (err as any).code = 'ALREADY_PAID';
      throw err;
    }

    if (booking.bookingStatus === 'cancelled') {
      const err = new Error('Cannot initiate payment for a cancelled booking.');
      (err as any).statusCode = 400;
      (err as any).code = 'BOOKING_CANCELLED';
      throw err;
    }

    // 4. Server-side authoritative amount calculation
    const totalAmountInINR = booking.pricing?.totalAmount || 0;
    if (totalAmountInINR <= 0) {
      const err = new Error('Invalid payable amount for booking.');
      (err as any).statusCode = 400;
      (err as any).code = 'INVALID_AMOUNT';
      throw err;
    }

    // Convert safely into integer paise
    const amountInPaise = Math.round(totalAmountInINR * 100);

    // 5. Call Razorpay Order API
    let razorpayOrderId = '';

    try {
      const rzpOrder = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: booking.bookingId,
        notes: {
          bookingId: booking.bookingId,
          userId: userId.toString(),
          leadGuest: booking.primaryTraveller?.name || 'Guest',
        },
      });
      razorpayOrderId = rzpOrder.id;
    } catch (apiErr: any) {
      // In local dev/test environments with test keys or without external connectivity:
      if (
        ENV.NODE_ENV !== 'production' &&
        (ENV.RAZORPAY_KEY_ID.includes('dev') ||
          ENV.RAZORPAY_KEY_ID.includes('mock') ||
          ENV.RAZORPAY_KEY_ID.includes('yourKey') ||
          apiErr?.statusCode === 401 ||
          apiErr?.code === 'ENOTFOUND')
      ) {
        console.warn(
          `[PaymentService] Test mode active: using simulated test order reference (${apiErr.message || 'offline mode'})`
        );
        razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      } else {
        console.error('[PaymentService] Razorpay order creation failed:', apiErr);
        const err = new Error('Failed to initialize payment gateway order');
        (err as any).statusCode = 502;
        (err as any).code = 'GATEWAY_ERROR';
        throw err;
      }
    }

    // 6. Create / Update Payment Record in DB
    const paymentId = generatePaymentId();

    const paymentRecord = await Payment.create({
      paymentId,
      bookingId: booking.bookingId,
      userId: booking.userId,
      razorpayOrderId,
      amount: totalAmountInINR,
      amountInPaise,
      currency: 'INR',
      status: 'created',
      method: booking.paymentMethod || 'razorpay',
      notes: {
        bookingId: booking.bookingId,
        destination: booking.destinationName,
      },
    });

    // 7. Store reference in booking
    booking.razorpayOrderId = razorpayOrderId;
    booking.paymentId = paymentRecord.paymentId;
    booking.paymentStatus = 'pending';
    booking.bookingStatus = 'pending_payment';
    await booking.save();

    // 8. Return ONLY public checkout parameters (NEVER RETURN SECRET)
    return {
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: ENV.RAZORPAY_KEY_ID,
      bookingId: booking.bookingId,
      amountInINR: totalAmountInINR,
    };
  }

  /**
   * 2. Verify payment signature and confirm booking
   */
  async verifyPayment({
    bookingId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    userRole,
  }: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const cleanBookingId = bookingId.trim().toUpperCase();

    // 1. Retrieve booking
    const booking = await Booking.findOne({
      $or: [
        { bookingId: cleanBookingId },
        { _id: bookingId.match(/^[0-9a-fA-F]{24}$/) ? bookingId : null },
      ],
    });

    if (!booking) {
      const err = new Error('Booking reservation not found');
      (err as any).statusCode = 404;
      (err as any).code = 'BOOKING_NOT_FOUND';
      throw err;
    }

    // Ownership verification
    if (booking.userId.toString() !== userId.toString() && userRole !== 'admin') {
      const err = new Error('Unauthorized. You do not own this reservation.');
      (err as any).statusCode = 403;
      (err as any).code = 'FORBIDDEN';
      throw err;
    }

    // 2. IDEMPOTENCY / DUPLICATE PROTECTION
    // Check if this payment ID was already marked as paid
    const existingPayment = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id,
      status: 'paid',
    });

    if (existingPayment || (booking.paymentStatus === 'paid' && booking.bookingStatus === 'confirmed')) {
      const activePayment =
        existingPayment ||
        (await Payment.findOne({ bookingId: booking.bookingId, status: 'paid' })) ||
        (await Payment.findOne({ bookingId: booking.bookingId }));

      return {
        success: true,
        alreadyProcessed: true,
        message: 'Payment has already been processed and verified.',
        booking,
        payment: activePayment!,
      };
    }

    // 3. HMAC Signature Verification
    const isSignatureValid = this.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      ENV.RAZORPAY_KEY_SECRET
    );

    if (!isSignatureValid) {
      console.warn(
        `[PaymentService] Signature mismatch for order: ${razorpay_order_id}, payment: ${razorpay_payment_id}`
      );

      // Record failed payment attempt
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          $set: {
            status: 'failed',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            errorMessage: 'Signature verification mismatch',
          },
        },
        { upsert: false }
      );

      // Keep booking in appropriate state
      booking.paymentStatus = 'failed';
      booking.bookingStatus = 'payment_failed';
      await booking.save();

      // Non-blocking payment failure notification
      if (booking.primaryTraveller?.email) {
        emailService
          .sendPaymentFailure(booking.primaryTraveller.email, {
            customerName: booking.primaryTraveller.name || 'Valued Traveller',
            bookingId: booking.bookingId,
            tripTitle: booking.tripSnapshot?.title,
            amount: booking.pricing?.totalAmount || 0,
            failureReason: 'Payment gateway authentication or signature validation failed.',
            retryUrl: `${ENV.APP_URL}/my-trips/${booking.bookingId}`,
            appUrl: ENV.APP_URL,
          })
          .catch((e) => console.warn('[PaymentService] Non-critical payment failure email error:', e));
      }

      const err = new Error('Payment verification failed: Signature mismatch');
      (err as any).statusCode = 400;
      (err as any).code = 'SIGNATURE_MISMATCH';
      throw err;
    }

    // 4. Update Payment record to 'paid'
    let payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      payment = await Payment.create({
        paymentId: generatePaymentId(),
        bookingId: booking.bookingId,
        userId: booking.userId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: booking.pricing?.totalAmount || 0,
        amountInPaise: Math.round((booking.pricing?.totalAmount || 0) * 100),
        currency: 'INR',
        status: 'paid',
        method: booking.paymentMethod || 'razorpay',
      });
    } else {
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = 'paid';
      payment.updatedAt = new Date();
      await payment.save();
    }

    // 5. Update Booking to 'confirmed' and 'paid' & Generate Invoice Number
    if (!booking.invoiceNumber) {
      booking.invoiceNumber = await invoiceService.generateUniqueInvoiceNumber();
      booking.invoiceGeneratedAt = new Date();
    }
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    booking.paymentId = payment.paymentId;
    booking.amountPaid = booking.pricing?.totalAmount || 0;
    await booking.save();

    // 6. Record coupon usage if applicable
    if (booking.pricing?.couponCode) {
      const cleanCoupon = booking.pricing.couponCode.trim().toUpperCase();
      await Coupon.findOneAndUpdate(
        { code: cleanCoupon },
        { $inc: { usedCount: 1 } }
      ).catch((err) => {
        console.warn('[PaymentService] Failed to increment coupon count:', err);
      });
    }

    // 7. Generate PDF Invoice & Dispatch Confirmation Emails
    // IMPORTANT: Email/PDF failure must NEVER rollback booking/payment state
    try {
      const recipientEmail = booking.primaryTraveller?.email;
      if (recipientEmail) {
        // Generate PDF invoice buffer
        const invoicePdf = await invoiceService.generateInvoicePdf(booking, payment);

        // Send booking confirmation email with attached PDF invoice
        await emailService.sendBookingConfirmation(
          recipientEmail,
          {
            customerName: booking.primaryTraveller?.name || 'Valued Traveller',
            bookingId: booking.bookingId,
            tripTitle: booking.tripSnapshot?.title || 'SukhYatri Curated Expedition',
            destination: booking.destinationName || 'India',
            travelDate: booking.travelDate,
            duration: booking.duration,
            travellerCount: booking.travellers || 1,
            amountPaid: booking.amountPaid || booking.pricing?.totalAmount || 0,
            paymentStatus: 'Paid',
            paymentId: payment.razorpayPaymentId || payment.paymentId,
            invoiceNumber: booking.invoiceNumber,
            appUrl: ENV.APP_URL,
          },
          invoicePdf
        );

        // Send payment confirmation email
        await emailService.sendPaymentConfirmation(recipientEmail, {
          customerName: booking.primaryTraveller?.name || 'Valued Traveller',
          paymentId: payment.razorpayPaymentId || payment.paymentId,
          bookingId: booking.bookingId,
          amount: booking.amountPaid || booking.pricing?.totalAmount || 0,
          paymentMethod: payment.method || booking.paymentMethod || 'Razorpay Online Banking',
          paymentStatus: 'Success / Captured',
          invoiceNumber: booking.invoiceNumber,
          appUrl: ENV.APP_URL,
        });

        booking.confirmationEmailSentAt = new Date();
        await booking.save();
      }
    } catch (emailErr) {
      console.warn('[PaymentService] Non-critical email/invoice dispatch failure:', emailErr);
    }

    return {
      success: true,
      alreadyProcessed: false,
      message: 'Payment verified and booking confirmed successfully.',
      booking,
      payment,
    };
  }

  /**
   * 3. Fetch payment details by paymentId or bookingId
   */
  async getPaymentStatus(paymentId: string, userId: string, userRole?: string): Promise<IPayment> {
    const clean = paymentId.trim();

    const payment = await Payment.findOne({
      $or: [
        { paymentId: clean },
        { razorpayPaymentId: clean },
        { razorpayOrderId: clean },
        { bookingId: clean },
        { _id: clean.match(/^[0-9a-fA-F]{24}$/) ? clean : null },
      ],
    });

    if (!payment) {
      const err = new Error('Payment record not found');
      (err as any).statusCode = 404;
      (err as any).code = 'PAYMENT_NOT_FOUND';
      throw err;
    }

    // Ownership check
    if (payment.userId.toString() !== userId.toString() && userRole !== 'admin') {
      const err = new Error('Unauthorized to view this payment.');
      (err as any).statusCode = 403;
      (err as any).code = 'FORBIDDEN';
      throw err;
    }

    return payment;
  }

  /**
   * 4. Idempotent webhook processing with signature verification
   */
  async processWebhook(
    rawBody: string | Buffer,
    signatureHeader: string
  ): Promise<{ status: string; processed: boolean; event?: string }> {
    if (!signatureHeader) {
      const err = new Error('Missing Razorpay webhook signature header');
      (err as any).statusCode = 400;
      (err as any).code = 'MISSING_SIGNATURE';
      throw err;
    }

    // Verify webhook signature
    const isValid = this.verifyWebhookSignature(rawBody, signatureHeader, ENV.RAZORPAY_WEBHOOK_SECRET);
    if (!isValid) {
      const err = new Error('Invalid Razorpay webhook signature');
      (err as any).statusCode = 401;
      (err as any).code = 'INVALID_WEBHOOK_SIGNATURE';
      throw err;
    }

    const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf-8'));
    const event = payload.event;

    console.log(`[PaymentService] Processing Razorpay webhook event: ${event}`);

    if (event === 'order.paid' || event === 'payment.captured') {
      const orderEntity = payload.payload?.order?.entity;
      const paymentEntity = payload.payload?.payment?.entity;

      const orderId = orderEntity?.id || paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const method = paymentEntity?.method || 'razorpay';

      if (!orderId) {
        return { status: 'ignored', processed: false, event };
      }

      // Check payment record
      let payment = await Payment.findOne({ razorpayOrderId: orderId });

      if (payment && payment.status !== 'paid') {
        payment.status = 'paid';
        if (paymentId) payment.razorpayPaymentId = paymentId;
        if (method) payment.method = method;
        payment.updatedAt = new Date();
        await payment.save();

        // Update corresponding booking
        const booking = await Booking.findOne({ bookingId: payment.bookingId });
        if (booking && booking.bookingStatus !== 'confirmed') {
          booking.bookingStatus = 'confirmed';
          booking.paymentStatus = 'paid';
          booking.paymentId = payment.paymentId;
          booking.amountPaid = booking.pricing?.totalAmount || payment.amount;
          await booking.save();
        }
      }

      return { status: 'success', processed: true, event };
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const errorDesc = paymentEntity?.error_description || 'Payment failed';

      if (orderId) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            $set: {
              status: 'failed',
              razorpayPaymentId: paymentId,
              errorMessage: errorDesc,
            },
          }
        );

        const booking = await Booking.findOne({ razorpayOrderId: orderId });
        if (booking && booking.paymentStatus !== 'paid') {
          booking.paymentStatus = 'failed';
          booking.bookingStatus = 'payment_failed';
          await booking.save();
        }
      }

      return { status: 'success', processed: true, event };
    }

    return { status: 'received', processed: false, event };
  }

  /**
   * 5. Prepare refund abstraction for future refund integration
   */
  async prepareRefund(
    paymentIdentifier: string,
    amountInINR: number,
    reason: string
  ): Promise<{ status: string; refundAmount: number; paymentId: string }> {
    const payment = await Payment.findOne({
      $or: [
        { paymentId: paymentIdentifier },
        { razorpayPaymentId: paymentIdentifier },
      ],
    });

    if (!payment) {
      throw new Error('Payment record not found for refund');
    }

    // Structure for future Razorpay refund API:
    // await razorpayClient.payments.refund(payment.razorpayPaymentId, {
    //   amount: Math.round(amountInINR * 100),
    //   notes: { reason }
    // });

    return {
      status: 'prepared',
      refundAmount: amountInINR,
      paymentId: payment.paymentId,
    };
  }
}

export const paymentService = new PaymentService();
