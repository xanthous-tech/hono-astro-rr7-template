import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
// import { docsLoader } from '@astrojs/starlight/loaders';

import { docsLoader } from '@site/utils/docs-loader';

const postCollection = (name: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.md', base: `./content/${name}` }),
    // Type-check frontmatter using a schema
    schema: z.object({
      title: z.string(),
      description: z.string(),
      slug: z.string().optional(),
      // Transform string to Date object
      date: z.coerce.date(),
      image: z.string().optional(),
    }),
  });

export const collections = {
  'blog-en': postCollection('blog-en'),
  'blog-zh': postCollection('blog-zh'),
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  nav: defineCollection({
    loader: file('./site/config/nav.json'),
    schema: z.object({
      items: z.array(
        z.object({ key: z.string(), title: z.string(), url: z.string() }),
      ),
    }),
  }),
  heroFeatures: defineCollection({
    loader: file('./site/config/hero-features.json'),
    schema: z.object({
      features: z.array(
        z.object({
          icon: z.string(),
          title: z.string(),
        }),
      ),
    }),
  }),
  features: defineCollection({
    loader: file('./site/config/features.json'),
    schema: z.object({
      features: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      ),
    }),
  }),
  pricing: defineCollection({
    loader: file('./site/config/pricing.json'),
    schema: z.object({
      yearlyPlans: z.array(
        z.object({
          name: z.string(),
          originalPerMonth: z.string().optional(),
          perMonth: z.string(),
          perMonthLabel: z.string().optional(),
          billed: z.string().optional(),
          saved: z.string().optional(),
          cta: z.string(),
          ctaVariant: z.string().optional(),
          url: z.string(),
          features: z.array(z.string()),
        }),
      ),
      monthlyPlans: z.array(
        z.object({
          name: z.string(),
          originalPerMonth: z.string().optional(),
          perMonth: z.string(),
          perMonthLabel: z.string().optional(),
          billed: z.string().optional(),
          saved: z.string().optional(),
          cta: z.string(),
          ctaVariant: z.string().optional(),
          url: z.string(),
          features: z.array(z.string()),
        }),
      ),
    }),
  }),
  testimonials: defineCollection({
    loader: file('./site/config/testimonials.json'),
    schema: z.object({
      testimonial: z.string(),
    }),
  }),
  faq: defineCollection({
    loader: file('./site/config/faq.json'),
    schema: z.object({
      faqs: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      ),
    }),
  }),
};
