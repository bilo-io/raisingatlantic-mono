
import type React from 'react';
import { LandingHeader } from './LandingHeader';
import { LandingFooter } from './LandingFooter';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
