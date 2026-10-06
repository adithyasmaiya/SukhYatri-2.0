import { Resend } from 'resend';
import { ENV } from '../config/env.js';
import {
  welcomeEmailTemplate,
  WelcomeEmailData,
  verifyEmailTemplate,
  VerifyEmailData,
  passwordResetTemplate,
  PasswordResetEmailData,
  bookingConfirmationTemplate,
  BookingConfirmationEmailData,
  paymentConfirmationTemplate,
  PaymentConfirmationEmailData,
  cancellationTemplate,
  CancellationEmailData,
  refundTemplate,
  RefundEmailData,
  paymentFailedTemplate,
  PaymentFailedEmailData,
} from '../templates/email/index.js';

export interface EmailAttachment {
  filename: string;
  content: Buffer | string; // Buffer or base64 string
  contentType?: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
  from?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  provider?: string;
  error?: string;
}

export interface IEmailProvider {
  name: string;
  send(payload: EmailPayload): Promise<EmailSendResult>;
}

/**
 * 1. Console Email Provider (Default for Dev & Test)
 * Safely outputs branded email information and preview links to the console.
 */
class ConsoleEmailProvider implements IEmailProvider {
  name = 'console';

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    const timestamp = new Date().toISOString();
    const id = `console_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    console.log(`\n================== [SukhYatri Email Service: Console] ==================`);
    console.log(`Timestamp : ${timestamp}`);
    console.log(`Message ID: ${id}`);
    console.log(`From      : ${payload.from || `${ENV.EMAIL_FROM_NAME} <${ENV.EMAIL_FROM_ADDRESS}>`}`);
    console.log(`To        : ${payload.to}`);
    console.log(`Subject   : ${payload.subject}`);
    if (payload.attachments && payload.attachments.length > 0) {
      console.log(`Attachments: ${payload.attachments.map((a) => `${a.filename} (${a.content instanceof Buffer ? a.content.length : a.content.length} bytes)`).join(', ')}`);
    }
    console.log(`HTML Size : ${payload.html.length} chars`);
    console.log(`========================================================================\n`);

    return {
      success: true,
      messageId: id,
      provider: 'console',
    };
  }
}

/**
 * 2. Resend Official SDK Email Provider
 */
class ResendEmailProvider implements IEmailProvider {
  name = 'resend';
  private client: Resend | null = null;

  private getClient(): Resend | null {
    if (!this.client && ENV.EMAIL_PROVIDER_API_KEY && !ENV.EMAIL_PROVIDER_API_KEY.includes('your_api_key')) {
      this.client = new Resend(ENV.EMAIL_PROVIDER_API_KEY);
    }
    return this.client;
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    const resend = this.getClient();
    if (!resend) {
      console.warn('[EmailService:Resend] No valid API key provided. Falling back to console simulation.');
      return new ConsoleEmailProvider().send(payload);
    }

    try {
      const attachments = payload.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content instanceof Buffer ? att.content : Buffer.from(att.content),
      }));

      const { data, error } = await resend.emails.send({
        from: payload.from || `${ENV.EMAIL_FROM_NAME} <${ENV.EMAIL_FROM_ADDRESS}>`,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        attachments,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        messageId: data?.id || `resend_${Date.now()}`,
        provider: 'resend',
      };
    } catch (err: any) {
      console.error('[EmailService:Resend] Dispatch failed:', err.message);
      return {
        success: false,
        error: err.message,
        provider: 'resend',
      };
    }
  }
}

/**
 * 3. SendGrid REST API Email Provider
 */
class SendGridEmailProvider implements IEmailProvider {
  name = 'sendgrid';

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    if (!ENV.EMAIL_PROVIDER_API_KEY) {
      console.warn('[EmailService:SendGrid] No API key provided. Falling back to console simulation.');
      return new ConsoleEmailProvider().send(payload);
    }

    try {
      const attachments = payload.attachments?.map((att) => ({
        content: att.content instanceof Buffer ? att.content.toString('base64') : att.content,
        filename: att.filename,
        type: att.contentType || 'application/pdf',
        disposition: 'attachment',
      }));

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ENV.EMAIL_PROVIDER_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: payload.to }] }],
          from: {
            email: ENV.EMAIL_FROM_ADDRESS,
            name: ENV.EMAIL_FROM_NAME,
          },
          subject: payload.subject,
          content: [{ type: 'text/html', value: payload.html }],
          attachments: attachments && attachments.length > 0 ? attachments : undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`SendGrid API error ${res.status}: ${text}`);
      }

      return {
        success: true,
        messageId: `sg_${Date.now()}`,
        provider: 'sendgrid',
      };
    } catch (err: any) {
      console.error('[EmailService:SendGrid] Dispatch failed:', err.message);
      return {
        success: false,
        error: err.message,
        provider: 'sendgrid',
      };
    }
  }
}

/**
 * 4. SMTP / Custom Server Provider
 */
class SmtpEmailProvider implements IEmailProvider {
  name = 'smtp';

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    if (!ENV.SMTP_HOST) {
      console.warn('[EmailService:SMTP] No SMTP_HOST provided. Falling back to console simulation.');
      return new ConsoleEmailProvider().send(payload);
    }

    console.log(`[EmailService:SMTP] Simulated SMTP send to ${payload.to} via host ${ENV.SMTP_HOST}:${ENV.SMTP_PORT}`);
    return {
      success: true,
      messageId: `smtp_${Date.now()}`,
      provider: 'smtp',
    };
  }
}

/**
 * Main Email Service
 */
export class EmailService {
  private provider: IEmailProvider;

  constructor() {
    this.provider = this.createProvider();
  }

  private createProvider(): IEmailProvider {
    const providerName = (ENV.EMAIL_PROVIDER || 'console').toLowerCase().trim();

    switch (providerName) {
      case 'resend':
        return new ResendEmailProvider();
      case 'sendgrid':
        return new SendGridEmailProvider();
      case 'smtp':
        return new SmtpEmailProvider();
      case 'console':
      default:
        return new ConsoleEmailProvider();
    }
  }

  private async dispatchWithRetry(
    payload: EmailPayload,
    maxRetries: number = 2
  ): Promise<EmailSendResult> {
    let attempt = 0;
    let lastError = '';

    while (attempt <= maxRetries) {
      try {
        const result = await this.provider.send(payload);
        if (result.success) {
          return result;
        }
        lastError = result.error || 'Unknown dispatch failure';
      } catch (err: any) {
        lastError = err.message || 'Network exception';
      }

      attempt++;
      if (attempt <= maxRetries) {
        await new Promise((res) => setTimeout(res, attempt * 500));
      }
    }

    console.warn(
      `[EmailService] Failed to send email to ${payload.to} after ${maxRetries + 1} attempts: ${lastError}`
    );
    return {
      success: false,
      error: lastError,
      provider: this.provider.name,
    };
  }

  // =========================================================================
  // TRANSACTIONAL EMAIL METHODS
  // =========================================================================

  /**
   * 1. Welcome Email
   */
  async sendWelcomeEmail(to: string, data: WelcomeEmailData): Promise<boolean> {
    try {
      const templ = welcomeEmailTemplate({
        name: data.name,
        appUrl: data.appUrl || ENV.APP_URL,
      });
      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendWelcomeEmail error:', err);
      return false;
    }
  }

  /**
   * 2. Verification Email (with OTP code)
   */
  async sendVerificationEmail(to: string, code: string, customerName?: string): Promise<boolean> {
    try {
      const templ = verifyEmailTemplate({
        name: customerName,
        code,
        appUrl: ENV.APP_URL,
      });
      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendVerificationEmail error:', err);
      return false;
    }
  }

  /**
   * 3. Password Reset Email
   */
  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    customerName?: string
  ): Promise<boolean> {
    try {
      const templ = passwordResetTemplate({
        name: customerName,
        resetToken,
        appUrl: ENV.APP_URL,
      });
      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendPasswordResetEmail error:', err);
      return false;
    }
  }

  /**
   * 4. Booking Confirmation Email
   */
  async sendBookingConfirmation(
    to: string,
    data: BookingConfirmationEmailData,
    invoicePdf?: Buffer
  ): Promise<boolean> {
    try {
      const templ = bookingConfirmationTemplate({
        ...data,
        appUrl: data.appUrl || ENV.APP_URL,
      });

      const attachments: EmailAttachment[] = [];
      if (invoicePdf && invoicePdf.length > 0) {
        attachments.push({
          filename: `SukhYatri_Invoice_${data.invoiceNumber || data.bookingId}.pdf`,
          content: invoicePdf,
          contentType: 'application/pdf',
        });
      }

      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendBookingConfirmation error:', err);
      return false;
    }
  }

  /**
   * 5. Payment Confirmation Email
   */
  async sendPaymentConfirmation(
    to: string,
    data: PaymentConfirmationEmailData
  ): Promise<boolean> {
    try {
      const templ = paymentConfirmationTemplate({
        ...data,
        appUrl: data.appUrl || ENV.APP_URL,
      });
      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendPaymentConfirmation error:', err);
      return false;
    }
  }

  /**
   * 6. Booking Cancellation Email
   */
  async sendCancellationConfirmation(
    to: string,
    data: CancellationEmailData
  ): Promise<boolean> {
    try {
      const templ = cancellationTemplate({
        ...data,
        appUrl: data.appUrl || ENV.APP_URL,
      });
      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendCancellationConfirmation error:', err);
      return false;
    }
  }

  /**
   * 7. Refund Status Email
   */
  async sendRefundUpdate(to: string, data: RefundEmailData): Promise<boolean> {
    try {
      const templ = refundTemplate({
        ...data,
        appUrl: data.appUrl || ENV.APP_URL,
      });
      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendRefundUpdate error:', err);
      return false;
    }
  }

  /**
   * 8. Payment Failure Email
   */
  async sendPaymentFailure(to: string, data: PaymentFailedEmailData): Promise<boolean> {
    try {
      const templ = paymentFailedTemplate({
        ...data,
        appUrl: data.appUrl || ENV.APP_URL,
      });
      const res = await this.dispatchWithRetry({
        to,
        subject: templ.subject,
        html: templ.html,
      });
      return res.success;
    } catch (err) {
      console.error('[EmailService] sendPaymentFailure error:', err);
      return false;
    }
  }

  /**
   * Dev / Admin Test Template Renderer & Dispatcher
   */
  async testEmailTemplate(
    templateType: string,
    recipientEmail: string,
    sampleData: any = {}
  ): Promise<{ success: boolean; html: string; messageId?: string; error?: string }> {
    let html = '';
    let subject = `[Test] SukhYatri Email Template: ${templateType}`;
    const appUrl = ENV.APP_URL;

    switch (templateType) {
      case 'welcome': {
        const templ = welcomeEmailTemplate({
          name: sampleData.name || sampleData.customerName || 'Adithya Traveller',
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      case 'verify-email': {
        const templ = verifyEmailTemplate({
          name: sampleData.name || sampleData.customerName || 'Adithya Traveller',
          code: sampleData.code || '849201',
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      case 'password-reset': {
        const templ = passwordResetTemplate({
          name: sampleData.name || sampleData.customerName || 'Adithya Traveller',
          resetToken: sampleData.resetToken || 'sample_reset_token_xyz987',
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      case 'booking-confirmation': {
        const templ = bookingConfirmationTemplate({
          customerName: sampleData.customerName || 'Adithya Traveller',
          bookingId: sampleData.bookingId || 'SKY-2026-8F42K',
          tripTitle: sampleData.tripTitle || 'Coorg Coffee Trails & Heritage Stay',
          destination: sampleData.destination || 'Coorg, Karnataka',
          travelDate: sampleData.travelDate || '12 Dec 2026',
          duration: sampleData.duration || '4 Days / 3 Nights',
          travellerCount: sampleData.travellerCount || 2,
          amountPaid: sampleData.amountPaid || 42000,
          paymentStatus: sampleData.paymentStatus || 'Paid',
          paymentId: sampleData.paymentId || 'pay_test_Rzp8921',
          invoiceNumber: sampleData.invoiceNumber || 'SUKH-INV-2026-00421',
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      case 'payment-confirmation': {
        const templ = paymentConfirmationTemplate({
          customerName: sampleData.customerName || 'Adithya Traveller',
          paymentId: sampleData.paymentId || 'pay_test_Rzp8921',
          bookingId: sampleData.bookingId || 'SKY-2026-8F42K',
          amount: sampleData.amount || 42000,
          invoiceNumber: sampleData.invoiceNumber || 'SUKH-INV-2026-00421',
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      case 'cancellation': {
        const templ = cancellationTemplate({
          customerName: sampleData.customerName || 'Adithya Traveller',
          bookingId: sampleData.bookingId || 'SKY-2026-8F42K',
          tripTitle: sampleData.tripTitle || 'Coorg Coffee Trails',
          travelDate: sampleData.travelDate || '12 Dec 2026',
          refundAmount: sampleData.refundAmount || 37800,
          refundStatus: sampleData.refundStatus || 'Initiated (5-7 days)',
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      case 'refund': {
        const templ = refundTemplate({
          customerName: sampleData.customerName || 'Adithya Traveller',
          bookingId: sampleData.bookingId || 'SKY-2026-8F42K',
          tripTitle: sampleData.tripTitle || 'Coorg Coffee Trails',
          refundAmount: sampleData.refundAmount || 37800,
          refundStatus: sampleData.refundStatus || 'Processed / Credited',
          paymentId: sampleData.paymentId || 'pay_test_Rzp8921',
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      case 'payment-failed': {
        const templ = paymentFailedTemplate({
          customerName: sampleData.customerName || 'Adithya Traveller',
          bookingId: sampleData.bookingId || 'SKY-2026-8F42K',
          tripTitle: sampleData.tripTitle || 'Coorg Coffee Trails',
          amount: sampleData.amount || 42000,
          appUrl,
        });
        html = templ.html;
        subject = templ.subject;
        break;
      }

      default:
        throw new Error(`Unknown email template: ${templateType}`);
    }

    const sendRes = await this.dispatchWithRetry({
      to: recipientEmail,
      subject,
      html,
    });

    return {
      success: sendRes.success,
      html,
      messageId: sendRes.messageId,
      error: sendRes.error,
    };
  }
}

export const emailService = new EmailService();
