import { Metadata } from 'next';
import { RequireRole } from '@/components/auth/RequireRole';
import { UserRole } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Dashboard / Medical Records',
};

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={[UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      {children}
    </RequireRole>
  );
}
