import type { Metadata } from 'next';
import { Nav } from '@/components/landing/Nav';
import { FooterSection } from '@/components/landing/FooterSection';

export const metadata: Metadata = {
  title: 'Privacy — PediCheck',
  description:
    'How PediCheck handles your personal information under South Africa’s POPIA.',
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <section className="form-section">
        <div className="wrap">
          <div className="form-head">
            <div className="eyebrow center">Privacy notice</div>
            <h2 className="display" style={{ marginTop: 18 }}>
              How we handle <em>your information.</em>
            </h2>
            <p className="sub" style={{ margin: '20px auto 0' }}>
              The full notice is being drafted with our legal advisors. The
              short version below tells you everything important until the long
              version lands.
            </p>
          </div>

          <div className="form-card">
            <p className="form-meta" style={{ marginTop: 0 }}>
              <strong>Last updated:</strong> placeholder — full POPIA-compliant
              notice in progress.
            </p>
            <p className="consent" style={{ marginTop: 20 }}>
              PediCheck is built by Atlantic Children&apos;s Practice in Cape
              Town. We collect only the personal information we genuinely need:
              when you join the waitlist, your email address, WhatsApp number,
              and your child&apos;s age range; when you contact us or submit a
              feature request, your email address and your message. We never
              sell your information and never share it with third parties for
              marketing.
            </p>
            <p className="consent">
              <strong>Where this information is stored.</strong> We currently
              record waitlist sign-ups, contact messages, and feature requests
              in Google Workspace (Google Sheets). Google may process this data
              on servers <em>outside South Africa</em>. This is a cross-border
              transfer of personal information under{' '}
              <strong>POPIA Section 72</strong>, and we only store your email or
              other personal details with your explicit consent at the point of
              submission.
            </p>
            <p className="consent">
              You can ask us to show you what we have on you, correct it, or
              delete it at any time. Email{' '}
              <strong>hello@pedicheck.co.za</strong> and we&apos;ll act within
              the timeframes POPIA requires.
            </p>
            <p className="consent">
              When the full privacy notice is ready it will replace this page
              and cover lawful basis, the Section 72 safeguards in detail,
              retention periods, and your rights in full.
            </p>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
