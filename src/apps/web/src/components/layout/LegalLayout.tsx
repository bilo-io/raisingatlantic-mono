"use client";

import { PublicLayout } from '@/components/layout/PublicLayout';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useTranslation } from 'react-i18next';

const legalNavItems = [
  { slug: 'privacy-policy', titleKey: 'privacyPolicy' },
  { slug: 'terms-of-service', titleKey: 'termsOfService' },
  { slug: 'eula', titleKey: 'eula' },
  { slug: 'cookie-policy', titleKey: 'cookiePolicy' },
];

export function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="container mx-auto py-8 md:py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <nav className="sticky top-24 space-y-2">
              <h2 className="text-lg font-semibold mb-3 text-foreground tracking-tight">{t('legalDocuments')}</h2>
              {legalNavItems.map(item => (
                <Link
                  key={item.slug}
                  href={`/legal/${item.slug}`}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                    pathname === `/legal/${item.slug}` && "bg-muted text-primary font-semibold"
                  )}
                >
                  {t(item.titleKey)}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="w-full md:w-3/4 lg:w-4/5">
            {children}
          </main>
        </div>
      </div>
    </PublicLayout>
  );
}
