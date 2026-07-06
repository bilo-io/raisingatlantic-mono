import { siteConfig, siteUrl } from '@/lib/seo/site';

// Static, app-controlled schema.org graph (no user input) — the standard
// Next.js JSON-LD pattern; safe to inline via dangerouslySetInnerHTML.
export function JsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteUrl,
        logo: `${siteUrl}${siteConfig.logo}`,
        ...(siteConfig.sameAs.length > 0 ? { sameAs: siteConfig.sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
