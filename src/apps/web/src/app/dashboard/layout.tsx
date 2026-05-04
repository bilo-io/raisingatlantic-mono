
import { PrivateLayout } from '@/components/layout/PrivateLayout';
import { RequireRole } from '@/components/auth/RequireRole';
import type React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole>
      <PrivateLayout>{children}</PrivateLayout>
    </RequireRole>
  );
}
