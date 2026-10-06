import React, { useState } from 'react';
import { Camera, Eye } from 'lucide-react';
import { LightboxModal } from '../common/LightboxModal';

export interface DestinationGalleryProps {
  images: string[];
  destinationName: string;
}

export const DestinationGallery: React.FC<DestinationGalleryProps> = ({
  images,
  destinationName,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const featureImage = images[0];
  const supportingImages = images.slice(1, 5);

  const handleOpenPhoto = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-1">
            Visual Journal
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Glimpses of {destinationName}
          </h3>
        </div>

        <button
          onClick={() => handleOpenPhoto(0)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pine hover:text-moss border border-stonewarm hover:border-pine bg-white rounded-full px-4 py-2 transition shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-sand" />
          <span>View all {images.length} photos</span>
        </button>
      </div>

      {/* Editorial Grid: Large 7-col hero image + 5-col 2x2 supporting images on desktop; swipeable on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Large Feature Image */}
        <div
          onClick={() => handleOpenPhoto(0)}
          className="lg:col-span-7 rounded-3xl overflow-hidden h-[280px] sm:h-[380px] lg:h-[460px] relative group cursor-pointer shadow-card bg-cream2"
        >
          <img
            src={featureImage}
            alt={`${destinationName} cover`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Eye className="w-3.5 h-3.5 text-sand" /> Click to expand
            </span>
          </div>
        </div>

        {/* Supporting Images Grid / Mobile Horizontal Scroll */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 overflow-x-auto no-scrollbar sm:overflow-visible">
          {supportingImages.map((img, i) => (
            <div
              key={i}
              onClick={() => handleOpenPhoto(i + 1)}
              className="rounded-2xl overflow-hidden h-[135px] sm:h-[180px] lg:h-[220px] relative group cursor-pointer shadow-sm bg-cream2 shrink-0 min-w-[140px] sm:min-w-0"
            >
              <img
                src={img}
                alt={`${destinationName} photo ${i + 2}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        currentIndex={photoIndex}
        onIndexChange={setPhotoIndex}
        title={`${destinationName} Gallery`}
      />
    </section>
  );
};
