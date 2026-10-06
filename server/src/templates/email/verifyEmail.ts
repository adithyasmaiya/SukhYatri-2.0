import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface VerifyEmailData {
  name?: string;
  code: string;
  appUrl?: string;
}

export function verifyEmailTemplate({ name, code, appUrl = ENV.APP_URL }: VerifyEmailData) {
  const greeting = name ? `Hello ${name},` : 'Hello,';
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 32px; margin-bottom: 10px;">🔐</div>
      <h1 style="font-size: 22px; font-weight: 800; color: #0B1A17; margin: 0 0 8px 0;">
        Verify Your SukhYatri Account
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        ${greeting} please use the 6-digit verification code below to confirm your email address and activate your account.
      </p>
    </div>

    <!-- OTP Code Card -->
    <div style="background-color: #F8FAF9; border-radius: 18px; padding: 24px; text-align: center; border: 1px solid #DCE5E1; margin: 24px 0;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: #72847E; margin-bottom: 8px;">
        Your Verification Code
      </div>
      <div style="font-family: 'SF Mono', Consolas, Menlo, monospace; font-size: 38px; font-weight: 800; color: #147A70; letter-spacing: 0.25em; padding: 6px 0;">
        ${code}
      </div>
      <div style="font-size: 12px; color: #72847E; margin-top: 8px;">
        Valid for 24 hours · Never share this code with anyone
      </div>
    </div>

    <p style="font-size: 12px; line-height: 18px; color: #72847E; text-align: center; margin: 0;">
      If you did not register for an account on SukhYatri, please safely disregard this email.
    </p>
  `;

  return {
    subject: `Your SukhYatri Verification Code — ${code}`,
    html: emailLayout({
      title: 'Verify Your SukhYatri Account',
      preheader: `Your SukhYatri verification code is ${code}. Confirm your email to get started.`,
      content,
      actionUrl: `${appUrl}/verify-email`,
      actionText: 'Enter Code on SukhYatri',
    }),
  };
}
