import { getCollection } from 'astro:content';
import { siteConfig } from '../data/site';

export async function GET({ site }) {
  const reviews = await getCollection('reviews', (entry) => !entry.data.draft);
  const bestProducts = await getCollection('best-products', (entry) => !entry.data.draft);
  const deals = await getCollection('deals', (entry) => !entry.data.draft);

  const staticPages = [
    '',
    '/reviews',
    '/best-products',
    '/deals',
    '/categories/smart-home',
    '/categories/computing',
    '/categories/audio',
    '/about',
    '/contact',
    '/privacy',
    '/affiliate-disclosure',
    '/terms',
  ];

  // site is a URL object, use href to get string, remove trailing slash
  const baseUrl = site.href.replace(/\/$/, '');
  
  const urls = [
    ...staticPages.map(path => `${baseUrl}${path}`),
    ...reviews.map(r => `${baseUrl}/reviews/${r.slug}/`),
    ...bestProducts.map(b => `${baseUrl}/best-products/${b.slug}/`),
    ...deals.map(d => `${baseUrl}/deals/${d.slug}/`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
