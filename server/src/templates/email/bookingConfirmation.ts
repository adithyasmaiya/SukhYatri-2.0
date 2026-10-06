import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface BookingConfirmationEmailData {
  customerName: string;
  bookingId: string;
  tripTitle: string;
  destination: string;
  travelDate: string;
  duration?: string;
  travellerCount: number;
  amountPaid: number;
  paymentStatus: string;
  paymentId?: string;
  invoiceNumber?: string;
  appUrl?: string;
}

export function bookingConfirmationTemplate({
  customerName,
  bookingId,
  tripTitle,
  destination,
  travelDate,
  duration = 'Multi-day itinerary',
  travellerCount,
  amountPaid,
  paymentStatus,
  paymentId,
  invoiceNumber,
  appUrl = ENV.APP_URL,
}: BookingConfirmationEmailData) {
  const formattedAmount = '₹' + Number(amountPaid).toLocaleString('en-IN');

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #E6F1EE; color: #147A70; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; padding: 6px 16px; border-radius: 9999px; margin-bottom: 12px;">
        ● Payment Confirmed · Reservation Secured
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #0B1A17; margin: 0 0 6px 0; letter-spacing: -0.01em;">
        Your journey is confirmed! 🎉
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        Dear <b>${customerName}</b>, we are delighted to confirm your upcoming retreat. Every detail is being curated by your dedicated SukhYatri concierge.
      </p>
    </div>

    <!-- Booking Summary Card -->
    <div style="background-color: #F8FAF9; border-radius: 20px; padding: 24px; border: 1px solid #DCE5E1; margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E6ECE9; padding-bottom: 12px; margin-bottom: 16px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #72847E;">
          Trip Reservation
        </span>
        <span style="font-family: 'SF Mono', Consolas, monospace; font-size: 12px; font-weight: 700; color: #147A70;">
          ${bookingId}
        </span>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 22px;">
        <tr>
          <td style="color: #637770; padding-bottom: 8px;" width="40%">Itinerary</td>
          <td style="color: #0B1A17; font-weight: 700; padding-bottom: 8px;">${tripTitle}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Destination</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${destination}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Departure Date</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${travelDate}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Duration</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${duration}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Party Size</td>
          <td style="color: #0B1A17; font-weight: 600; padding-bottom: 8px;">${travellerCount} ${travellerCount === 1 ? 'Guest' : 'Guests'}</td>
        </tr>
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Payment Status</td>
          <td style="color: #147A70; font-weight: 700; padding-bottom: 8px; text-transform: uppercase;">${paymentStatus}</td>
        </tr>
        ${
          paymentId
            ? `
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Payment ID</td>
          <td style="color: #0B1A17; font-family: monospace; font-size: 11px; padding-bottom: 8px;">${paymentId}</td>
        </tr>`
            : ''
        }
        ${
          invoiceNumber
            ? `
        <tr>
          <td style="color: #637770; padding-bottom: 8px;">Invoice Number</td>
          <td style="color: #0B1A17; font-family: monospace; font-size: 11px; padding-bottom: 8px;">${invoiceNumber}</td>
        </tr>`
            : ''
        }
        <tr style="border-top: 1px solid #E6ECE9;">
          <td style="color: #0B1A17; font-weight: 800; padding-top: 12px; font-size: 14px;">Total Paid</td>
          <td style="color: #147A70; font-weight: 800; padding-top: 12px; font-size: 18px;">${formattedAmount}</td>
        </tr>
      </table>
    </div>

    <!-- Concierge What's Next Box -->
    <div style="background-color: #FFFFFF; border-radius: 16px; padding: 18px; border: 1px solid #E6ECE9; margin-bottom: 24px;">
      <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #147A70; margin: 0 0 8px 0;">
        What happens next?
      </h4>
      <p style="font-size: 12px; line-height: 18px; color: #5A6F68; margin: 0;">
        Our verified concierge desk will reach out via WhatsApp 48 hours prior to your journey with your dedicated driver's contact details, sanitized vehicle credentials, and stay check-in tokens.
      </p>
    </div>

    <div style="text-align: center; margin-top: 16px;">
      <a href="${appUrl}/api/bookings/${bookingId}/invoice" target="_blank" style="font-size: 12px; font-weight: 700; color: #147A70; text-decoration: underline;">
        📄 Download Tax Invoice (PDF)
      </a>
    </div>
  `;

  return {
    subject: `Your SukhYatri journey is confirmed — ${bookingId}`,
    html: emailLayout({
      title: 'Your Journey is Confirmed',
      preheader: `Booking ${bookingId} is confirmed for ${tripTitle} on ${travelDate}. Safe travels with SukhYatri!`,
      content,
      actionUrl: `${appUrl}/my-trips/${bookingId}`,
      actionText: 'View My Trip',
      footerNote: 'Your formal tax invoice is available in your SukhYatri My Trips dashboard.',
    }),
  };
}
