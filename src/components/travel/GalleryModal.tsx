import React from 'react';
import { Modal } from '../ui/Modal';

export interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  title,
  images,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${title} — Photos`} maxWidth="4xl">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-1">
        {images.map((img, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden h-56 bg-cream2 border border-stonewarm group relative"
          >
            <img
              src={img}
              alt={`${title} photo ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};
