import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard / Account Settings',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
