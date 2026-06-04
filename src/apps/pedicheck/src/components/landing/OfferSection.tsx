'use client';

import { useEffect, useRef } from 'react';
import { CheckIcon } from './icons';
import { useWaitlistCounter } from '@/lib/useWaitlistCounter';

const BENEFITS = [
  {
    title: '60 days of free access after launch',
    body: 'No card required. Use the full product before you pay a cent.',
  },
  {
    title: 'R99 per month for life',
    body: 'Founding rate, locked in. Everyone else pays R149/month at launch.',
  },
  {
    title: 'Early access, one week before public launch',
    body: 'Your account is active before anyone else’s.',
  },
  {
    title: 'A say in what we build next',
    body: 'Founding members get the first vote on every new feature.',
  },
];

export function OfferSection() {
  const { count, percent } = useWaitlistCounter();
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.width = '0%';
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.width = `${percent}%`;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <section className="offer bg-warm">
      <div className="wrap">
        <div className="offer-grid">
          <div>
            <div className="eyebrow">The offer</div>
            <h2 className="display" style={{ marginTop: 18 }}>
              Be one of the <em>first 200 families.</em>
            </h2>
            <p className="sub">
              We&apos;re launching PediCheck in September 2026. The first 200
              families to join the waitlist become our{' '}
              <strong>Founding 200</strong> and get these benefits, for life.
            </p>
            <ul className="benefits">
              {BENEFITS.map((b) => (
                <li key={b.title} className="benefit">
                  <span className="check">
                    <CheckIcon />
                  </span>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="counter-card">
            <div className="counter-label">Founding Families</div>
            <div className="counter-num">
              <span>{count}</span>
              <span className="of">/200</span>
            </div>
            <div className="progress">
              <span ref={progressRef} />
            </div>
            <p className="counter-caption">
              After 200 spots fill, the waitlist stays open at standard launch
              pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
