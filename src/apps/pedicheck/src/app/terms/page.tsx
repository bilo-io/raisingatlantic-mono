import type { Metadata } from 'next';
import { Nav } from '@/components/landing/Nav';
import { FooterSection } from '@/components/landing/FooterSection';

export const metadata: Metadata = {
  title: 'Terms — PediCheck',
  description:
    'The terms covering use of the PediCheck website and waitlist before launch.',
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <section className="form-section">
        <div className="wrap">
          <div className="form-head">
            <div className="eyebrow center">Terms of use</div>
            <h2 className="display" style={{ marginTop: 18 }}>
              The short version, <em>for now.</em>
            </h2>
            <p className="sub" style={{ margin: '20px auto 0' }}>
              Full terms covering the launched product are being drafted. This
              placeholder covers the pre-launch website and waitlist.
            </p>
          </div>

          <div className="form-card">
            <p className="form-meta" style={{ marginTop: 0 }}>
              <strong>Last updated:</strong> placeholder — full terms in
              progress.
            </p>
            <p className="consent" style={{ marginTop: 20 }}>
              This website is operated by Atlantic Children&apos;s Practice
              from Cape Town, South Africa. PediCheck is not yet a medical
              service — it is information about an upcoming one. Joining the
              waitlist does not establish a doctor-patient relationship and
              does not create any clinical obligation on us or on you.
            </p>
            <p className="consent">
              PediCheck (when launched) is designed to help you think through
              what&apos;s happening. It is not a diagnosis and it does not
              replace seeing a doctor. If you are worried about your child,
              trust that — call your paediatrician or go to your nearest
              emergency room.
            </p>
            <p className="consent">
              Full terms will cover acceptable use, liability, governing law
              (South Africa), and dispute resolution. Until then, if anything
              here is unclear, email <strong>hello@pedicheck.co.za</strong>.
            </p>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
