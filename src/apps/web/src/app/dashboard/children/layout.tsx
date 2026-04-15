import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Children',
};

export default function ChildrenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
