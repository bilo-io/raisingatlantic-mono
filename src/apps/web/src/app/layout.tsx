
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
  title: 'Raising Atlantic',
  description: 'Supporting Child Development Together',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/manifest.json',
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
