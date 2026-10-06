import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Booking } from '../../types';
import { invoiceService } from '../../services/invoiceService';
import { formatINR } from '../../utils/format';

export interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen) return null;

  const [isDownloading, setIsDownloading] = React.useState(false);
  const invData = invoiceService.generateInvoiceData(booking);

  const handlePrint = () => {
    invoiceService.printInvoice();
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      await invoiceService.downloadInvoicePdf(booking.bookingId || booking.id);
    } catch {
      // Handled in service fallback
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 text-center">
        <div
          className="relative bg-white rounded-3xl max-w-2xl w-full text-left shadow-2xl border border-sand-dark/20 overflow-hidden transform transition-all my-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action Bar (Top) */}
          <div className="p-4 sm:p-6 border-b border-sand-dark/20 flex items-center justify-between bg-sand/20 print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-white text-pine border border-pine/20">
                {invData.invoiceNumber}
              </span>
              <span className="text-xs text-stone-500">Official Tax Invoice</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-pine text-white hover:bg-pinedark transition-colors shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Downloading…' : 'Download PDF'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-ink hover:bg-sand/60 border border-sand-dark/30 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-ink p-1.5 rounded-full hover:bg-sand/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Paper Area */}
          <div className="p-6 sm:p-8 space-y-6 text-ink bg-white font-sans text-xs">
            {/* Header Brand */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-sand-dark/20">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pine text-white font-display font-bold flex items-center justify-center text-base">
                    SY
                  </div>
                  <span className="font-display font-bold text-xl text-pine tracking-tight">
                    SukhYatri
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 italic">
                  Travel in Comfort. Arrive in Joy.
                </p>
                <p className="text-[11px] text-stone-500 mt-2 max-w-xs leading-relaxed">
                  {invData.companyAddress}
                  <br />
                  GSTIN: <strong className="font-mono text-stone-700">{invData.companyGstin}</strong>
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  TAX INVOICE
                </span>
                <span className="font-mono font-bold text-base text-ink block mt-0.5">
                  {invData.invoiceNumber}
                </span>
                <span className="text-stone-500 text-[11px] block mt-1">
                  Date: {new Date(invData.invoiceDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-stone-500 text-[11px] block">
                  Booking Ref: <strong className="font-mono text-stone-700">{invData.bookingId}</strong>
                </span>
              </div>
            </div>

            {/* Billed To & Journey Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-sand-dark/20">
              <div className="p-3.5 rounded-2xl bg-cream/40 border border-sand-dark/20">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                  Billed To (Primary Traveller)
                </span>
                <span className="font-display font-semibold text-sm text-ink block">
                  {invData.customerName}
                </span>
                <span className="text-stone-600 block mt-0.5">{invData.customerEmail}</span>
                {invData.customerPhone && (
                  <span className="text-stone-600 block">{invData.customerPhone}</span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-cream/40 border border-sand-dark/20">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                  Journey Particulars
                </span>
                <span className="font-display font-semibold text-sm text-ink block">
                  {invData.tripTitle}
                </span>
                <span className="text-stone-600 block mt-0.5">
                  Destination: <strong>{invData.destination}</strong>
                </span>
                <span className="text-stone-600 block">
                  Travel Date: {new Date(invData.travelDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  · {invData.travellersCount} Guests
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="border border-sand-dark/30 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand/30 text-stone-600 border-b border-sand-dark/30">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Description</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Qty / Travellers</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Rate</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-dark/20">
                    {invData.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-sand/10">
                        <td className="py-2.5 px-3 text-stone-800 font-medium">
                          {item.description}
                        </td>
                        <td className="py-2.5 px-3 text-center text-stone-600 font-mono">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-stone-600 font-mono">
                          {formatINR(item.rate)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-ink font-semibold font-mono">
                          {formatINR(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Total */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
              <div className="text-[11px] text-stone-500 max-w-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Payment Status: {invData.paymentStatus}</span>
                </div>
                <p>
                  Payment Method: <span className="uppercase font-mono">{invData.paymentMethod}</span>
                </p>
                <p className="text-stone-400 italic">
                  This is a computer-generated tax invoice and requires no physical signature. Registered tour operator service under GST Act 2017.
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatINR(invData.subtotal)}</span>
                </div>
                {invData.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied:</span>
                    <span className="font-mono">- {formatINR(invData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>GST & Tourism Cess (5%):</span>
                  <span className="font-mono">{formatINR(invData.taxes)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-ink pt-2 border-t border-sand-dark/30">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-pine">{formatINR(invData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="p-4 sm:p-5 border-t border-sand-dark/20 bg-cream/40 flex justify-end gap-2.5 print:hidden">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-sand/60 hover:bg-sand text-ink transition-colors border border-sand-dark/30"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-pine hover:bg-pinedark text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download / Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
