'use client';

import { useRef, useState, type FormEvent } from 'react';
import {
  ConfirmTick,
  WhatsAppIcon,
  EmailIcon,
  LinkIcon,
} from './icons';
import { submitLead } from '@/lib/leads';

const SHARE_MSG =
  "Just signed up for PediCheck, a paediatrician-built late-night app for when you don't know if it's serious. Join the waitlist for 60 days free at launch: pedicheck.co.za";
const SHARE_URL = 'pedicheck.co.za';

type FieldKey = 'email' | 'whatsapp' | 'age';

function validEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function WaitlistSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [invalid, setInvalid] = useState<Record<FieldKey, boolean>>({
    email: false,
    whatsapp: false,
    age: false,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copy link');
  const [toastShown, setToastShown] = useState(false);
  const [toastMsg, setToastMsg] = useState('Copied');
  const [submitting, setSubmitting] = useState(false);

  function clearInvalid(field: FieldKey) {
    setInvalid((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  }

  function flashToast(msg: string) {
    setToastMsg(msg);
    setToastShown(true);
    window.setTimeout(() => setToastShown(false), 2400);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const whatsapp = String(formData.get('whatsapp') ?? '').trim();
    const age = String(formData.get('age') ?? '').trim();

    const next = {
      email: !validEmail(email),
      whatsapp: whatsapp.length < 6,
      age: age === '',
    };
    setInvalid(next);
    if (next.email || next.whatsapp || next.age) return;

    setSubmitting(true);
    try {
      // The form copy states consent to the privacy notice + launch updates.
      await submitLead({
        email,
        phone: whatsapp,
        subject: 'Waitlist',
        message: `Waitlist signup — child age range: ${age}`,
        type: 'waitlist',
        consent: true,
      });
      setConfirmed(true);
      requestAnimationFrame(() => {
        cardRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    } catch {
      flashToast('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = SHARE_URL;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopyLabel('Copied');
    setToastMsg('Copied');
    setToastShown(true);
    window.setTimeout(() => {
      setCopyLabel('Copy link');
      setToastShown(false);
    }, 2000);
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(SHARE_MSG)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    'PediCheck: for the 2am worries',
  )}&body=${encodeURIComponent(SHARE_MSG)}`;

  return (
    <section className="form-section" id="waitlist">
      <div className="wrap">
        <div className="form-head">
          <div className="eyebrow center">Save your spot</div>
          <h2 className="display" style={{ marginTop: 18 }}>
            Join the <em>waitlist.</em>
          </h2>
          <p className="sub" style={{ margin: '20px auto 0' }}>
            Three quick questions. Thirty seconds. Then you&apos;re in.
          </p>
        </div>

        <div className="form-card" ref={cardRef}>
          {!confirmed ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className={`field${invalid.email ? ' invalid' : ''}`}>
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  onInput={() => clearInvalid('email')}
                />
                <div className="field-error">
                  Please enter a valid email address.
                </div>
              </div>
              <div className={`field${invalid.whatsapp ? ' invalid' : ''}`}>
                <label htmlFor="whatsapp">WhatsApp number</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="+27 82 123 4567"
                  autoComplete="tel"
                  onInput={() => clearInvalid('whatsapp')}
                />
                <div className="field-error">
                  We need a WhatsApp number to reach you.
                </div>
              </div>
              <div className={`field${invalid.age ? ' invalid' : ''}`}>
                <label htmlFor="age">Your child&apos;s age range</label>
                <select
                  id="age"
                  name="age"
                  defaultValue=""
                  onChange={() => clearInvalid('age')}
                >
                  <option value="">Choose one</option>
                  <option>Under 6 months</option>
                  <option>6 months to 2 years</option>
                  <option>2 to 5 years</option>
                  <option>5 to 12 years</option>
                  <option>I have multiple children</option>
                </select>
                <div className="field-error">
                  Pick the closest age range.
                </div>
              </div>
              <p className="consent">
                By saving your spot, you agree to our privacy notice and to
                receive launch updates via email and WhatsApp.
              </p>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Join the waitlist'}{' '}
                <span aria-hidden="true">→</span>
              </button>
              <p className="form-meta">
                You&apos;ll get our free{' '}
                <strong>SA Emergency Numbers card</strong> immediately. Every
                paediatric, poison, and after-hours number on one downloadable
                page. Then one short update a month until launch. Nothing else.
              </p>
            </form>
          ) : (
            <div className="confirm">
              <div className="confirm-circle">
                <ConfirmTick />
              </div>
              <h3 className="display">
                You&apos;re <em>in.</em>
              </h3>
              <p className="confirm-sub">
                Welcome to PediCheck. You&apos;re on the list.
              </p>
              <div className="steps">
                <div className="step">
                  <span className="n">01</span>
                  <span className="t">
                    <strong>Check your inbox.</strong> Your SA Emergency Numbers
                    card is on its way.
                  </span>
                </div>
                <div className="step">
                  <span className="n">02</span>
                  <span className="t">
                    <strong>One short update a month.</strong> Nothing else.
                  </span>
                </div>
                <div className="step">
                  <span className="n">03</span>
                  <span className="t">
                    <strong>Launching soon.</strong> You&apos;ll get access a
                    week before everyone else.
                  </span>
                </div>
              </div>
              <p className="share-prompt">
                Know another parent who&apos;d want this?
              </p>
              <div className="shares">
                <a
                  className="share-btn"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon /> WhatsApp
                </a>
                <a className="share-btn" href={mailHref}>
                  <EmailIcon /> Email
                </a>
                <button
                  className="share-btn"
                  type="button"
                  onClick={handleCopy}
                >
                  <LinkIcon />
                  <span>{copyLabel}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`toast${toastShown ? ' show' : ''}`}>{toastMsg}</div>
    </section>
  );
}
