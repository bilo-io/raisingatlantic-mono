import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard / My Children',
};

export default function ChildrenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
