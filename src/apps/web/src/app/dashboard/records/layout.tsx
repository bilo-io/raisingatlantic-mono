import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard / Records',
};

export default function RecordsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
