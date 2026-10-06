import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface CancellationEmailData {
  customerName: string;
  bookingId: string;
  tripTitle: string;
  travelDate: string;
  cancellationDate?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: string;
  appUrl?: string;
}

export function cancellationTemplate({
  customerName,
  bookingId,
  tripTitle,
  travelDate,
  cancellationDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  cancellationReason = 'Requested by traveller',
  refundAmount,
  refundStatus = 'Pending / Under review',
  appUrl = ENV.APP_URL,
}: CancellationEmailData) {
  const formattedRefund = refundAmount !== undefined && refundAmount !== null
    ? '₹' + Number(refundAmount).toLocaleString('en-IN')
    : null;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #FDF2E9; color: #D97706; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; padding: 6px 16px; border-radius: 9999px; margin-bottom: 12px;">
        ● Booking Cancelled
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #0B1A17; margin: 0 0 6px 0; letter-spacing: -0.01em;">
        Booking Cancellation Notice
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        Dear <b>${customerName}</b>, this email confirms that your reservation <b>${bookingId}</b> for <b>${tripTitle}</b> has been cancelled.
      </p>
    </div>

    <!-- Details Card -->
    <div style="background-color: #F8FAF9; border-radius: 20px; padding: 24px; border: 1px solid #DCE5E1; margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E6ECE9; padding-bottom: 12px; margin-bottom: 16px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #72847E;">
          Cancellation Summary
        </span>
        <span style="font-family: 'SF Mono', Consolas, monospace; font-size: 12px; font-weight: 700; color: #B91C1C;">
          ${bookingId}
        </span>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 22px;">
        <tr>
          <td style="color: #637770; padding-bottom: 8px;" width="40%">Trip Title</td>
          <td style="color: #0B1A17; font-weight: 700; padding-bottom: 8px;" width="60%">${tripTitle}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Scheduled Travel Date</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${travelDate}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Cancellation Date</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${cancellationDate}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Reason</td>
          <td style="color: #0B1A17; font-weight: 500; padding-bottom: 8px;">${cancellationReason}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Refund Status</td>
          <td style="color: #D97706; font-weight: 700; padding-bottom: 8px;">
            ${refundStatus}
          </td>
        </tr>
        ${formattedRefund ? `
        <tr style="border-top: 1px dashed #DCE5E1;">
          <td style="color: #0B1A17; font-weight: 800; padding-top: 12px; font-size: 14px;">Refund Amount Eligible</td>
          <td style="color: #147A70; font-weight: 800; font-size: 16px; padding-top: 12px; font-family: 'SF Mono', Consolas, monospace;">${formattedRefund}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Refund Policy note -->
    <div style="background-color: #F1F5F4; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 12px; color: #4B635B; line-height: 18px;">
      ℹ️ <b>Refund Processing Note:</b> If applicable under SukhYatri cancellation terms, approved refunds are transferred back to the original payment source within 5–7 banking days via Razorpay.
    </div>
  `;

  return {
    subject: `Your SukhYatri booking has been cancelled — ${bookingId}`,
    html: emailLayout({
      title: 'Booking Cancelled',
      preheader: `Your reservation ${bookingId} has been cancelled`,
      content,
      actionUrl: `${appUrl}/my-trips`,
      actionText: 'View My Trips',
      footerNote: 'Need to plan another getaway? Our concierge team is always here for you.',
    }),
  };
}
