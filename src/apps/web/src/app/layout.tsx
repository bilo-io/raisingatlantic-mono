
import type { Metadata } from 'next';

// Server-side polyfill for localStorage to prevent crashes in libraries that expect it
if (typeof window === 'undefined') {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
}

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/I18nProvider'; // Import the I18nProvider
import { ToastProvider } from '@/contexts/ToastContext';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
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
                  <stop offset="0%" stopColor="#605BFF" />
                  <stop offset="100%" stopColor="#FF00AA" />
                </linearGradient>
                <linearGradient id="primary-gradient-svg-dark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#807DFF" />
                  <stop offset="100%" stopColor="#FF4DBC" />
                </linearGradient>
              </defs>
            </svg>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
