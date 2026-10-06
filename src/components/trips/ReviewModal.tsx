import React, { useState } from 'react';
import { X, Star, Sparkles, AlertCircle } from 'lucide-react';
import { Booking } from '../../types';

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSubmitReview: (bookingId: string, rating: number, title: string, comment: string) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please add a short title for your review.');
      return;
    }
    if (!comment.trim() || comment.length < 15) {
      setError('Please share at least a sentence or two (15+ characters) about your experience.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmitReview(booking.bookingId || booking.id, rating, title.trim(), comment.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          className="relative bg-white rounded-3xl max-w-lg w-full text-left shadow-2xl border border-sand-dark/20 overflow-hidden transform transition-all my-8 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-sand-dark/20 flex items-start justify-between bg-cream/50">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sand text-pine flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-ink">
                  Write a Review
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  How was your experience in <strong className="text-stone-700">{booking.destination || booking.destName}</strong>?
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-stone-400 hover:text-ink p-1.5 rounded-full hover:bg-sand/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Your Overall Rating <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-stone-300 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          active
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-semibold text-stone-600 ml-2">
                  {rating === 5 && 'Outstanding & Peaceful (5/5)'}
                  {rating === 4 && 'Very Comfortable (4/5)'}
                  {rating === 3 && 'Good Experience (3/5)'}
                  {rating === 2 && 'Needs Improvement (2/5)'}
                  {rating === 1 && 'Unsatisfactory (1/5)'}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Review Headline <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unforgettable tea estate morning, exceptional chauffeur service"
                maxLength={90}
                className="w-full text-xs p-3 rounded-xl border border-sand-dark/40 focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine bg-cream/20"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Your Experience & Insights <span className="text-rose-600">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell other Yatris about the stay, food quality, pace of travel, or secret viewpoint recommendations…"
                rows={4}
                maxLength={600}
                className="w-full text-xs p-3 rounded-xl border border-sand-dark/40 focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine bg-cream/20 resize-none"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>Minimum 15 characters</span>
                <span>{comment.length} / 600</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-sand/60 hover:bg-sand text-ink transition-colors border border-sand-dark/30 text-center"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-pine hover:bg-pinedark text-white transition-colors shadow-sm disabled:opacity-50 text-center flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Publishing…</span>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
