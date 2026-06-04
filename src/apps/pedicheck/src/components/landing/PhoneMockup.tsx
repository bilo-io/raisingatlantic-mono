import type { ReactNode } from 'react';
import { Wordmark } from './Wordmark';

type Props = {
  time: string;
  step: string;
  children: ReactNode;
};

export function PhoneMockup({ time, step, children }: Props) {
  return (
    <div className="phone">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-status">
          <span>{time}</span>
          <span className="dots">
            <span />
            <span />
            <span />
          </span>
        </div>
        <div className="phone-header">
          <Wordmark size="phone" />
          <span className="step">{step}</span>
        </div>
        <div className="phone-body">{children}</div>
      </div>
    </div>
  );
}
