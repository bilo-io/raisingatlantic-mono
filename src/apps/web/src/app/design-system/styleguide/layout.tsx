import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Styleguide | Design System',
};

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
