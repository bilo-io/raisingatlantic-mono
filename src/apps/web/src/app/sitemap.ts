import type { MetadataRoute } from 'next';

import { siteUrl } from '@/lib/seo/site';

// Revalidate hourly so newly published blog posts surface without a redeploy,
// and a transient API outage at build time can't hard-fail the route.
export const revalidate = 3600;

const STATIC_ROUTES = [
  '',
  '/about',
  '/pricing',
  '/contact',
  '/blog',
  '/directory',
  '/directory/clinicians',
  '/directory/practices',
];

const LEGAL_SLUGS = [
  'privacy-policy',
  'terms-of-service',
  'eula',
  'cookie-policy',
  'acceptable-use-policy',
  'disclaimer',
  'clinician-service-agreement',
  'master-services-agreement',
  'data-processing-agreement',
];

async function getBlogSlugs(): Promise<string[]> {
  const apiUrl =
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/v1/blog';

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts)) return [];
    return posts
      .map((post) => post?.slug)
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    ...STATIC_ROUTES.map((path) => ({
      url: `${siteUrl}${path || '/'}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
    ...LEGAL_SLUGS.map((slug) => ({
      url: `${siteUrl}/legal/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];

  for (const slug of await getBlogSlugs()) {
    entries.push({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    });
  }

  return entries;
}
