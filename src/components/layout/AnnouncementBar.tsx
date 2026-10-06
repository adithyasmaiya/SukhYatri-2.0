import React from 'react';
import { useToast } from '../../context/ToastContext';

export const AnnouncementBar: React.FC = () => {
  const { toast } = useToast();

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('SUKH15');
    toast('Code <b>SUKH15</b> copied! Apply at checkout for flat 15% off.', 'success');
  };

  return (
    <div className="bg-pinedark text-white text-center text-[12.5px] py-2 px-4 font-medium tracking-wide relative z-50">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="w-1.5 h-1.5 rounded-full bg-sand inline-block animate-pulse" />
        <span>Festive Season Special — Flat 15% off curated journeys with code</span>
        <button
          onClick={handleCopyCode}
          className="font-extrabold text-sand underline underline-offset-2 hover:text-[#D8BE8A] transition cursor-pointer"
        >
          SUKH15
        </button>
        <span className="hidden sm:inline opacity-60">·</span>
        <span className="hidden sm:inline text-white/80">
          Complimentary airport lounge on all premium packages
        </span>
      </div>
    </div>
  );
};
