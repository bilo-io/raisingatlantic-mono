import { Wordmark } from './Wordmark';

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Wordmark size="nav" href="/" />
        <div className="nav-actions">
          <a href="/features" className="nav-link">
            Features
          </a>
          <a href="/#waitlist" className="btn">
            Join the Founding 200
          </a>
        </div>
      </div>
    </nav>
  );
}
