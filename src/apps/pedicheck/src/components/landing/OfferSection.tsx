import { CheckIcon } from './icons';

const BENEFITS = [
  {
    title: '60 days of free access after launch',
    body: 'No card required. Use the full product before you pay a cent.',
  },
  {
    title: 'Early access, one week before public launch',
    body: 'Your account is active before anyone else’s.',
  },
  {
    title: 'A say in what we build next',
    body: 'Waitlist members get the first vote on every new feature.',
  },
];

export function OfferSection() {
  return (
    <section className="offer bg-warm">
      <div className="wrap">
        <div className="offer-grid">
          <div>
            <div className="eyebrow">The offer</div>
            <h2 className="display" style={{ marginTop: 18 }}>
              Join before we <em>launch.</em>
            </h2>
            <p className="sub">
              We&apos;re launching PediCheck soon. Anyone who joins the waitlist
              before we launch gets these benefits.
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
            <div className="counter-label">The waitlist</div>
            <p
              style={{
                fontFamily: 'var(--headline-font)',
                fontWeight: 300,
                fontSize: 'clamp(30px, 4vw, 40px)',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                color: 'var(--ocean-deep)',
                margin: '14px 0 24px',
              }}
            >
              60 days free. Early access. A say in what we build.
            </p>
            <a
              href="#waitlist"
              className="btn primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Join the waitlist <span aria-hidden="true">→</span>
            </a>
            <p className="counter-caption">
              No card required. One short update a month until we launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
