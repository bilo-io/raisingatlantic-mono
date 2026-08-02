'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '@/lib/auth';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GIS_SRC = 'https://accounts.google.com/gsi/client';

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (cfg: {
        client_id: string;
        callback: (res: { credential?: string }) => void;
      }) => void;
      renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
    };
  };
};

const getGoogle = (): GoogleIdentity | undefined =>
  (window as unknown as { google?: GoogleIdentity }).google;

/**
 * Renders Google's own sign-in button via Google Identity Services and exchanges
 * the returned ID token for a session cookie (POST /v1/auth/google). Renders
 * nothing until NEXT_PUBLIC_GOOGLE_CLIENT_ID is configured, so the option stays
 * inert until a Google OAuth client id is provided (no GCP infra required).
 */
export function GoogleSignInButton({
  onError,
}: {
  onError?: (message: string) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CLIENT_ID || typeof window === 'undefined') return;
    let cancelled = false;

    const init = () => {
      const google = getGoogle();
      if (cancelled || !google || !containerRef.current) return;
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (res) => {
          if (!res.credential) return;
          try {
            await loginWithGoogle(res.credential);
            router.push('/dashboard');
          } catch {
            onError?.('Google sign-in failed. Please try again.');
          }
        },
      });
      google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: 360,
      });
    };

    if (getGoogle()?.accounts?.id) {
      init();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SRC}"]`,
    );
    const script = existing ?? document.createElement('script');
    if (!existing) {
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', init);
    return () => {
      cancelled = true;
      script.removeEventListener('load', init);
    };
  }, [router, onError]);

  if (!CLIENT_ID) return null;
  return <div ref={containerRef} className="flex justify-center" />;
}
