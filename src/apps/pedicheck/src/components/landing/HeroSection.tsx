import { PhoneMockup } from './PhoneMockup';

export function HeroSection() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow fade-up d1">Launching soon</div>
            <h1 className="display h-display fade-up d2" style={{ marginTop: 24 }}>
              It&apos;s 2am. Something feels wrong.{' '}
              <em>You don&apos;t know if it&apos;s serious.</em>
            </h1>
            <p className="sub fade-up d3">
              PediCheck helps you think it through. Calmly, in under two minutes.
              Built by paediatricians.
            </p>
            <div className="fade-up d4">
              <a href="#waitlist" className="btn primary">
                Join the waitlist <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="hero-meta fade-up d5">
              Free for your first 60 days · Early access before launch
            </p>
          </div>
          <div className="hero-right fade-up d3">
            <div className="hero-image-wrap">
              <div className="hero-phone">
                <PhoneMockup time="02:14" step="Question 4 of 8">
                  <div className="q-label">Red flags check</div>
                  <h3 className="q-text">Tick anything you&apos;re seeing right now</h3>
                  <div className="opt">
                    <span className="circle" />
                    Difficulty or fast breathing
                  </div>
                  <div className="opt selected">
                    <span className="circle" />
                    Drowsy, floppy, hard to wake
                  </div>
                  <div className="opt">
                    <span className="circle" />
                    Stiff neck or arching back
                  </div>
                  <div className="phone-progress">
                    <span style={{ width: '50%' }} />
                  </div>
                </PhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
