import { Wordmark } from './Wordmark';

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Wordmark size="nav" href="/" />
        <a href="/#waitlist" className="btn">
          Join the Founding 200
        </a>
      </div>
    </nav>
  );
}
