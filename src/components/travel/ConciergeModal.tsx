import React, { useState } from 'react';
import { Send, PhoneCall, MessageCircle, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../context/ToastContext';

export interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationHint?: string;
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({
  isOpen,
  onClose,
  destinationHint = '',
}) => {
  const { toast } = useToast();
  const [query, setQuery] = useState(destinationHint ? `I want to plan a trip to ${destinationHint}` : '');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast('Please tell us what kind of trip you dream of', 'error');
      return;
    }
    toast(`Namaste! Travel designer Meera has received your request: <b>"${query}"</b>. She will reply within 2 hours.`, 'success');
    setQuery('');
    onClose();
  };

  const handleCallback = () => {
    toast('Callback booked! Our travel designer will call your registered number in 30 minutes.', 'success');
    onClose();
  };

  const handleWhatsApp = () => {
    toast('Redirecting to official SukhYatri WhatsApp concierge line (+91 98200 41926)…', 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div>
        {/* Designer Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-stonewarm">
          <div className="relative">
            <div className="w-13 h-13 w-12 h-12 rounded-full bg-pine text-white flex items-center justify-center font-display text-xl font-bold">
              M
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <span>Meera</span>
              <span className="text-xs font-semibold text-muted">· Senior Travel Designer</span>
            </div>
            <div className="text-xs text-moss font-semibold flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" /> Online now · Replies in ~15 mins
            </div>
          </div>
        </div>

        {/* Chat Bubble */}
        <div className="bg-cream2/80 rounded-2xl p-4 text-sm text-ink mt-5 leading-relaxed border border-stonewarm/60">
          <p className="font-bold text-pine mb-1">Namaste! 🙏</p>
          Tell me your dates, group size, or vibe (e.g. <i>"Kerala in Dec, slow pace, great food"</i> or <i>"Ladakh with parents"</i>). I’ll handcraft 2–3 personalized routes with verified stays and transparent pricing.
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="mt-5 space-y-3">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 5 days Kerala backwaters, anniversary, peaceful stays…"
              className="flex-1"
              autoFocus
            />
            <Button type="submit" variant="primary" className="!px-5 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-stonewarm">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCallback}
            leftIcon={<PhoneCall className="w-3.5 h-3.5 text-moss" />}
          >
            Request callback
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleWhatsApp}
            leftIcon={<MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />}
          >
            WhatsApp us
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-muted font-medium">
            Toll-free <b>1800-419-2026</b> · 9 AM to 9 PM IST · Govt approved operator
          </p>
        </div>
      </div>
    </Modal>
  );
};
