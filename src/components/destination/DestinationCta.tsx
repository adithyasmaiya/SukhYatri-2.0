import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export interface DestinationCtaProps {
  destinationName: string;
  onOpenConcierge?: () => void;
}

export const DestinationCta: React.FC<DestinationCtaProps> = ({
  destinationName,
  onOpenConcierge,
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative rounded-[32px] overflow-hidden bg-pinedark text-white p-8 sm:p-12 lg:p-16 shadow-lift text-center">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-moss/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-bold text-sand uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-sand" /> Your Next Yatra
        </div>

        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
          Ready to explore {destinationName}?
        </h3>

        <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          Handpicked boutique stays, private vehicles with rested drivers, and 24×7 concierge care.
          Step into a journey crafted around your pace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Button
            variant="gold"
            size="lg"
            onClick={() => navigate(`/explore?destination=${encodeURIComponent(destinationName)}`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto px-8 py-4 font-extrabold text-sm !rounded-2xl"
          >
            Explore {destinationName} Trips
          </Button>

          {onOpenConcierge && (
            <Button
              variant="ghostlight"
              size="lg"
              onClick={onOpenConcierge}
              leftIcon={<MessageSquare className="w-4 h-4" />}
              className="w-full sm:w-auto px-7 py-4 font-bold text-sm !rounded-2xl border border-white/20 hover:bg-white/10"
            >
              Talk to Specialist
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
