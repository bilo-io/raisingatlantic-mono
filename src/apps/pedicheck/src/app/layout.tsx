import type { Metadata } from 'next';
import { Fraunces, DM_Sans, Nunito } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const SITE_URL = 'https://pedicheck.co.za';
const OG_TITLE = "PediCheck: When you don't know if it's serious";
const OG_DESCRIPTION =
  'Paediatrician-built guidance for every fever, bump and 2am worry. Calm, clear answers in under two minutes. Launching soon — join the waitlist.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: OG_TITLE,
  description: OG_DESCRIPTION,
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
        url: '/brand/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PediCheck — calm, paediatrician-built guidance for 2am worries.',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ['/brand/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${nunito.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
