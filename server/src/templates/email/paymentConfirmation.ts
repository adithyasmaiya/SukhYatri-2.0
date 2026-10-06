import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface PaymentConfirmationEmailData {
  customerName: string;
  paymentId: string;
  bookingId: string;
  amount: number;
  paymentDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  invoiceNumber?: string;
  appUrl?: string;
}

export function paymentConfirmationTemplate({
  customerName,
  paymentId,
  bookingId,
  amount,
  paymentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  paymentMethod = 'Razorpay (UPI / NetBanking / Cards)',
  paymentStatus = 'Captured / Success',
  invoiceNumber,
  appUrl = ENV.APP_URL,
}: PaymentConfirmationEmailData) {
  const formattedAmount = '₹' + Number(amount).toLocaleString('en-IN');

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #E6F1EE; color: #147A70; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; padding: 6px 16px; border-radius: 9999px; margin-bottom: 12px;">
        ● Payment Receipt · 100% Verified
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #0B1A17; margin: 0 0 6px 0; letter-spacing: -0.01em;">
        Payment Received! 💳
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        Dear <b>${customerName}</b>, we have successfully received your payment for booking <b>${bookingId}</b>.
      </p>
    </div>

    <!-- Receipt Card -->
    <div style="background-color: #F8FAF9; border-radius: 20px; padding: 24px; border: 1px solid #DCE5E1; margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E6ECE9; padding-bottom: 12px; margin-bottom: 16px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #72847E;">
          Transaction Receipt
        </span>
        <span style="font-family: 'SF Mono', Consolas, monospace; font-size: 12px; font-weight: 700; color: #147A70;">
          ${paymentId}
        </span>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 22px;">
        <tr>
          <td style="color: #637770; padding-bottom: 8px;" width="40%">Associated Booking</td>
          <td style="color: #0B1A17; font-weight: 700; padding-bottom: 8px;" width="60%">${bookingId}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Payment Date</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${paymentDate}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Payment Method</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${paymentMethod}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Status</td>
          <td style="color: #147A70; font-weight: 800; padding-bottom: 8px;">
            <span style="background-color: #E6F1EE; color: #147A70; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
              ${paymentStatus.toUpperCase()}
            </span>
          </td>
        </tr>
        ${invoiceNumber ? `
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Invoice Ref</td>
          <td style="font-family: 'SF Mono', Consolas, monospace; color: #0B1A17; font-weight: 700; padding-bottom: 8px;">${invoiceNumber}</td>
        </tr>
        ` : ''}
        <tr style="border-top: 1px dashed #DCE5E1;">
          <td style="color: #0B1A17; font-weight: 800; padding-top: 12px; font-size: 15px;">Amount Paid</td>
          <td style="color: #147A70; font-weight: 900; font-size: 18px; padding-top: 12px; font-family: 'SF Mono', Consolas, monospace;">${formattedAmount}</td>
        </tr>
      </table>
    </div>

    <!-- Security Notice -->
    <p style="font-size: 11px; color: #72847E; line-height: 18px; text-align: center; margin: 16px 0;">
      🔒 <b>Security Note:</b> SukhYatri never stores your CVV, full card number or banking pins. All payments are encrypted and processed through RBI-authorized payment gateways.
    </p>
  `;

  return {
    subject: `Payment confirmed for SukhYatri booking ${bookingId} — ${formattedAmount}`,
    html: emailLayout({
      title: 'Payment Received',
      preheader: `Payment of ${formattedAmount} received for booking ${bookingId}`,
      content,
      actionUrl: `${appUrl}/my-trips`,
      actionText: 'View My Trips',
      footerNote: 'Thank you for choosing SukhYatri. Travel in Comfort. Arrive in Joy.',
    }),
  };
}
