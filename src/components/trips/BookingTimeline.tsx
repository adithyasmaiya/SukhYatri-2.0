import React from 'react';
import { Check, Clock, Calendar, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Booking } from '../../types';

export interface BookingTimelineProps {
  booking: Booking;
}

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming' | 'cancelled';
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ booking }) => {
  const normStatus = (booking.bookingStatus || booking.status || 'confirmed').toLowerCase();
  const isCancelled = normStatus === 'cancelled';
  const isCompleted = normStatus === 'completed';
  const isConfirmed = normStatus === 'confirmed';
  const isPending = normStatus === 'pending';

  const createdDateStr = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Confirmed';

  const travelDateStr = booking.travelDate
    ? new Date(booking.travelDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Upcoming';

  const cancelledDateStr = booking.cancelledAt
    ? new Date(booking.cancelledAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Processed';

  // Build steps dynamically based on state
  const steps: TimelineStep[] = [
    {
      id: 'created',
      title: 'Booking Created',
      description: `Reservation initialized via SukhYatri portal`,
      date: createdDateStr,
      status: 'completed',
    },
    {
      id: 'payment',
      title: isCancelled && booking.paymentStatus === 'refunded' ? 'Payment Refunded' : 'Payment Successful',
      description: isCancelled
        ? `Refund processed to original source account`
        : `100% advance tour amount confirmed via ${booking.paymentMethod?.toUpperCase() || 'UPI'}`,
      date: createdDateStr,
      status: 'completed',
    },
    {
      id: 'confirmation',
      title: isCancelled ? 'Booking Cancelled' : 'Booking Confirmed',
      description: isCancelled
        ? `Cancellation policy applied on ${cancelledDateStr}`
        : 'Hotel vouchers & verified chauffeur assigned',
      date: isCancelled ? cancelledDateStr : createdDateStr,
      status: isCancelled ? 'cancelled' : isPending ? 'current' : 'completed',
    },
    {
      id: 'journey',
      title: isCancelled
        ? 'Journey Not Undertaken'
        : isCompleted
        ? 'Journey Completed'
        : 'Journey Upcoming',
      description: isCancelled
        ? 'Cancelled ahead of scheduled journey'
        : isCompleted
        ? `Successfully concluded on ${booking.endDate || 'scheduled return date'}`
        : `Scheduled departure on ${travelDateStr}`,
      date: travelDateStr,
      status: isCancelled
        ? 'cancelled'
        : isCompleted
        ? 'completed'
        : isConfirmed
        ? 'upcoming'
        : 'upcoming',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-sand-dark/25 p-6 sm:p-7 shadow-card space-y-6">
      <div className="flex items-center justify-between border-b border-sand-dark/20 pb-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink">Booking Timeline</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time milestone tracking for your reservation
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-stone-500">
          Ref: {booking.bookingId || booking.id}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-sand-dark/30">
        {steps.map((step, idx) => {
          return (
            <div key={step.id} className="relative group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  step.status === 'completed'
                    ? 'bg-pine text-white ring-4 ring-pine/10'
                    : step.status === 'cancelled'
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                    : step.status === 'current'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : 'bg-white border-2 border-stone-300 text-stone-400'
                }`}
              >
                {step.status === 'completed' && <Check className="w-3.5 h-3.5" />}
                {step.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                {step.status === 'current' && <Clock className="w-3.5 h-3.5" />}
                {step.status === 'upcoming' && <span className="w-2 h-2 rounded-full bg-stone-300" />}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3
                    className={`font-display font-semibold text-sm ${
                      step.status === 'cancelled'
                        ? 'text-rose-700'
                        : step.status === 'completed'
                        ? 'text-ink'
                        : 'text-stone-700'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {step.date && (
                  <span className="text-[11px] font-mono text-stone-400 shrink-0">
                    {step.date}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
