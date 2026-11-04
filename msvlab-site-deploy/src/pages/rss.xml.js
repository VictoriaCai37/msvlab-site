import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../data/site';

export async function GET(context) {
  const reviews = await getCollection('reviews', ({ data }) => !data.draft);
  const sortedReviews = reviews.sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site,
    items: sortedReviews.map((review) => ({
      title: review.data.title,
      link: `/reviews/${review.slug}/`,
      description: review.data.excerpt,
      pubDate: new Date(review.data.publishDate),
      categories: [review.data.category, ...review.data.tags],
    })),
    customData: `<language>en-us</language>`,
  });
}
