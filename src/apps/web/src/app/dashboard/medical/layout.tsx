import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Records',
};

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
