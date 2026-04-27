'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/I18nProvider';
import { ToastProvider } from '@/contexts/ToastContext';
import { QueryProvider } from '@/lib/api/QueryProvider';
import type { ReactNode } from 'react';

/**
 * Root client-side provider tree. Order matters:
 *  - I18n outermost (so theme/toast messages can be translated)
 *  - Theme next (controls dark/light)
 *  - Query next (data layer)
 *  - Toast innermost (so callers inside React Query mutations can fire toasts)
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
