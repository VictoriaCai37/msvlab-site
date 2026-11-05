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
 * Robust image URL normalization - single source of truth for all image paths.
 * Handles all cases:
 * - Empty/undefined/null → returns empty string
 * - Full HTTP/HTTPS URLs → returns as-is
 * - Already normalized /images/uploads/xxx → returns as-is
 * - Old absolute paths like /images/reviews/xxx/hero.jpg → returns as-is (preserves uniqueness, ensures old images don't break)
 * - Relative paths like "12.jpeg" or "folder/12.jpg" (no leading slash) → prepends /images/uploads/
 * - Paths with /images/uploads/ but missing leading slash → adds leading slash
 * 
 * For old paths starting with /images/ (but not /images/uploads/):
 * - We return them as-is to preserve path uniqueness (multiple articles can have hero.jpg)
 * - This ensures old images don't break
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';

  const trimmed = path.trim();
  if (!trimmed) return '';

  // 1. Full URL - return as-is
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // 2. Already normalized to /images/uploads/ - return as-is
  if (trimmed.startsWith('/images/uploads/')) return trimmed;

  // 3. Old absolute paths under /images/ (including /images/reviews/, /images/best-products/, etc.)
  // Return as-is to preserve path uniqueness and ensure old images don't break
  // Multiple articles can have "hero.jpg" - keeping the full path avoids conflicts
  if (trimmed.startsWith('/images/')) return trimmed;

  // 4. Path contains /images/uploads/ but missing leading slash
  if (trimmed.includes('/images/uploads/')) {
    return '/' + trimmed;
  }

  // 5. Relative path (no leading slash) - prepend /images/uploads/
  // Handles: "12.jpeg", "folder/12.jpg", "uploads/12.jpg"
  return `/images/uploads/${trimmed}`;
}
