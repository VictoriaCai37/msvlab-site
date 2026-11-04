import { defineCollection, z } from 'astro:content';
const reviews = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(120),
    excerpt: z.string().max(200),
    heroImage: z.string(),
    heroAlt: z.string(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).min(3),
    category: z.enum(['smart-home', 'computing', 'audio']),
    tags: z.array(z.string()).default([]),
    publishDate: z.string(),
    updateDate: z.string().optional(),
    readTime: z.string(),
    rating: z.number().min(1).max(5),
    pros: z.array(z.string()).min(3),
    cons: z.array(z.string()).min(2),
    whoShouldBuy: z.array(z.string()).min(3),
    verdict: z.string(),
    specs: z.record(z.string()).optional(),
    price: z.number().optional(),
    affiliateUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const bestProducts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(120),
    excerpt: z.string().max(200),
    heroImage: z.string(),
    heroAlt: z.string(),
    category: z.enum(['smart-home', 'computing', 'audio']),
    publishDate: z.string(),
    updateDate: z.string().optional(),
    products: z.array(z.object({
      rank: z.number(),
      name: z.string(),
      image: z.string(),
      rating: z.number().min(1).max(5),
      pros: z.string(),
      cons: z.string(),
      bestFor: z.string(),
      price: z.number(),
      affiliateUrl: z.string().url(),
    })).min(3),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const deals = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(120),
    excerpt: z.string().max(200),
    heroImage: z.string(),
    heroAlt: z.string(),
    productName: z.string(),
    originalPrice: z.number(),
    salePrice: z.number(),
    discountPercent: z.number(),
    category: z.enum(['smart-home', 'computing', 'audio']),
    merchant: z.string(),
    affiliateUrl: z.string().url(),
    expiresAt: z.string().optional(),
    publishDate: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { reviews, bestProducts, deals };
