
import { PrivateLayout } from '@/components/layout/PrivateLayout';
import type React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
