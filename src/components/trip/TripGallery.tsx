import React, { useState } from 'react';
import { Camera, Eye } from 'lucide-react';
import { LightboxModal } from '../common/LightboxModal';

export interface TripGalleryProps {
  primaryImage: string;
  galleryImages: string[];
  title: string;
}

export const TripGallery: React.FC<TripGalleryProps> = ({
  primaryImage,
  galleryImages,
  title,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackImg =
    primaryImage ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop';
  const galleryList = Array.isArray(galleryImages) ? galleryImages : [];
  const allImages = [fallbackImg, ...galleryList.filter((img) => img && img !== fallbackImg)];

  const handleOpenPhoto = (idx: number) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section>
      {/* Desktop Grid Layout & Mobile Scrollable Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Large Primary Image (8 cols on desktop) */}
        <div
          onClick={() => handleOpenPhoto(0)}
          className="lg:col-span-8 rounded-[28px] overflow-hidden h-[300px] sm:h-[400px] lg:h-[480px] relative group cursor-pointer shadow-card bg-cream2"
        >
          <img
            src={allImages[0]}
            alt={`${title} main`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full">
              <Eye className="w-3.5 h-3.5 text-sand" /> Click to expand photo
            </span>
          </div>

          <div className="absolute bottom-4 left-4 lg:hidden">
            <span className="text-white text-xs font-bold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              1 / {allImages.length} photos
            </span>
          </div>
        </div>

        {/* Supporting Images (4 cols on desktop: 2 stacked images) */}
        <div className="lg:col-span-4 flex lg:flex-col gap-3.5 overflow-x-auto no-scrollbar sm:overflow-visible">
          {allImages.slice(1, 3).map((img, i) => {
            const isLast = i === 1;
            const remainingCount = allImages.length - 3;
            return (
              <div
                key={i}
                onClick={() => handleOpenPhoto(i + 1)}
                className="rounded-[22px] overflow-hidden h-[150px] sm:h-[190px] lg:h-[233px] relative group cursor-pointer shadow-sm bg-cream2 shrink-0 w-[220px] sm:w-[260px] lg:w-full"
              >
                <img
                  src={img}
                  alt={`${title} preview ${i + 2}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>

                {isLast && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-ink/65 flex flex-col items-center justify-center text-white p-2">
                    <Camera className="w-5 h-5 text-sand mb-1" />
                    <span className="text-xs sm:text-sm font-bold">+{remainingCount} more</span>
                    <span className="text-[11px] text-white/70">View gallery</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={allImages}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        title={title}
      />
    </section>
  );
};
