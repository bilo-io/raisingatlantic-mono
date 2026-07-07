// Canonical origin for SEO (sitemap, robots, OG, JSON-LD). Override per
// environment via NEXT_PUBLIC_SITE_URL; trailing slash stripped so
// `${siteUrl}/path` never doubles up.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pedicheck.co.za'
).replace(/\/$/, '');
