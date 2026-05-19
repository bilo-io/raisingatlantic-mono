import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard / Triage',
};

export default function TriageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
