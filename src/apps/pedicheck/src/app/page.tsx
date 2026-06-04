import { Nav } from '@/components/landing/Nav';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { ScenariosSection } from '@/components/landing/ScenariosSection';
import { CredibilitySection } from '@/components/landing/CredibilitySection';
import { OfferSection } from '@/components/landing/OfferSection';
import { PlansSection } from '@/components/landing/PlansSection';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { FooterSection } from '@/components/landing/FooterSection';

export default function HomePage() {
  return (
    <>
      <Nav />
      <HeroSection />
      <ProblemSection />
      <ScenariosSection />
      <CredibilitySection />
      <OfferSection />
      <PlansSection />
      <WaitlistSection />
      <FooterSection />
    </>
  );
}
