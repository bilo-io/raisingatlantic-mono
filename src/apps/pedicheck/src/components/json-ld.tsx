import { siteUrl } from '@/lib/site';

// Static, app-controlled schema.org graph (no user input) — the standard
// Next.js JSON-LD pattern; safe to inline via dangerouslySetInnerHTML.
export function JsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'PediCheck',
        url: siteUrl,
        logo: `${siteUrl}/brand/icon-180.png`,
        parentOrganization: {
          '@type': 'Organization',
          name: 'Atlantic Children’s Practice',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'PediCheck',
        url: siteUrl,
        description:
          'A calm second opinion for the 2am worries. Built by paediatricians.',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'en-ZA',
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
