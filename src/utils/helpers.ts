import { format } from 'date-fns';

export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  return format(new Date(date), pattern);
}

export function readingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '…';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Normalize image paths to ensure they have proper leading slashes.
 * - Returns empty string if path is empty/falsy
 * - Returns as-is if it's a full HTTP/HTTPS URL
 * - If path starts with '/', returns as-is
 * - If path contains '/images/uploads/' but lacks leading '/', adds it
 * - Otherwise prepends '/images/uploads/' to the path
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';

  const trimmed = path.trim();
  if (!trimmed) return '';

  // Already a full URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // Already has leading slash
  if (trimmed.startsWith('/')) return trimmed;

  // Contains /images/uploads/ but missing leading slash
  if (trimmed.includes('/images/uploads/')) {
    return '/' + trimmed;
  }

  // Default: prepend /images/uploads/
  return `/images/uploads/${trimmed}`;
}
