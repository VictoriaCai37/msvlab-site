export const categories = [
  {
    slug: 'smart-home',
    name: 'Smart Home',
    description: 'Robot vacuums, smart locks, lighting, thermostats, and home automation devices.',
    icon: 'home',
    color: 'blue',
    count: 7,
  },
  {
    slug: 'computing',
    name: 'Computing',
    description: 'Laptops, monitors, keyboards, mice, storage, and accessories for work and play.',
    icon: 'laptop',
    color: 'indigo',
    count: 7,
  },
  {
    slug: 'audio',
    name: 'Audio',
    description: 'Headphones, earbuds, speakers, and audio gear for every listening scenario.',
    icon: 'music',
    color: 'cyan',
    count: 6,
  },
] as const;

export type CategorySlug = typeof categories[number]['slug'];

export function getCategory(slug: string) {
  return categories.find(c => c.slug === slug);
}

export function getCategoryColor(slug: string) {
  const cat = getCategory(slug);
  if (!cat) return 'gray';
  const colors: Record<string, string> = {
    blue: 'badge-smart-home',
    indigo: 'badge-computing',
    cyan: 'badge-audio',
    amber: 'badge-deals',
  };
  return colors[cat.color] || 'bg-brand-50 text-brand-700 border border-brand-100';
}
