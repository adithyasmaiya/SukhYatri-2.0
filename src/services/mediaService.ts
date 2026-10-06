// Media Management & Optimization Service for SukhYatri

export type MediaType = 'hero' | 'gallery' | 'card' | 'thumbnail' | 'avatar' | 'banner';

export interface MediaAsset {
  url: string;
  alt: string;
  type?: MediaType;
  width?: number;
  height?: number;
  caption?: string;
  isPrimary?: boolean;
}

// Reliable high-quality fallback assets
export const FALLBACK_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
  destination: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1200&auto=format&fit=crop',
  retreat: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
};

export const mediaService = {
  /**
   * Validates if a string is a well-formed image URL with safe protocols
   */
  validateImageUrl(url: string): { isValid: boolean; error?: string } {
    if (!url || typeof url !== 'string' || !url.trim()) {
      return { isValid: false, error: 'Image URL is required' };
    }

    const trimmed = url.trim();

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { isValid: false, error: 'URL must use http or https protocol' };
      }

      // Check if it's a known image CDN or has standard image extension
      const pathname = parsed.pathname.toLowerCase();
      const hasExt = /\.(jpg|jpeg|png|webp|avif|svg|gif)$/i.test(pathname);
      const isKnownCdn =
        parsed.hostname.includes('unsplash.com') ||
        parsed.hostname.includes('cloudinary.com') ||
        parsed.hostname.includes('images.pexels.com') ||
        parsed.hostname.includes('amazonaws.com') ||
        parsed.hostname.includes('googleusercontent.com');

      if (!hasExt && !isKnownCdn && !parsed.search.includes('format=')) {
        return {
          isValid: true, // Allow generic HTTPS endpoints with a soft warning
        };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Please enter a valid URL (e.g. https://...)' };
    }
  },

  /**
   * Automatically optimizes CDN images (Unsplash, Cloudinary, etc.) for performance
   */
  getOptimizedUrl(url: string, width: number = 800, quality: number = 80): string {
    if (!url || typeof url !== 'string') return FALLBACK_IMAGES.default;

    const trimmed = url.trim();

    // Optimize Unsplash images dynamically
    if (trimmed.includes('images.unsplash.com')) {
      try {
        const parsed = new URL(trimmed);
        parsed.searchParams.set('auto', 'format');
        parsed.searchParams.set('fit', 'crop');
        parsed.searchParams.set('w', String(width));
        parsed.searchParams.set('q', String(quality));
        return parsed.toString();
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  },

  /**
   * Generates a standardized MediaAsset from a string URL
   */
  createMediaAsset(url: string, altText: string, type: MediaType = 'gallery'): MediaAsset {
    return {
      url: url.trim(),
      alt: altText.trim() || 'SukhYatri Travel Experience',
      type,
    };
  },

  /**
   * Sanitizes and filters a list of image URLs, dropping empty or invalid links
   */
  cleanImageGallery(urls: string[]): string[] {
    if (!Array.isArray(urls)) return [];
    const seen = new Set<string>();
    const cleaned: string[] = [];

    for (const raw of urls) {
      if (!raw || typeof raw !== 'string') continue;
      const trimmed = raw.trim();
      if (!trimmed || seen.has(trimmed)) continue;

      const { isValid } = this.validateImageUrl(trimmed);
      if (isValid) {
        seen.add(trimmed);
        cleaned.push(trimmed);
      }
    }

    return cleaned;
  },

  /**
   * Provides appropriate fallback by type
   */
  getFallback(type: MediaType = 'card'): string {
    return FALLBACK_IMAGES[type as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default;
  },
};
