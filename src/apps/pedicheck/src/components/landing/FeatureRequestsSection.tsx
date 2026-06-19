'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ConfirmTick, ChevronUpIcon, ChevronDownIcon } from './icons';
import {
  listFeatureRequests,
  submitFeatureRequest,
  voteFeatureRequest,
  readVotes,
  recordVote,
  type FeatureRequest,
  type VoteDirection,
} from '@/lib/featureRequests';
import { isValidEmail } from '@/lib/validation';

type FieldKey = 'title' | 'description' | 'email' | 'consent';

const TITLE_LIMIT = 80;
const DESCRIPTION_LIMIT = 200;
// A request must describe the idea in more than this many characters.
const DESCRIPTION_MIN = 10;

export function FeatureRequestsSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  // --- submit form state ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    title: false,
    description: false,
    email: false,
    consent: false,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // --- feed state ---
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [myVotes, setMyVotes] = useState<Record<string, VoteDirection>>({});

  useEffect(() => {
    setMyVotes(readVotes());
    void loadFeed();
  }, []);

  async function loadFeed() {
    setLoading(true);
    setLoadError(false);
    try {
      setFeatures(await listFeatureRequests());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }

  // Submission needs a valid email and a description of more than
  // DESCRIPTION_MIN characters; the title and consent checkbox stay required
  // (consent is the POPIA basis for storing the submitter's email).
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();
  const titleValid =
    trimmedTitle.length > 0 && trimmedTitle.length <= TITLE_LIMIT;
  const descriptionValid =
    trimmedDescription.length > DESCRIPTION_MIN &&
    trimmedDescription.length <= DESCRIPTION_LIMIT;
  const emailValid = isValidEmail(email);
  const formValid = titleValid && descriptionValid && emailValid && consent;

  function markTouched(field: FieldKey) {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formValid) {
      setTouched({
        title: true,
        description: true,
        email: true,
        consent: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitFeatureRequest({
        title: trimmedTitle,
        description: trimmedDescription,
        email: email.trim(),
        consent: true,
      });
      setConfirmed(true);
      requestAnimationFrame(() => {
        cardRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    } catch {
      showToast('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(feature: FeatureRequest, direction: VoteDirection) {
    if (myVotes[feature.id]) return; // already voted from this browser

    // Optimistic update.
    setMyVotes((prev) => ({ ...prev, [feature.id]: direction }));
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === feature.id
          ? {
              ...f,
              upvotes: f.upvotes + (direction === 'up' ? 1 : 0),
              downvotes: f.downvotes + (direction === 'down' ? 1 : 0),
            }
          : f,
      ),
    );
    recordVote(feature.id, direction);

    try {
      await voteFeatureRequest(feature.id, direction);
    } catch {
      // Roll back on failure.
      setMyVotes((prev) => {
        const copy = { ...prev };
        delete copy[feature.id];
        return copy;
      });
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === feature.id
            ? {
                ...f,
                upvotes: f.upvotes - (direction === 'up' ? 1 : 0),
                downvotes: f.downvotes - (direction === 'down' ? 1 : 0),
              }
            : f,
        ),
      );
      showToast('Could not record your vote — please try again.');
    }
  }

  const titleRemaining = TITLE_LIMIT - title.length;
  const descRemaining = DESCRIPTION_LIMIT - description.length;

  return (
    <section className="form-section" id="feature-requests">
      <div className="wrap">
        <div className="form-head">
          <div className="eyebrow center">Shape PediCheck</div>
          <h2 className="display" style={{ marginTop: 18 }}>
            Tell us what to <em>build.</em>
          </h2>
          <p className="sub" style={{ margin: '20px auto 0' }}>
            Suggest a feature, then vote on what matters most. We read every one.
          </p>
        </div>

        {/* ---- Submit form ---- */}
        <div className="form-card" ref={cardRef}>
          {!confirmed ? (
            <form onSubmit={handleSubmit} noValidate>
              <div
                className={`field${
                  touched.title && !titleValid ? ' invalid' : ''
                }`}
              >
                <label htmlFor="fr-title">Feature title</label>
                <input
                  type="text"
                  id="fr-title"
                  name="title"
                  placeholder="e.g. Add a medication reminder"
                  maxLength={TITLE_LIMIT}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => markTouched('title')}
                />
                <span
                  className={`field-counter${titleRemaining < 0 ? ' over' : ''}`}
                  aria-live="polite"
                >
                  {title.length} / {TITLE_LIMIT}
                </span>
                <div className="field-error">
                  Please add a short title (under {TITLE_LIMIT} characters).
                </div>
              </div>

              <div
                className={`field${
                  touched.description && !descriptionValid ? ' invalid' : ''
                }`}
              >
                <label htmlFor="fr-description">Description</label>
                <textarea
                  id="fr-description"
                  name="description"
                  placeholder="What should it do, and why would it help?"
                  maxLength={DESCRIPTION_LIMIT}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => markTouched('description')}
                />
                <span
                  className={`field-counter${descRemaining < 0 ? ' over' : ''}`}
                  aria-live="polite"
                >
                  {description.length} / {DESCRIPTION_LIMIT}
                </span>
                <div className="field-error">
                  Please describe it in more than {DESCRIPTION_MIN} characters
                  (and under {DESCRIPTION_LIMIT}).
                </div>
              </div>

              <div
                className={`field${
                  touched.email && !emailValid ? ' invalid' : ''
                }`}
              >
                <label htmlFor="fr-email">Email</label>
                <input
                  type="email"
                  id="fr-email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched('email')}
                />
                <div className="field-error">
                  Please enter a valid email address.
                </div>
              </div>

              <div
                className={`field${
                  touched.consent && !consent ? ' invalid' : ''
                }`}
              >
                <label className="consent-check">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    onBlur={() => markTouched('consent')}
                  />
                  <span>
                    I agree PediCheck may store my email to let me know if this
                    ships. See our <a href="/privacy">privacy notice</a>.
                  </span>
                </label>
                <div className="field-error">
                  Please tick the box so we can store your email.
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={!formValid || submitting}
              >
                {submitting ? 'Sending…' : 'Submit feature request'}{' '}
                <span aria-hidden="true">→</span>
              </button>
              <p className="form-meta">
                New requests are reviewed before they appear on the board below.
              </p>
            </form>
          ) : (
            <div className="confirm">
              <div className="confirm-circle">
                <ConfirmTick />
              </div>
              <h3 className="display">
                Got it. <em>Thank you.</em>
              </h3>
              <p className="confirm-sub">
                We&apos;ll review your idea and add it to the board shortly.
              </p>
            </div>
          )}
        </div>

        {/* ---- Browse feed ---- */}
        <div className="fr-feed">
          <h3 className="fr-feed-title">What others have asked for</h3>

          {loading && <p className="fr-empty">Loading ideas…</p>}

          {!loading && loadError && (
            <p className="fr-empty">
              Couldn&apos;t load the board right now.{' '}
              <button type="button" className="fr-retry" onClick={loadFeed}>
                Try again
              </button>
            </p>
          )}

          {!loading && !loadError && features.length === 0 && (
            <p className="fr-empty">
              No approved ideas yet — be the first to suggest one above.
            </p>
          )}

          {!loading && !loadError && features.length > 0 && (
            <ul className="fr-list">
              {features.map((f) => {
                const voted = myVotes[f.id];
                const score = f.upvotes - f.downvotes;
                return (
                  <li key={f.id} className="fr-card">
                    <div className="fr-votes">
                      <button
                        type="button"
                        className={`fr-vote${voted === 'up' ? ' active' : ''}`}
                        aria-label="Upvote"
                        disabled={!!voted}
                        onClick={() => handleVote(f, 'up')}
                      >
                        <ChevronUpIcon />
                      </button>
                      <span className="fr-score">{score}</span>
                      <button
                        type="button"
                        className={`fr-vote${voted === 'down' ? ' active' : ''}`}
                        aria-label="Downvote"
                        disabled={!!voted}
                        onClick={() => handleVote(f, 'down')}
                      >
                        <ChevronDownIcon />
                      </button>
                    </div>
                    <div className="fr-body">
                      <h4 className="fr-card-title">{f.title}</h4>
                      <p className="fr-card-desc">{f.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </section>
  );
}
