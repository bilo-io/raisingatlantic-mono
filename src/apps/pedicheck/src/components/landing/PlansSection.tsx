import { TickIcon } from './icons';

type Plan = {
  label: string;
  name: string;
  tag: string;
  currency: string;
  amount: string;
  per: string;
  was?: string;
  wasNote: string;
  features: string[];
  cta: string;
  featured?: boolean;
  flag?: string;
};

const PLANS: Plan[] = [
  {
    label: 'The app',
    name: 'PediCheck',
    tag: 'Calm, paediatrician-built guidance for every fever, bump and 2am worry.',
    currency: 'R',
    amount: '199',
    per: '/ month',
    wasNote: 'Your first 60 days are free, no card required.',
    features: [
      'Unlimited symptom check-ins, any hour',
      'Clear red-flag detection and next steps',
      'Nearest after-hours options on your route',
      '60 days free, no card required',
    ],
    cta: 'Join the waitlist',
  },
  {
    label: 'Premium add-on',
    name: 'ACP Priority',
    tag: 'A direct, dedicated WhatsApp line to an ACP paediatrician, after hours, when it matters most.',
    currency: 'R',
    amount: '1 250',
    per: '/ month',
    was: 'R1 500/month',
    wasNote: 'Special price for everyone on the PediCheck app.',
    features: [
      'Direct WhatsApp access to a paediatrician',
      'Dedicated after-hours cover, evenings & weekends',
      'Fast human triage the moment PediCheck flags concern',
      'Priority booking at Atlantic Children’s Practice',
    ],
    cta: 'Add ACP Priority',
    featured: true,
    flag: 'Member price',
  },
];

export function PlansSection() {
  return (
    <section className="plans">
      <div className="wrap">
        <div className="plans-head">
          <div className="eyebrow center">Plans &amp; pricing</div>
          <h2 className="display" style={{ marginTop: 18 }}>
            The app for every night.{' '}
            <em>A paediatrician for the ones that count.</em>
          </h2>
          <p className="sub">
            PediCheck helps you think through almost everything on your own. For
            the nights you&apos;d rather not, ACP Priority puts a paediatrician
            one message away.
          </p>
        </div>
        <div className="plans-grid">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`plan${p.featured ? ' featured' : ''}`}
            >
              {p.flag && <span className="plan-flag">{p.flag}</span>}
              <div className="plan-label">{p.label}</div>
              <div className="plan-name">{p.name}</div>
              <p className="plan-tag">{p.tag}</p>
              <div className="plan-price">
                <span className="cur">{p.currency}</span>
                <span className="amt">{p.amount}</span>
                <span className="per">{p.per}</span>
              </div>
              <p className="plan-was">
                {p.was && (
                  <>
                    <s>{p.was}</s> &nbsp;
                  </>
                )}
                {p.wasNote}
              </p>
              <ul className="plan-feat">
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="tick">
                      <TickIcon />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="plan-cta">
                <a href="#waitlist" className="btn">
                  {p.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="plans-note">
          ACP Priority is an optional add-on to your PediCheck subscription and
          is not a substitute for emergency care. In a life-threatening
          emergency, always call 10177 or go to your nearest emergency unit.
        </p>
      </div>
    </section>
  );
}
