import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    "Learn about Raising Atlantic — our mission to give South African parents and clinicians a secure, shared view of every child's growth, milestones, and EPI vaccination schedule.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
