import type { MetadataRoute } from 'next';

import { siteUrl } from '@/lib/site';

const ROUTES = ['', '/features', '/contact', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.map((path) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.6,
  }));
}
