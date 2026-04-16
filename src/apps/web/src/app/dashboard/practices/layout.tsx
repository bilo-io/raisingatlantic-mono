import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard / Practices',
};

export default function PracticesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
