import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RaisingAtlantic | Professional Directory',
  description: 'Connect with trusted healthcare providers and medical facilities across the RaisingAtlantic network. Browse our directory of clinicians and practices.',
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
