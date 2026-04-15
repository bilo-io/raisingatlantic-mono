import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Directory',
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
