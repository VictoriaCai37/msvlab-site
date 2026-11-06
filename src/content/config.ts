import { defineCollection, z } from 'astro:content';

const reviews = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(120),
    excerpt: z.string().max(200),
    heroImage: z.string(),
    heroAlt: z.string(),
    // Decap CMS stores images as list of objects: [{src, alt, caption?}]
    // Existing content may not have this field
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).optional(),
    category: z.enum(['smart-home', 'computing', 'audio']),
    tags: z.array(z.string()).default([]),
    // Decap CMS datetime widget may pass string (YYYY-MM-DD) or Date object
    publishDate: z.union([z.string(), z.date()]),
    updateDate: z.union([z.string(), z.date()]).optional(),
    readTime: z.string(),
    rating: z.number().min(1).max(5),
    // Support both formats:
    // - Old content: array of strings: ["pro 1", "pro 2"]
    // - New CMS content: array of objects: [{pro: "..."}, {con: "..."}, {reason: "..."}]
    pros: z.union([
      z.array(z.string()),
      z.array(z.object({ pro: z.string() }))
    ]).optional(),
    cons: z.union([
      z.array(z.string()),
      z.array(z.object({ con: z.string() }))
    ]).optional(),
    whoShouldBuy: z.union([
      z.array(z.string()),
      z.array(z.object({ reason: z.string() }))
    ]).optional(),
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
    publishDate: z.union([z.string(), z.date()]),
    updateDate: z.union([z.string(), z.date()]).optional(),
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
      reviewSlug: z.string().optional(),
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
    expiresAt: z.union([z.string(), z.date()]).optional(),
    publishDate: z.union([z.string(), z.date()]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { reviews, bestProducts, deals };
