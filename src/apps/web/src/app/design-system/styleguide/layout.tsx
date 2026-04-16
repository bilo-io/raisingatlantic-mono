import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design / Styleguide',
};

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
