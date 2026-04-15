import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verifications',
};

export default function VerificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
