import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  title?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  title,
}) => {
  const handlePrev = useCallback(() => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md animate-toast-in">
      {/* Top Header */}
      <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          {title && <h4 className="font-display font-semibold text-sm sm:text-base">{title}</h4>}
          <div className="text-xs text-white/70 font-mono mt-0.5">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative max-w-5xl max-h-[82vh] w-full px-4 sm:px-16 flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={title ? `${title} photo ${currentIndex + 1}` : `Photo ${currentIndex + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl select-none"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                idx === currentIndex ? 'border-sand scale-105' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
