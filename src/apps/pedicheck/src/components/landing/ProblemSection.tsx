type Card = {
  label: string;
  name: string;
  tag: string;
  variant?: 'child';
};

const CARDS: Card[] = [
  { label: 'Google', name: '14 million results', tag: 'too much' },
  { label: 'Facebook moms', name: '"It’s meningitis."', tag: 'too scary' },
  {
    label: 'Family WhatsApp',
    name: '"Give Panado and wait."',
    tag: 'too vague',
  },
  { label: 'Your neighbour', name: '"Rush to casualty."', tag: 'too urgent' },
  {
    label: 'Your child',
    name: 'Fast asleep on the couch.',
    tag: 'meanwhile…',
    variant: 'child',
  },
];

export function ProblemSection() {
  return (
    <section className="problem bg-warm">
      <div className="wrap">
        <div className="narrow">
          <div className="eyebrow center no-line">
            <span
              style={{
                width: 28,
                height: 1,
                background: 'var(--line-strong)',
                display: 'inline-block',
              }}
            />
            The problem
            <span
              style={{
                width: 28,
                height: 1,
                background: 'var(--line-strong)',
                display: 'inline-block',
              }}
            />
          </div>
          <h2
            className="display"
            style={{ marginTop: 18, fontSize: 'clamp(34px,4.4vw,54px)' }}
          >
            You Googled it.{' '}
            <em style={{ fontFamily: 'var(--body-font)' }}>
              Now you&apos;re more scared.
            </em>
          </h2>
          <p className="problem-lead">
            &ldquo;High fever toddler.&rdquo; 11pm. Suddenly everyone has an
            answer:
          </p>
        </div>
        <div className="problem-cards">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className={`pcard${c.variant === 'child' ? ' child' : ''}`}
            >
              <div className="label">{c.label}</div>
              <div className="name">{c.name}</div>
              <div className="tag">{c.tag}</div>
            </div>
          ))}
        </div>
        <div className="narrow">
          <div className="problem-paras problem-close">
            <p>
              And there you are at 11pm, trying to work out who to believe.
            </p>
            <p className="heavy">
              The problem was never too little information. It&apos;s knowing{' '}
              <span className="em-accent">what actually matters.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
