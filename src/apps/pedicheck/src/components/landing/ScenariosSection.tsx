import { PhoneMockup } from './PhoneMockup';

export function ScenariosSection() {
  return (
    <section className="scenarios">
      <div className="wrap">
        <div className="scenarios-head">
          <div className="eyebrow center">How it works</div>
          <h2 className="display" style={{ marginTop: 18 }}>
            A handful of questions. Ninety seconds.{' '}
            <em>A clear answer.</em>
          </h2>
          <p className="sub">
            Here&apos;s how PediCheck thinks through three of the most common
            middle-of-the-night moments.
          </p>
        </div>
        <div className="scenarios-grid">
          {/* Scenario 1 */}
          <div className="scenario">
            <p className="sc-quote">
              &ldquo;My 18-month-old has a fever of 39.2°C.&rdquo;
            </p>
            <div className="sc-phone">
              <PhoneMockup time="23:47" step="Result">
                <span className="result-badge blue">
                  <span className="dot" />
                  Monitor at home
                </span>
                <h4 className="r-title">A fever she can fight tonight.</h4>
                <p className="r-body">
                  39.2°C is a real fever, but with no red flags and good
                  hydration, this looks like her body doing its job.
                </p>
                <div className="watchbox">
                  <div className="wlabel">Watch for tonight</div>
                  <ul>
                    <li>Drowsy or hard to wake</li>
                    <li>Refusing all fluids</li>
                    <li>A rash that doesn&apos;t fade</li>
                  </ul>
                </div>
              </PhoneMockup>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="scenario">
            <p className="sc-quote">
              &ldquo;She&apos;s been vomiting since dinner.&rdquo;
            </p>
            <div className="sc-phone">
              <PhoneMockup time="22:18" step="Result">
                <span className="result-badge blue">
                  <span className="dot" />
                  Manage at home
                </span>
                <h4 className="r-title">Hydration is the focus.</h4>
                <p className="r-body">
                  No green vomit, no severe pain, still keeping small sips down.
                  Likely a viral tummy bug she&apos;ll ride out.
                </p>
                <div className="watchbox">
                  <div className="wlabel">Start with</div>
                  <ul>
                    <li>5–10ml oral rehydration solution every 15 min</li>
                    <li>No solid food for now</li>
                    <li>Recheck every 30 min</li>
                  </ul>
                </div>
              </PhoneMockup>
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="scenario">
            <p className="sc-quote">
              &ldquo;He fell off the bed and hit his head.&rdquo;
            </p>
            <div className="sc-phone">
              <PhoneMockup time="01:13" step="Result">
                <span className="result-badge terra">
                  <span className="dot" />
                  See a doctor now
                </span>
                <h4 className="r-title">
                  This head bump needs eyes tonight.
                </h4>
                <p className="r-body">
                  He vomited twice and is hard to settle since the fall. After a
                  head injury, that combination isn&apos;t safe to wait on until
                  morning.
                </p>
                <div className="watchbox terra">
                  <div className="wlabel">Your nearest after-hours line</div>
                  <ul>
                    <li>Tap to see options near you</li>
                    <li>Direct WhatsApp to your paed</li>
                    <li>Closest ER on your route</li>
                  </ul>
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
