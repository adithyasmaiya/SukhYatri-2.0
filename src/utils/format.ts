/**
 * Format a number into Indian Rupee currency string (e.g., ₹48,500)
 */
export function formatINR(amount: number): string {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Calculate percentage discount between MRP and discounted price
 */
export function calculateDiscount(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Format date string to Indian English readable format
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Convert string to URL slug
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}
