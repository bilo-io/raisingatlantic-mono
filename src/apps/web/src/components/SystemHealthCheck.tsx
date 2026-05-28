'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { checkApiHealth } from '@/lib/api/adapters/health.adapter';

export function SystemHealthCheck() {
  const { addToast } = useToast();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    let cancelled = false;

    void (async () => {
      try {
        const health = await checkApiHealth();
        if (cancelled) return;

        if (health.status === 'ok') {
          addToast({
            type: 'success',
            title: 'All systems operational',
            description: 'You are connected and ready to go.',
          });
        } else {
          addToast({
            type: 'warning',
            title: 'Limited service',
            description: 'Some features may be slower than usual. We are on it.',
          });
        }
      } catch {
        if (cancelled) return;
        addToast({
          type: 'warning',
          title: 'Limited service',
          description: 'We are having trouble reaching our servers. Some features may be unavailable.',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  return null;
}
