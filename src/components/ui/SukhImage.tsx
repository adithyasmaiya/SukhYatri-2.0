import React, { useState } from 'react';
import { mediaService, MediaType } from '../../services/mediaService';
import { Image as ImageIcon } from 'lucide-react';

export interface SukhImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  type?: MediaType;
  priority?: boolean; // Set true for hero images to optimize LCP
  aspectRatio?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export const SukhImage: React.FC<SukhImageProps> = ({
  src,
  alt,
  type = 'card',
  priority = false,
  aspectRatio,
  className = '',
  containerClassName = '',
  fallbackSrc,
  width,
  height,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fallback = fallbackSrc || mediaService.getFallback(type);
  const rawSrc = hasError || !src ? fallback : src;
  const optimizedSrc = mediaService.getOptimizedUrl(
    rawSrc,
    typeof width === 'number' ? width : 1200
  );

  return (
    <div
      className={`relative overflow-hidden bg-sand-light/60 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-sand/30 via-sand-light/50 to-sand/30 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-stone-300 opacity-40" />
        </div>
      )}

      {/* Actual Image */}
      <img
        src={optimizedSrc}
        alt={alt || 'SukhYatri travel experience'}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-ignore - fetchPriority is supported in modern browsers
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />

      {/* Fallback Badge indicator if image had to fallback (subtle, non-intrusive) */}
      {hasError && (
        <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white/70">
          Curated Photo
        </div>
      )}
    </div>
  );
};
