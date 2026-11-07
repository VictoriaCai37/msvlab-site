export const categories = [
  {
    slug: 'smart-living',
    name: 'Smart Living',
    description: 'Computers, smart home devices, digital peripherals, and tech for modern living.',
    icon: 'home',
    color: 'blue',
    count: 14,
  },
  {
    slug: 'home-bath',
    name: 'Home & Bath',
    description: 'Faucets, smart toilets, kitchen appliances, and bathroom fixtures for modern living.',
    icon: 'kitchen',
    color: 'amber',
    count: 0,
  },
  {
    slug: 'audio-entertainment',
    name: 'Audio & Entertainment',
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
    blue: 'badge-smart-living',
    amber: 'badge-home-bath',
    cyan: 'badge-audio-entertainment',
  };
  return colors[cat.color] || 'bg-brand-50 text-brand-700 border border-brand-100';
}
