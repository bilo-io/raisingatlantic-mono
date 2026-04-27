import { Metadata } from 'next';
import { RequireRole } from '@/components/auth/RequireRole';
import { UserRole } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Dashboard / Tenants',
};

export default function TenantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={[UserRole.SUPER_ADMIN]}>
      {children}
    </RequireRole>
  );
}
