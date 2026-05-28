import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    category: z.string(),
    order: z.number(),
    excerpt: z.string(),
    sourceUrl: z.string().url(),
  }),
});

export const collections = { articles };
