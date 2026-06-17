import type { Metadata } from 'next';
import { Nav } from '@/components/landing/Nav';
import { FooterSection } from '@/components/landing/FooterSection';
import { FeatureRequestsSection } from '@/components/landing/FeatureRequestsSection';

export const metadata: Metadata = {
  title: 'Feature requests — PediCheck',
  description:
    'Suggest a feature for PediCheck and vote on what matters most. Built with parents, for parents.',
};

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <FeatureRequestsSection />
      <FooterSection />
    </>
  );
}
