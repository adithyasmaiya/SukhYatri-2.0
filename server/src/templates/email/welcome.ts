import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface WelcomeEmailData {
  name: string;
  appUrl?: string;
}

export function welcomeEmailTemplate({ name, appUrl = ENV.APP_URL }: WelcomeEmailData) {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 36px; line-height: 1; margin-bottom: 8px;">✨</div>
      <h1 style="font-size: 24px; font-weight: 800; color: #0B1A17; margin: 0 0 8px 0; letter-spacing: -0.01em;">
        Welcome to SukhYatri, ${name}
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        You've joined a community of travelers who cherish thoughtful hospitality, unhurried journeys, and verified boutique sanctuaries across India.
      </p>
    </div>

    <div style="background-color: #F8FAF9; border-radius: 16px; padding: 20px; border: 1px solid #E6ECE9; margin-bottom: 24px;">
      <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #147A70; margin: 0 0 12px 0;">
        The SukhYatri Promise
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #223832;">
            🌿 <b>Curated Slow Stays</b> — Personally inspected boutique heritage properties
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #223832;">
            🚗 <b>Dedicated Chauffeurs</b> — Verified, polite drivers with private sanitized vehicles
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #223832;">
            🛎️ <b>24/7 WhatsApp Concierge</b> — On-ground support throughout every leg of your journey
          </td>
        </tr>
      </table>
    </div>

    <p style="font-size: 13px; line-height: 20px; color: #5A6F68; text-align: center; margin: 0;">
      Whenever you are ready to plan your next retreat, our verified itineraries across Kerala, Goa, Kashmir, and Rajasthan await.
    </p>
  `;

  return {
    subject: `Welcome to SukhYatri — Travel in Comfort. Arrive in Joy.`,
    html: emailLayout({
      title: 'Welcome to SukhYatri',
      preheader: `Welcome to SukhYatri, ${name}! Your journeys of comfort and joy begin here.`,
      content,
      actionUrl: `${appUrl}/explore`,
      actionText: 'Explore Curated Trips',
      footerNote: 'You received this email because you signed up for an account on SukhYatri.',
    }),
  };
}
