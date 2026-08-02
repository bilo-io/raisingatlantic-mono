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
              &ldquo;My 18-month-old has a fever of 38.4°C and is drinking and
              playing normally.&rdquo;
            </p>
            <div className="sc-phone">
              <PhoneMockup time="23:47" step="Result">
                <span className="result-badge safe">
                  <span className="dot" />
                  Green · home care
                </span>
                <h4 className="r-title">Home care is likely fine.</h4>
                <p className="r-body">
                  Your child does not show any of the warning signs above right
                  now. You can usually manage this fever at home with fluids,
                  rest, and appropriate fever relief.
                </p>
                <div className="watchbox safe">
                  <div className="wlabel">Come back or seek help if</div>
                  <ul>
                    <li>Breathing becomes difficult</li>
                    <li>They become floppy or hard to wake</li>
                    <li>A non-blanching rash appears</li>
                  </ul>
                </div>
              </PhoneMockup>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="scenario">
            <p className="sc-quote">
              &ldquo;She&apos;s unusually flat and hard to console, even though
              her fever isn&apos;t that high.&rdquo;
            </p>
            <div className="sc-phone">
              <PhoneMockup time="22:18" step="Result">
                <span className="result-badge caution">
                  <span className="dot" />
                  Amber · same-day review
                </span>
                <h4 className="r-title">Arrange a same-day medical review.</h4>
                <p className="r-body">
                  Your child seems unusually flat, hard to console, or very
                  unlike themselves. This is different from normal fever
                  clinginess, and should be checked by a doctor today.
                </p>
                <div className="watchbox caution">
                  <div className="wlabel">Come back or seek help if</div>
                  <ul>
                    <li>Breathing becomes difficult</li>
                    <li>They become floppy or hard to wake</li>
                    <li>They stop drinking or passing urine</li>
                  </ul>
                </div>
              </PhoneMockup>
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="scenario">
            <p className="sc-quote">
              &ldquo;There&apos;s a rash that doesn&apos;t fade when I press a
              glass on it.&rdquo;
            </p>
            <div className="sc-phone">
              <PhoneMockup time="01:13" step="Result">
                <span className="result-badge terra">
                  <span className="dot" />
                  Red · get help now
                </span>
                <h4 className="r-title">Get medical help now.</h4>
                <p className="r-body">
                  A rash that does not fade under pressure needs urgent
                  in-person assessment, even if your child otherwise seems
                  well.
                </p>
                <div className="watchbox terra">
                  <div className="wlabel">Do this now</div>
                  <ul>
                    <li>Nearest emergency room on your route</li>
                    <li>Or call 10177 if you can&apos;t move safely</li>
                    <li>Direct WhatsApp to your paed</li>
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
