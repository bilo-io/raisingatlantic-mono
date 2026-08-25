// Canonical origin + org identity for SEO (sitemap, robots, OG, JSON-LD).
// Single source of truth so absolute URLs stay consistent across the app.
// Override the origin per environment via NEXT_PUBLIC_SITE_URL; trailing slash
// is stripped so `${siteUrl}/path` never doubles up.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raisingatlantic.com'
).replace(/\/$/, '');

export const siteConfig = {
  name: 'Raising Atlantic',
  shortName: 'RaisingAtlantic',
  description:
    'Empowering parents and clinicians with a secure, collaborative SaaS application to seamlessly track early childhood development, growth velocity, and EPI vaccination schedules.',
  url: siteUrl,
  ogImage: '/assets/images/Branding/ra-opengraph.png',
  logo: '/android-chrome-512x512.png',
  sameAs: [] as string[],
} as const;
