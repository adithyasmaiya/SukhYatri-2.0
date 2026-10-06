import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Star,
  Image as ImageIcon,
  AlertCircle,
  Check,
} from 'lucide-react';
import { mediaService } from '../../services/mediaService';
import { Button } from '../ui/Button';

export interface GalleryItem {
  url: string;
  alt: string;
}

export interface ImageGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  primaryImage?: string;
  onPrimaryChange?: (primaryUrl: string) => void;
  title?: string;
}

export const ImageGalleryManager: React.FC<ImageGalleryManagerProps> = ({
  images,
  onChange,
  primaryImage,
  onPrimaryChange,
  title = 'Image Gallery & Visual Media',
}) => {
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddImage = () => {
    if (!newUrl.trim()) {
      setValidationError('Please enter an image URL');
      return;
    }

    const { isValid, error } = mediaService.validateImageUrl(newUrl.trim());
    if (!isValid) {
      setValidationError(error || 'Invalid image URL');
      return;
    }

    const cleanedUrl = newUrl.trim();
    if (images.includes(cleanedUrl)) {
      setValidationError('This image is already in the gallery');
      return;
    }

    const updated = [...images, cleanedUrl];
    onChange(updated);

    // If no primary image set, make this primary
    if (!primaryImage && onPrimaryChange) {
      onPrimaryChange(cleanedUrl);
    }

    setNewUrl('');
    setNewAlt('');
    setValidationError(null);
  };

  const handleRemoveImage = (index: number) => {
    const targetUrl = images[index];
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);

    // If removed image was primary, set next available
    if (primaryImage === targetUrl && onPrimaryChange) {
      onPrimaryChange(updated[0] || '');
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onChange(copy);
  };

  const handleSetPrimary = (url: string) => {
    if (onPrimaryChange) {
      onPrimaryChange(url);
    } else {
      // Reorder to make it first
      const updated = [url, ...images.filter((u) => u !== url)];
      onChange(updated);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#DFE5E2] pb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-moss" />
          <h4 className="font-display text-sm font-bold text-ink">{title}</h4>
          <span className="text-[11px] font-medium bg-sand/60 px-2 py-0.5 rounded-full text-stone-600">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </span>
        </div>
      </div>

      {/* Add Image Box */}
      <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#E5EAE8] space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-ink block mb-1">
              Image URL (HTTPS link)
            </label>
            <input
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-[#DFE5E2] focus:border-moss/50 text-ink"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-ink block mb-1">
              Alt Text / Caption
            </label>
            <input
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="e.g. Scenic backwaters villa"
              className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-[#DFE5E2] focus:border-moss/50 text-ink"
            />
          </div>
        </div>

        {validationError && (
          <div className="flex items-center gap-1.5 text-[11px] text-clay font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddImage}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Gallery</span>
          </Button>
        </div>
      </div>

      {/* Gallery Items Grid */}
      {images.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-[#E5EAE8] rounded-2xl text-stone-400 text-xs">
          No images added yet. Add at least one image for visitors to preview this itinerary.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((imgUrl, idx) => {
            const isPrimary = primaryImage ? primaryImage === imgUrl : idx === 0;

            return (
              <div
                key={imgUrl + idx}
                className={`relative rounded-2xl overflow-hidden border transition-all p-2.5 bg-white space-y-2 group ${
                  isPrimary
                    ? 'border-moss shadow-sm ring-1 ring-moss/30'
                    : 'border-[#E5EAE8] hover:border-moss/40'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-sand-light/40">
                  <img
                    src={imgUrl}
                    alt={`Gallery preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback broken image placeholder
                      (e.target as HTMLImageElement).src = mediaService.getFallback('card');
                    }}
                  />

                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 bg-moss text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Primary Hero</span>
                    </div>
                  )}

                  {/* Order Tag */}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                </div>

                {/* URL preview (truncated) */}
                <div className="text-[10px] text-stone-500 font-mono truncate px-0.5" title={imgUrl}>
                  {imgUrl}
                </div>

                {/* Control Actions Toolbar */}
                <div className="flex items-center justify-between pt-1 border-t border-[#F2F4F3]">
                  {!isPrimary ? (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(imgUrl)}
                      className="text-[11px] font-bold text-moss hover:text-pinedark flex items-center gap-1 transition-colors"
                      title="Set as hero/cover photo"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set Primary</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-moss flex items-center gap-1">
                      <Check className="w-3 h-3" /> Cover
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-stone-400 hover:text-ink hover:bg-sand/40 disabled:opacity-30 transition-colors"
                      title="Move earlier"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded text-stone-400 hover:text-ink hover:bg-sand/40 disabled:opacity-30 transition-colors"
                      title="Move later"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 rounded text-clay hover:bg-clay/10 transition-colors ml-1"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
