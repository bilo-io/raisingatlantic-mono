import type { Metadata } from 'next';
import { Nav } from '@/components/landing/Nav';
import { FooterSection } from '@/components/landing/FooterSection';
import { ContactSection } from '@/components/landing/ContactSection';

export const metadata: Metadata = {
  title: 'Contact — PediCheck',
  description:
    'Get in touch with PediCheck. We read everything and reply within two working days.',
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <ContactSection />
      <FooterSection />
    </>
  );
}
