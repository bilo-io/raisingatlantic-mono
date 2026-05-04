'use client';

import { useToast } from '@/hooks/useToast';
import { useCallback, useMemo } from 'react';

export type ToastBridge = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

/**
 * Hook adapter that exposes the app's toast context as a stable
 * `ToastBridge` interface so feature code (and the resource-hook factory)
 * doesn't need to know about the underlying ToastContext shape.
 */
export function useToastBridge(): ToastBridge {
  const { addToast } = useToast();

  const success = useCallback(
    (title: string, description?: string) => addToast({ title, description, type: 'success' }),
    [addToast],
  );
  const error = useCallback(
    (title: string, description?: string) => addToast({ title, description, type: 'error' }),
    [addToast],
  );
  const info = useCallback(
    (title: string, description?: string) => addToast({ title, description, type: 'info' }),
    [addToast],
  );

  return useMemo(() => ({ success, error, info }), [success, error, info]);
}
