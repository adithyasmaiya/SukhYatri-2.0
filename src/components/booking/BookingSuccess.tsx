import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Download, Printer, ShieldCheck, MapPin, Calendar, Users } from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/format';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { invoiceService } from '../../services/invoiceService';

export interface BookingSuccessProps {
  booking: Booking;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ booking }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const bookingId = booking.bookingId || booking.id;
  const leadName = booking.leadGuest?.name || booking.primaryTraveller?.name || 'Valued Yatri';
  const leadEmail = booking.leadGuest?.email || booking.primaryTraveller?.email || 'yatri@sukhyatri.in';

  const handleDownloadInvoice = async () => {
    try {
      setDownloadingInvoice(true);
      await invoiceService.downloadInvoicePdf(bookingId);
      toast(`Tax invoice for booking <b>${bookingId}</b> downloaded.`, 'success');
    } catch {
      setShowInvoiceModal(true);
      toast(`Viewing invoice preview for <b>${bookingId}</b>.`, 'info');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-toast-in">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-full bg-pine text-sand flex items-center justify-center text-4xl shadow-lift">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="inline-block">
          <Badge variant="confirmed">
            ● Booking ID: {bookingId} · Payment ID: {booking.paymentId || 'PAY-VERIFIED'} · Status: {booking.status || 'Confirmed'}
          </Badge>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-tight">
          Your journey is confirmed! 🎉
        </h1>

        <p className="text-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Your SukhYatri adventure is officially booked. Hotel vouchers and driver assignments will arrive at <b>{leadEmail}</b>.
        </p>
      </div>

      {/* Main Confirmation Card */}
      <div className="bg-white rounded-3xl border border-stonewarm shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between pb-6 border-b border-stonewarm/70">
          <div className="flex items-center gap-4">
            <img
              src={booking.packageImage}
              alt={booking.packageTitle}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm"
            />
            <div>
              <span className="text-xs font-bold text-moss uppercase tracking-wider">
                {booking.destName || booking.destination}
              </span>
              <h2 className="font-display text-2xl font-bold text-ink leading-snug">
                {booking.packageTitle}
              </h2>
              <div className="text-xs text-muted font-medium mt-0.5">
                Primary Guest: <strong className="text-ink">{leadName}</strong>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right bg-cream2 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
            <div className="text-xs text-muted font-bold uppercase tracking-wider">
              Amount Paid
            </div>
            <div className="font-display text-2xl font-bold text-pine mt-0.5">
              {formatINR(booking.amountPaid || booking.totalAmount)}
            </div>
            <div className="text-[11px] font-bold text-moss inline-flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-moss inline-block" />
              <span>Payment Status: {booking.paymentStatus ? (booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)) : 'Paid'}</span>
            </div>
          </div>
        </div>

        {/* 6 Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-cream2/60 rounded-2xl p-3.5 border border-stonewarm/40 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Booking ID
            </div>
            <div className="font-extrabold text-xs text-ink truncate font-mono">
              {bookingId}
            </div>
          </div>

          <div className="bg-cream2/60 rounded-2xl p-3.5 border border-stonewarm/40 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Payment ID
            </div>
            <div className="font-extrabold text-xs text-pine truncate font-mono">
              {booking.paymentId || 'PAY-VERIFIED'}
            </div>
          </div>

          <div className="bg-cream2/60 rounded-2xl p-3.5 border border-stonewarm/40 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Destination
            </div>
            <div className="font-extrabold text-xs text-ink truncate">
              {booking.destName || booking.destination}
            </div>
          </div>

          <div className="bg-cream2/60 rounded-2xl p-3.5 border border-stonewarm/40 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Departure Date
            </div>
            <div className="font-extrabold text-xs text-ink truncate">
              {booking.travelDate}
            </div>
          </div>

          <div className="bg-cream2/60 rounded-2xl p-3.5 border border-stonewarm/40 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Duration
            </div>
            <div className="font-extrabold text-xs text-ink truncate">
              {booking.duration || 'Curated Circuit'}
            </div>
          </div>

          <div className="bg-cream2/60 rounded-2xl p-3.5 border border-stonewarm/40 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Travellers
            </div>
            <div className="font-extrabold text-xs text-ink truncate">
              {booking.travellers} {booking.travellers === 1 ? 'Guest' : 'Guests'}
            </div>
          </div>
        </div>

        {/* Post-Booking Next Steps */}
        <div className="bg-mosslight/40 border border-moss/20 rounded-2xl p-4 sm:p-5 text-xs text-pine space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-moss" />
            <span>What happens next?</span>
          </div>
          <p className="text-[11.5px] text-pine/85 leading-relaxed">
            1. Your dedicated travel designer will send an introductory WhatsApp message within 2 hours.<br />
            2. Verified hotel vouchers and driver identification details will be accessible in your <b>My Trips</b> portal.<br />
            3. Free 100% cancellation is valid for the next 48 hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 justify-center !rounded-2xl py-3.5 font-bold"
            onClick={() => navigate('/my-trips')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View My Trips
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 justify-center !rounded-2xl py-3.5 font-bold"
            onClick={handleDownloadInvoice}
            disabled={downloadingInvoice}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {downloadingInvoice ? 'Downloading…' : 'Download Invoice'}
          </Button>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stonewarm">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Tax Invoice</h3>
                <div className="text-xs text-muted font-mono flex items-center gap-2">
                  <span>Ref: {bookingId}</span>
                  <span>·</span>
                  <span className="text-pine font-bold">Payment: {booking.paymentId || 'PAY-VERIFIED'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-cream2 text-ink hover:bg-stonewarm transition text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 rounded-xl bg-cream2 text-ink hover:bg-stonewarm transition text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs text-ink">
              <div className="flex justify-between">
                <div>
                  <div className="font-bold">Billed To:</div>
                  <div>{leadName}</div>
                  <div>{leadEmail}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">SukhYatri Travel Pvt. Ltd.</div>
                  <div>GSTIN: 32AABCS1429B1Z8</div>
                  <div>Kochi · Delhi · Bengaluru</div>
                </div>
              </div>

              <div className="border border-stonewarm rounded-xl p-3 space-y-2 bg-cream2/40">
                <div className="flex justify-between font-bold text-ink border-b border-stonewarm/60 pb-1">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between">
                  <span>{booking.packageTitle} ({booking.travellers} Guests)</span>
                  <span>{formatINR(booking.baseAmount)}</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-moss font-bold">
                    <span>Discount</span>
                    <span>−{formatINR(booking.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>GST (5%)</span>
                  <span>{formatINR(booking.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-stonewarm/60">
                  <span>Total Amount Paid</span>
                  <span className="text-pine font-display text-base">
                    {formatINR(booking.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="text-center text-[11px] text-muted pt-2">
                Thank you for choosing SukhYatri. Travel in Comfort. Arrive in Joy.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
