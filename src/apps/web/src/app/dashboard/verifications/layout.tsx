import { Metadata } from 'next';
import { RequireRole } from '@/components/auth/RequireRole';
import { UserRole } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Dashboard / Verifications',
};

export default function VerificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      {children}
    </RequireRole>
  );
}
