'use client';

import { PhoneMockup } from './PhoneMockup';
import { useWaitlistCounter } from '@/lib/useWaitlistCounter';

export function HeroSection() {
  const { count } = useWaitlistCounter();

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow fade-up d1">
              Launching September 2026 · Cape Town
            </div>
            <h1 className="display h-display fade-up d2" style={{ marginTop: 24 }}>
              It&apos;s 2am. Something feels wrong.{' '}
              <em>You don&apos;t know if it&apos;s serious.</em>
            </h1>
            <p className="sub fade-up d3">
              PediCheck helps you think it through. Calmly, in under two minutes.
              Built by Cape Town paediatricians.
            </p>
            <div className="fade-up d4">
              <a href="#waitlist" className="btn primary">
                Join the Founding 200{' '}
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="hero-meta fade-up d5">
              <span className="count">{count}</span> of 200 founding families ·
              Free for the first 60 days
            </p>
          </div>
          <div className="hero-right fade-up d3">
            <div className="hero-image-wrap">
              <div className="hero-phone">
                <PhoneMockup time="02:14" step="Q4 / 6">
                  <div className="q-label">Tick what you see</div>
                  <h3 className="q-text">Anything happening right now?</h3>
                  <div className="opt">
                    <span className="circle" />
                    Difficulty breathing
                  </div>
                  <div className="opt selected">
                    <span className="circle" />
                    Drowsy or hard to wake
                  </div>
                  <div className="opt">
                    <span className="circle" />
                    Stiff neck or arching
                  </div>
                  <div className="phone-progress">
                    <span style={{ width: '65%' }} />
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
