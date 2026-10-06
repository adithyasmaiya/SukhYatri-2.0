import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface RefundEmailData {
  customerName: string;
  bookingId: string;
  tripTitle?: string;
  refundAmount: number;
  refundStatus: string;
  paymentId?: string;
  refundId?: string;
  processedDate?: string;
  appUrl?: string;
}

export function refundTemplate({
  customerName,
  bookingId,
  tripTitle,
  refundAmount,
  refundStatus = 'Processed',
  paymentId,
  refundId,
  processedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  appUrl = ENV.APP_URL,
}: RefundEmailData) {
  const formattedAmount = '₹' + Number(refundAmount).toLocaleString('en-IN');

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #E6F1EE; color: #147A70; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; padding: 6px 16px; border-radius: 9999px; margin-bottom: 12px;">
        ● Refund Update
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #0B1A17; margin: 0 0 6px 0; letter-spacing: -0.01em;">
        Your refund has been processed
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        Dear <b>${customerName}</b>, a refund for booking <b>${bookingId}</b> ${tripTitle ? `(${tripTitle})` : ''} has been initiated to your source payment method.
      </p>
    </div>

    <!-- Refund Summary Card -->
    <div style="background-color: #F8FAF9; border-radius: 20px; padding: 24px; border: 1px solid #DCE5E1; margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E6ECE9; padding-bottom: 12px; margin-bottom: 16px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #72847E;">
          Refund Transaction
        </span>
        <span style="font-family: 'SF Mono', Consolas, monospace; font-size: 12px; font-weight: 700; color: #147A70;">
          ${refundId || bookingId}
        </span>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 22px;">
        <tr>
          <td style="color: #637770; padding-bottom: 8px;" width="40%">Booking ID</td>
          <td style="color: #0B1A17; font-weight: 700; padding-bottom: 8px;" width="60%">${bookingId}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Refund Status</td>
          <td style="color: #147A70; font-weight: 800; padding-bottom: 8px;">
            <span style="background-color: #E6F1EE; color: #147A70; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
              ${refundStatus.toUpperCase()}
            </span>
          </td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Date Initiated</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${processedDate}</td>
        </tr>
        ${paymentId ? `
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Original Payment Ref</td>
          <td style="font-family: 'SF Mono', Consolas, monospace; color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${paymentId}</td>
        </tr>
        ` : ''}
        <tr style="border-top: 1px dashed #DCE5E1;">
          <td style="color: #0B1A17; font-weight: 800; padding-top: 12px; font-size: 15px;">Refund Amount</td>
          <td style="color: #147A70; font-weight: 900; font-size: 18px; padding-top: 12px; font-family: 'SF Mono', Consolas, monospace;">${formattedAmount}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 12px; color: #72847E; line-height: 20px; text-align: center; margin: 16px 0;">
      Please note that depending on your bank / card issuer, funds typically reflect in your account within <b>5 to 7 working days</b>.
    </p>
  `;

  return {
    subject: `Your SukhYatri refund has been processed — ${bookingId}`,
    html: emailLayout({
      title: 'Refund Processed',
      preheader: `Your refund of ${formattedAmount} for booking ${bookingId} has been initiated`,
      content,
      actionUrl: `${appUrl}/my-trips`,
      actionText: 'View My Trips',
      footerNote: 'Transferred via RBI-authorized payment partner Razorpay.',
    }),
  };
}
