import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard / Tenants',
};

export default function TenantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
