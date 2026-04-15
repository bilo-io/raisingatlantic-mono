import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Practices',
};

export default function PracticesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
