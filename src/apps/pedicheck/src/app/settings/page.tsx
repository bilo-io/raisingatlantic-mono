import type { Metadata } from 'next';
import { FontSettings } from './FontSettings';

// Internal typography-testing page — keep it out of search results.
export const metadata: Metadata = {
  title: 'Font settings — PediCheck',
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <FontSettings />;
}
