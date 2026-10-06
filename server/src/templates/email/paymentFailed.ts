import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface PaymentFailedEmailData {
  customerName: string;
  bookingId: string;
  tripTitle?: string;
  amount: number;
  failureReason?: string;
  retryUrl?: string;
  appUrl?: string;
}

export function paymentFailedTemplate({
  customerName,
  bookingId,
  tripTitle,
  amount,
  failureReason = 'Card declined or session timed out by bank',
  retryUrl,
  appUrl = ENV.APP_URL,
}: PaymentFailedEmailData) {
  const formattedAmount = '₹' + Number(amount).toLocaleString('en-IN');
  const actionUrl = retryUrl || `${appUrl}/my-trips/${bookingId}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #FEE2E2; color: #DC2626; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; padding: 6px 16px; border-radius: 9999px; margin-bottom: 12px;">
        ● Payment Unsuccessful
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #0B1A17; margin: 0 0 6px 0; letter-spacing: -0.01em;">
        Payment Could Not Be Completed
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        Dear <b>${customerName}</b>, we noticed your payment attempt for booking <b>${bookingId}</b> ${tripTitle ? `(${tripTitle})` : ''} was not completed.
      </p>
    </div>

    <!-- Details Card -->
    <div style="background-color: #F8FAF9; border-radius: 20px; padding: 24px; border: 1px solid #DCE5E1; margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E6ECE9; padding-bottom: 12px; margin-bottom: 16px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #72847E;">
          Failed Transaction Alert
        </span>
        <span style="font-family: 'SF Mono', Consolas, monospace; font-size: 12px; font-weight: 700; color: #DC2626;">
          ${bookingId}
        </span>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 22px;">
        <tr>
          <td style="color: #637770; padding-bottom: 8px;" width="40%">Booking Ref</td>
          <td style="color: #0B1A17; font-weight: 700; padding-bottom: 8px;" width="60%">${bookingId}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Attempted Amount</td>
          <td style="color: #0B1A17; font-weight: 700; padding-bottom: 8px;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Reason Noted</td>
          <td style="color: #DC2626; font-weight: 600; padding-bottom: 8px;">${failureReason}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Booking Status</td>
          <td style="color: #D97706; font-weight: 600; padding-bottom: 8px;">Awaiting Payment</td>
        </tr>
      </table>
    </div>

    <!-- Assurance box -->
    <div style="background-color: #F1F5F4; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 12px; color: #4B635B; line-height: 18px;">
      🛡️ <b>No double charges:</b> If any money was deducted from your account, banks automatically reverse unauthorized or failed transactions within 24–48 hours.
    </div>
  `;

  return {
    subject: `Important: Payment could not be completed for booking ${bookingId}`,
    html: emailLayout({
      title: 'Payment Unsuccessful',
      preheader: `Payment attempt of ${formattedAmount} for booking ${bookingId} was unsuccessful`,
      content,
      actionUrl,
      actionText: 'Retry Payment',
      footerNote: 'Your trip itinerary is saved for 24 hours while payment is pending.',
    }),
  };
}
