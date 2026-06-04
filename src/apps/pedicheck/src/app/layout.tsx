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

export const metadata: Metadata = {
  title: "PediCheck — When you don't know if it's serious",
  description:
    'PediCheck helps you think through late-night worries about your child. Calmly, in under two minutes. Built by Cape Town paediatricians.',
  icons: {
    icon: '/brand/icon-32.png',
    apple: '/brand/icon-180.png',
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
