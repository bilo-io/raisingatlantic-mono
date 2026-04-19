
import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/I18nProvider';
import { ToastProvider } from '@/contexts/ToastContext';

// next/font must be called at module scope (not inside a function)
const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Raising Atlantic | The Digital Road to Health Platform',
    template: 'RaisingAtlantic | %s',
  },
  description: 'Empowering parents and clinicians with a secure, collaborative SaaS application to seamlessly track early childhood development, growth velocity, and EPI vaccination schedules.',
  openGraph: {
    title: 'Raising Atlantic | The Digital Road to Health Platform',
    description: 'Empowering parents and clinicians with a secure, collaborative SaaS application to seamlessly track early childhood development, growth velocity, and EPI vaccination schedules.',
    url: 'https://raisingatlantic.com',
    siteName: 'Raising Atlantic',
    images: [
      {
        url: '/assets/images/Branding/ra-opengraph.png',
        width: 1200,
        height: 630,
        alt: 'Raising Atlantic - Your Local Connection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raising Atlantic | The Digital Road to Health Platform',
    description: 'Empowering parents and clinicians with a secure, collaborative SaaS application to seamlessly track early childhood development, growth velocity, and EPI vaccination schedules.',
    images: ['/assets/images/Branding/ra-opengraph.png'],
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={ptSans.variable}>
      <head />
      <body suppressHydrationWarning className="font-body antialiased min-h-screen flex flex-col">
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              {children}
            </ToastProvider>
            {/* Global SVG Definitions */}
            <svg width="0" height="0" className="absolute pointer-events-none opacity-0" aria-hidden="true">
              <defs>
                <linearGradient id="primary-gradient-svg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D97757" />
                  <stop offset="100%" stopColor="#B85F41" />
                </linearGradient>
                <linearGradient id="primary-gradient-svg-dark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E2896D" />
                  <stop offset="100%" stopColor="#D97757" />
                </linearGradient>
              </defs>
            </svg>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
