import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard / Patients',
};

export default function PatientsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
