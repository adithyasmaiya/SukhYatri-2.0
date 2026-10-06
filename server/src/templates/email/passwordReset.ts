import { emailLayout } from './layout.js';
import { ENV } from '../../config/env.js';

export interface PasswordResetEmailData {
  name?: string;
  resetToken: string;
  appUrl?: string;
}

export function passwordResetTemplate({
  name,
  resetToken,
  appUrl = ENV.APP_URL,
}: PasswordResetEmailData) {
  const greeting = name ? `Hello ${name},` : 'Hello,';
  const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 32px; margin-bottom: 10px;">🛡️</div>
      <h1 style="font-size: 22px; font-weight: 800; color: #0B1A17; margin: 0 0 8px 0;">
        Reset Your Password
      </h1>
      <p style="font-size: 14px; line-height: 22px; color: #4B635B; margin: 0;">
        ${greeting} we received a request to reset the password for your SukhYatri account. Click the button below to choose a new password.
      </p>
    </div>

    <div style="background-color: #F8FAF9; border-radius: 16px; padding: 18px; border: 1px solid #E6ECE9; text-align: center; margin: 20px 0;">
      <p style="font-size: 12px; line-height: 18px; color: #72847E; margin: 0;">
        ⏳ <b>Security Notice:</b> This password reset link will expire in <b>60 minutes</b> for your security.
      </p>
    </div>

    <p style="font-size: 12px; line-height: 18px; color: #72847E; text-align: center; margin: 16px 0 0 0;">
      If you did not request a password reset, no action is needed. Your password remains safe and unchanged.
    </p>
  `;

  return {
    subject: `Reset your SukhYatri password`,
    html: emailLayout({
      title: 'Reset Your SukhYatri Password',
      preheader: 'Use this secure link to reset your SukhYatri account password within 60 minutes.',
      content,
      actionUrl: resetLink,
      actionText: 'Reset Password',
      footerNote: 'This link is unique to you and will expire in 1 hour.',
    }),
  };
}
