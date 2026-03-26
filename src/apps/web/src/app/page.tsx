import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { LeadCaptureSection } from '@/components/landing/LeadCaptureSection';

export const dynamic = 'force-static';

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <FaqSection />
      <TestimonialsSection />
      <LeadCaptureSection />
    </PublicLayout>
  );
}
