import type { Metadata } from 'next';

// Internal design-system reference — keep it out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DesignSystemRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
