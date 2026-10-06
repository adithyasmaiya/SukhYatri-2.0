import PDFDocument from 'pdfkit';
import { IBooking, Booking } from '../models/Booking.js';
import { IPayment } from '../models/Payment.js';

interface InvoiceCacheEntry {
  buffer: Buffer;
  generatedAt: number;
}

class InvoiceService {
  private cache = new Map<string, InvoiceCacheEntry>();
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  /**
   * Generates a unique, human-readable invoice number.
   * Format: SUKH-INV-2026-XXXXX
   */
  async generateUniqueInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let isUnique = false;
    let invoiceNumber = '';

    while (!isUnique) {
      const randomPart = Math.floor(10000 + Math.random() * 90000); // 5 digits
      invoiceNumber = `SUKH-INV-${year}-${randomPart}`;
      const existing = await Booking.findOne({ invoiceNumber });
      if (!existing) {
        isUnique = true;
      }
    }

    return invoiceNumber;
  }

  /**
   * Generates a PDF buffer for the given booking and optional payment.
   * Utilizes an in-memory cache to prevent redundant PDF generation.
   */
  async generateInvoicePdf(booking: IBooking, payment?: IPayment | null): Promise<Buffer> {
    const cacheKey = booking.bookingId;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.generatedAt < this.CACHE_TTL_MS) {
      return cached.buffer;
    }

    const pdfBuffer = await this.renderPdf(booking, payment);

    // Cache the generated buffer
    this.cache.set(cacheKey, {
      buffer: pdfBuffer,
      generatedAt: Date.now(),
    });

    return pdfBuffer;
  }

  /**
   * Internal PDFKit renderer for SukhYatri branded invoice
   */
  private renderPdf(booking: IBooking, payment?: IPayment | null): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 40,
          size: 'A4',
          info: {
            Title: `SukhYatri Invoice - ${booking.invoiceNumber || booking.bookingId}`,
            Author: 'SukhYatri Travel Experiences',
            Subject: `Invoice for Booking ${booking.bookingId}`,
          },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        const primaryColor = '#147A70'; // Brand Teal
        const darkColor = '#0B1A17'; // Brand Forest Dark
        const grayColor = '#4B635B'; // Muted Slate
        const lightBg = '#F4F7F6'; // Card background
        const borderColor = '#DCE5E1'; // Border line

        // ==========================================
        // 1. BRAND HEADER & INVOICE TITLE
        // ==========================================
        // Top decorative accent line
        doc.rect(40, 40, 515, 4).fill(primaryColor);

        // SukhYatri Wordmark & Tagline
        doc.fillColor(darkColor).fontSize(22).font('Helvetica-Bold').text('SukhYatri', 40, 56);
        doc
          .fillColor(primaryColor)
          .fontSize(9)
          .font('Helvetica')
          .text('Travel in Comfort. Arrive in Joy.', 40, 80);

        doc
          .fillColor(grayColor)
          .fontSize(8)
          .font('Helvetica')
          .text('SukhYatri Experiences Pvt. Ltd.', 40, 96)
          .text('GSTIN: 29AABCS1429B1Z8 · CIN: U63040KA2025PTC198421', 40, 107)
          .text('Indiranagar, Bengaluru, Karnataka 560038 · support@sukhyatri.in', 40, 118);

        // Right side: INVOICE META
        doc
          .fillColor(primaryColor)
          .fontSize(18)
          .font('Helvetica-Bold')
          .text('TAX INVOICE', 350, 56, { align: 'right', width: 205 });

        const invoiceNum = booking.invoiceNumber || `SUKH-INV-${new Date().getFullYear()}-${booking.bookingId.slice(-5)}`;
        const invoiceDate = booking.invoiceGeneratedAt
          ? new Date(booking.invoiceGeneratedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        doc
          .fillColor(darkColor)
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(`Invoice No: `, 350, 82, { align: 'right', width: 110 })
          .font('Helvetica')
          .text(invoiceNum, 465, 82, { align: 'right', width: 90 });

        doc
          .font('Helvetica-Bold')
          .text(`Invoice Date: `, 350, 95, { align: 'right', width: 110 })
          .font('Helvetica')
          .text(invoiceDate, 465, 95, { align: 'right', width: 90 });

        doc
          .font('Helvetica-Bold')
          .text(`Booking Ref: `, 350, 108, { align: 'right', width: 110 })
          .font('Helvetica')
          .text(booking.bookingId, 465, 108, { align: 'right', width: 90 });

        if (payment?.paymentId || booking.paymentId) {
          doc
            .font('Helvetica-Bold')
            .text(`Payment ID: `, 350, 121, { align: 'right', width: 110 })
            .font('Helvetica')
            .text(payment?.razorpayPaymentId || payment?.paymentId || booking.paymentId || 'Verified', 465, 121, {
              align: 'right',
              width: 90,
            });
        }

        // Horizontal separator
        doc.strokeColor(borderColor).lineWidth(1).moveTo(40, 142).lineTo(555, 142).stroke();

        // ==========================================
        // 2. BILLED TO & TRIP SUMMARY
        // ==========================================
        const billedToY = 154;

        // Left box: Customer details
        doc.rect(40, billedToY, 250, 80).fill(lightBg);
        doc.rect(40, billedToY, 250, 80).strokeColor(borderColor).stroke();

        doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold').text('BILLED TO (CUSTOMER)', 52, billedToY + 10);
        doc.fillColor(darkColor).fontSize(11).font('Helvetica-Bold').text(booking.primaryTraveller?.name || 'Valued Traveller', 52, billedToY + 23);
        doc
          .fillColor(grayColor)
          .fontSize(9)
          .font('Helvetica')
          .text(booking.primaryTraveller?.email || 'N/A', 52, billedToY + 38)
          .text(booking.primaryTraveller?.phone || 'N/A', 52, billedToY + 50)
          .text(`Total Travellers: ${booking.travellers || 1} (${booking.adults || 1} Adults${booking.children ? `, ${booking.children} Kids` : ''})`, 52, billedToY + 62);

        // Right box: Trip Summary
        doc.rect(305, billedToY, 250, 80).fill(lightBg);
        doc.rect(305, billedToY, 250, 80).strokeColor(borderColor).stroke();

        doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold').text('EXPEDITION DETAILS', 317, billedToY + 10);
        doc.fillColor(darkColor).fontSize(11).font('Helvetica-Bold').text(booking.tripSnapshot?.title || 'Luxury Retreat', 317, billedToY + 23, { width: 230, ellipsis: true });
        doc
          .fillColor(grayColor)
          .fontSize(9)
          .font('Helvetica')
          .text(`Destination: ${booking.destinationName || booking.tripSnapshot?.destination || 'India'}`, 317, billedToY + 38)
          .text(`Dates: ${booking.travelDate}${booking.endDate ? ' - ' + booking.endDate : ''}`, 317, billedToY + 50)
          .text(`Duration: ${booking.duration || booking.tripSnapshot?.duration || 'Multi-day'}`, 317, billedToY + 62);

        // ==========================================
        // 3. ITEMIZED CHARGES TABLE
        // ==========================================
        const tableY = 252;

        // Table Header
        doc.rect(40, tableY, 515, 24).fill(primaryColor);
        doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
        doc.text('DESCRIPTION & PACKAGE SPECIFICATIONS', 50, tableY + 7);
        doc.text('RATE (INR)', 330, tableY + 7, { align: 'right', width: 65 });
        doc.text('QTY', 415, tableY + 7, { align: 'center', width: 35 });
        doc.text('AMOUNT (INR)', 470, tableY + 7, { align: 'right', width: 75 });

        // Table Row 1: Base Package
        const row1Y = tableY + 24;
        const baseAmount = booking.pricing?.baseAmount || booking.tripSnapshot?.price || 0;
        const travellerCount = booking.pricing?.travellerCount || booking.travellers || 1;
        const subtotal = booking.pricing?.subtotal || baseAmount * travellerCount;

        doc.rect(40, row1Y, 515, 36).fill('#FFFFFF');
        doc.rect(40, row1Y, 515, 36).strokeColor(borderColor).stroke();

        doc
          .fillColor(darkColor)
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(booking.tripSnapshot?.title || 'SukhYatri Curated Expedition', 50, row1Y + 7, { width: 270 })
          .fillColor(grayColor)
          .fontSize(8)
          .font('Helvetica')
          .text(`Tier: ${booking.roomCategory || 'Luxury All-Inclusive'} · Premium Travel Concierge`, 50, row1Y + 20);

        doc.fillColor(darkColor).fontSize(9).font('Helvetica');
        doc.text(baseAmount.toLocaleString('en-IN'), 330, row1Y + 12, { align: 'right', width: 65 });
        doc.text(String(travellerCount), 415, row1Y + 12, { align: 'center', width: 35 });
        doc.font('Helvetica-Bold').text(subtotal.toLocaleString('en-IN'), 470, row1Y + 12, { align: 'right', width: 75 });

        // Calculations & Summary Box
        let currentY = row1Y + 36;

        // Discount Row (if applicable)
        const discount = booking.pricing?.discount || 0;
        if (discount > 0) {
          doc.rect(40, currentY, 515, 24).fill('#FAFCFA').strokeColor(borderColor).stroke();
          doc
            .fillColor('#15803D')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text(`Promotional Voucher applied (${booking.pricing?.couponCode || 'PROMO'})`, 50, currentY + 7);
          doc
            .fontSize(9)
            .text(`- ₹${discount.toLocaleString('en-IN')}`, 470, currentY + 7, { align: 'right', width: 75 });
          currentY += 24;
        }

        // Subtotal row
        doc.rect(40, currentY, 515, 22).fill('#FFFFFF').strokeColor(borderColor).stroke();
        doc.fillColor(grayColor).fontSize(8).font('Helvetica').text('Subtotal (Package services)', 330, currentY + 6);
        const effectiveSubtotal = Math.max(0, subtotal - discount);
        doc.fillColor(darkColor).fontSize(8).font('Helvetica-Bold').text(`₹${effectiveSubtotal.toLocaleString('en-IN')}`, 470, currentY + 6, { align: 'right', width: 75 });
        currentY += 22;

        // Taxes row (GST 5%)
        const taxes = booking.pricing?.taxes || 0;
        doc.rect(40, currentY, 515, 22).fill('#FFFFFF').strokeColor(borderColor).stroke();
        doc.fillColor(grayColor).fontSize(8).font('Helvetica').text('Taxes & Levies (GST @ 5% Tour Operators)', 300, currentY + 6);
        doc.fillColor(darkColor).fontSize(8).font('Helvetica-Bold').text(`₹${taxes.toLocaleString('en-IN')}`, 470, currentY + 6, { align: 'right', width: 75 });
        currentY += 22;

        // Grand Total Row
        const totalAmount = booking.pricing?.totalAmount || effectiveSubtotal + taxes;
        doc.rect(40, currentY, 515, 30).fill(lightBg).strokeColor(borderColor).stroke();
        doc
          .fillColor(darkColor)
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('TOTAL AMOUNT (INR)', 300, currentY + 9);
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`₹${totalAmount.toLocaleString('en-IN')}`, 450, currentY + 8, { align: 'right', width: 95 });
        currentY += 30;

        // ==========================================
        // 4. PAYMENT RECEIPT & SETTLEMENT
        // ==========================================
        currentY += 16;
        doc.rect(40, currentY, 515, 52).fill('#F8FAF9').strokeColor(borderColor).stroke();

        // Payment status badge
        doc.rect(52, currentY + 12, 60, 20).fill('#E6F1EE');
        doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('PAID', 52, currentY + 17, { width: 60, align: 'center' });

        const amountPaid = booking.amountPaid || totalAmount;
        doc
          .fillColor(darkColor)
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(`Amount Received: ₹${amountPaid.toLocaleString('en-IN')} (Full Payment)`, 124, currentY + 13)
          .fillColor(grayColor)
          .fontSize(8)
          .font('Helvetica')
          .text(
            `Payment Gateway: ${payment?.method || booking.paymentMethod || 'Razorpay Online Banking / UPI'} · Ref: ${payment?.razorpayPaymentId || payment?.paymentId || booking.paymentId || 'CAPTURED'}`,
            124,
            currentY + 28
          );

        doc
          .fillColor('#15803D')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('Balance Due: ₹0.00', 440, currentY + 18, { align: 'right', width: 105 });

        // ==========================================
        // 5. TERMS & SIGN-OFF FOOTER
        // ==========================================
        const footerY = 510;
        doc.strokeColor(borderColor).lineWidth(1).moveTo(40, footerY).lineTo(555, footerY).stroke();

        doc
          .fillColor(darkColor)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('Important Information & Travel Undertaking', 40, footerY + 10);

        doc
          .fillColor(grayColor)
          .fontSize(7.5)
          .font('Helvetica')
          .text(
            '1. This invoice serves as an authentic proof of reservation for the listed itinerary. Please present this document along with valid government photo IDs during check-in.\n' +
            '2. Cancellations and modifications are subject to SukhYatri terms and conditions. For trip revisions, reach out to your dedicated concierge at concierge@sukhyatri.in.\n' +
            '3. All disputes are subject to the exclusive jurisdiction of the competent courts in Bengaluru, India.',
            40,
            footerY + 22,
            { width: 515, lineGap: 2 }
          );

        // Security / Computer generated note
        doc
          .fillColor(primaryColor)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('This is a computer-generated invoice and requires no physical signature.', 40, 760, {
            align: 'center',
            width: 515,
          });

        doc
          .fillColor(grayColor)
          .fontSize(7.5)
          .font('Helvetica')
          .text('© 2026 SukhYatri Travel Experiences Pvt. Ltd. · All Rights Reserved · www.sukhyatri.in', 40, 772, {
            align: 'center',
            width: 515,
          });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const invoiceService = new InvoiceService();
