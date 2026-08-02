import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import './globals.css';
import { PlausibleAnalytics } from '@/components/plausible-analytics';
import { JsonLd } from '@/components/json-ld';
import { siteUrl } from '@/lib/site';

// Applies fonts saved on /settings before first paint (no flash of default
// fonts). Static script authored here — no user-supplied content is injected;
// stored values are validated against a strict charset before being applied
// as CSS custom properties.
const FONT_SETTINGS_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem('pedicheck-font-settings')||'null');if(!s)return;var ok=/^[\\w\\s,'"()-]+$/;['headline','wordmark','body'].forEach(function(k){var v=s[k]&&s[k].stack;if(typeof v==='string'&&ok.test(v)){document.documentElement.style.setProperty('--'+k+'-font',v);}});}catch(e){}})();`;

const SITE_URL = siteUrl;

// Page-level SEO — browser tab + search snippet.
const PAGE_TITLE = "PediCheck — When you don't know if it's serious";
const PAGE_DESCRIPTION =
  'Paediatrician-built guidance for every fever, bump and 2am worry. Calm, clear answers in under two minutes. Launching soon — join the waitlist.';

// Social share card — OpenGraph + Twitter.
const OG_TITLE = "PediCheck: When you don't know if it's serious";
const OG_DESCRIPTION =
  'A calm second opinion for the 2am worries. Built by paediatricians.';
const OG_IMAGE = '/brand/og-image.png';
const OG_IMAGE_ALT =
  "PediCheck — when you don't know if it's serious. A calm, paediatrician-built second opinion for the 2am worries.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  applicationName: 'PediCheck',
  keywords: [
    'paediatrician',
    'child health',
    'symptom checker',
    'Cape Town',
    'South Africa',
    'after-hours',
    'late-night worry',
    'POPIA',
    'Atlantic Children’s Practice',
  ],
  authors: [{ name: 'Atlantic Children’s Practice', url: SITE_URL }],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: '/brand/icon-32.png',
    apple: '/brand/icon-180.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'PediCheck',
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_ZA',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FONT_SETTINGS_SCRIPT }} />
      </head>
      <body>
        <JsonLd />
        <PlausibleAnalytics />
        {children}
      </body>
    </html>
  );
}
