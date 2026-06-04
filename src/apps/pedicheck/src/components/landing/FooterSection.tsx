import { Wordmark } from './Wordmark';

export function FooterSection() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Wordmark size="nav" href="/" />
            <p className="footer-by">
              By <strong>Atlantic Children&apos;s Practice</strong>, Cape Town ·
              Launching September 2026
            </p>
            <div className="footer-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
          <div>
            <p className="disclaimer">
              PediCheck helps you think through what&apos;s happening. It is not
              a diagnosis and does not replace seeing a doctor. If you are
              worried, trust that - call your paediatrician or go to your
              nearest emergency room.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
