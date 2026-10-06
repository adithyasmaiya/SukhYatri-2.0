/**
 * Server-side Media & Image Validator
 * Protects database integrity against empty strings, malformed links, or injection vectors
 */

export function isValidImageUrl(url: any): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length < 8 || trimmed.length > 2048) return false;

  // Block dangerous schemes
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:') || lower.startsWith('data:text/html')) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeImageGallery(images: any[]): string[] {
  if (!Array.isArray(images)) return [];
  const validSet = new Set<string>();

  for (const item of images) {
    if (typeof item === 'string' && isValidImageUrl(item)) {
      validSet.add(item.trim());
    } else if (item && typeof item === 'object' && typeof item.url === 'string' && isValidImageUrl(item.url)) {
      validSet.add(item.url.trim());
    }
  }

  return Array.from(validSet);
}
