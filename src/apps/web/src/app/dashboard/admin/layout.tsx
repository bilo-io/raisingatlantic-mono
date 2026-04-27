import { Metadata } from 'next';
import { RequireRole } from '@/components/auth/RequireRole';
import { UserRole } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Dashboard / Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      {children}
    </RequireRole>
  );
}
