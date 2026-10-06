import { Resend } from 'resend';
import { ENV } from '../config/env.js';

async function main() {
  const apiKey = ENV.EMAIL_PROVIDER_API_KEY;

  if (!apiKey || apiKey.includes('your_api_key') || apiKey === 're_xxxxxxxxx') {
    console.error('\n❌ Error: Please replace re_xxxxxxxxx with your real Resend API key in server/.env\n');
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  console.log('\n🚀 Dispatching test email via official Resend API...');
  console.log(`From : ${ENV.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev'}`);
  console.log(`To   : sukhyatrii@gmail.com`);

  const { data, error } = await resend.emails.send({
    from: ENV.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev',
    to: 'sukhyatrii@gmail.com',
    subject: 'Hello World — SukhYatri 2.0',
    html: '<p>Congrats on sending your <strong>first email</strong> with SukhYatri 2.0 & Resend!</p>',
  });

  if (error) {
    console.error('\n❌ Resend dispatch error:', error.message || error);
    process.exit(1);
  }

  console.log(`\n✅ Email successfully sent! Message ID: ${data?.id}\n`);
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
