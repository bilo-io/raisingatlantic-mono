'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ConfirmTick } from './icons';
import { submitLead } from '@/lib/leads';

type FieldKey = 'email' | 'subject' | 'message';

const MESSAGE_LIMIT = 300;
const MESSAGE_MIN = 10;

const SUBJECTS = [
  'General question',
  'Waitlist',
  'Press & partnerships',
  'Clinician collaboration',
  'Privacy / data request (POPIA)',
  'Something else',
];

function validEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function ContactSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState<Record<FieldKey, boolean>>({
    email: false,
    subject: false,
    message: false,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function clearInvalid(field: FieldKey) {
    setInvalid((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const subject = String(formData.get('subject') ?? '').trim();
    const trimmedMessage = message.trim();

    const next = {
      email: !validEmail(email),
      subject: subject === '',
      message:
        trimmedMessage.length < MESSAGE_MIN ||
        trimmedMessage.length > MESSAGE_LIMIT,
    };
    setInvalid(next);
    if (next.email || next.subject || next.message) return;

    setSubmitting(true);
    try {
      // The form copy already states the email is used to reply → consent.
      await submitLead({
        email,
        subject,
        message: trimmedMessage,
        type: 'contact',
        consent: true,
      });
      setConfirmed(true);
      requestAnimationFrame(() => {
        cardRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    } catch {
      setToast('Something went wrong — please try again.');
      window.setTimeout(() => setToast(null), 2400);
    } finally {
      setSubmitting(false);
    }
  }

  const remaining = MESSAGE_LIMIT - message.length;
  const over = remaining < 0;

  return (
    <section className="form-section" id="contact">
      <div className="wrap">
        <div className="form-head">
          <div className="eyebrow center">Get in touch</div>
          <h2 className="display" style={{ marginTop: 18 }}>
            Say <em>hello.</em>
          </h2>
          <p className="sub" style={{ margin: '20px auto 0' }}>
            We read everything. We&apos;ll reply within two working days.
          </p>
        </div>

        <div className="form-card" ref={cardRef}>
          {!confirmed ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className={`field${invalid.email ? ' invalid' : ''}`}>
                <label htmlFor="email">Your email</label>
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

              <div className={`field${invalid.subject ? ' invalid' : ''}`}>
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  onChange={() => clearInvalid('subject')}
                >
                  <option value="">Choose one</option>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <div className="field-error">Pick a subject.</div>
              </div>

              <div className={`field${invalid.message ? ' invalid' : ''}`}>
                <label htmlFor="message">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us what's on your mind…"
                  value={message}
                  maxLength={MESSAGE_LIMIT}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearInvalid('message');
                  }}
                />
                <span
                  className={`field-counter${over ? ' over' : ''}`}
                  aria-live="polite"
                >
                  {message.length} / {MESSAGE_LIMIT}
                </span>
                <div className="field-error">
                  Please write a message between {MESSAGE_MIN} and{' '}
                  {MESSAGE_LIMIT} characters.
                </div>
              </div>

              <p className="consent">
                By sending, you agree we can store your email to reply. Nothing
                else, no list, no marketing.
              </p>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Send message'}{' '}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          ) : (
            <div className="confirm">
              <div className="confirm-circle">
                <ConfirmTick />
              </div>
              <h3 className="display">
                Thanks. <em>It&apos;s through.</em>
              </h3>
              <p className="confirm-sub">
                We&apos;ll be in touch within two working days.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </section>
  );
}
