import Image from 'next/image';
import { HouseIcon, CheckSmallIcon, LockIcon } from './icons';

export function CredibilitySection() {
  return (
    <section className="cred bg-ocean">
      <div className="wrap">
        <div className="cred-grid">
          <div className="cred-photos">
            <div className="cred-photo">
              <Image
                src="/images/doc-1.jpg"
                alt="Paediatrician at Atlantic Children's Practice"
                fill
                sizes="(max-width: 680px) 100vw, 50vw"
              />
            </div>
            <div className="cred-photo">
              <Image
                src="/images/doc-2.jpg"
                alt="Paediatrician at Atlantic Children's Practice"
                fill
                sizes="(max-width: 680px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="cred-text">
            <div className="eyebrow">Who built this</div>
            <h2 className="display" style={{ marginTop: 18 }}>
              Built by paediatricians who&apos;ve seen{' '}
              <em>too many late-night panics.</em>
            </h2>
            <div className="cred-cols">
              <div>
                <p>
                  PediCheck is created by the paediatricians at{' '}
                  <strong>Atlantic Children&apos;s Practice</strong>, doctors
                  who are mothers too. We&apos;ve sat on the other side of these
                  late-night moments, with our own children, more times than we
                  can count.
                </p>
                <p>
                  Every decision pathway is written by our paediatricians and
                  reviewed by an independent clinical bench before it ever
                  reaches you. It&apos;s not Google. It&apos;s how we&apos;d
                  think through it ourselves.
                </p>
              </div>
              <div className="cred-badges">
                <div className="cred-badge">
                  <span className="ico">
                    <HouseIcon />
                  </span>
                  <span>Built by paediatricians, and mothers</span>
                </div>
                <div className="cred-badge">
                  <span className="ico">
                    <CheckSmallIcon />
                  </span>
                  <span>Every pathway clinically reviewed</span>
                </div>
                <div className="cred-badge">
                  <span className="ico">
                    <LockIcon />
                  </span>
                  <span>POPIA-compliant, your data stays yours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
