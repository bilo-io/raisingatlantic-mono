'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'pedicheck_count';
const START = 134;
const CAP = 200;
const POLL_MS = 2500;

function readCount(): number {
  if (typeof window === 'undefined') return START;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v == null) return START;
    const n = Number(v);
    return Number.isFinite(n) ? n : START;
  } catch {
    return START;
  }
}

function writeCount(n: number): number {
  const clamped = Math.min(CAP, Math.max(0, n | 0));
  try {
    window.localStorage.setItem(KEY, String(clamped));
  } catch {
    /* swallow storage errors (private mode, quota) */
  }
  return clamped;
}

export function useWaitlistCounter() {
  const [count, setCount] = useState<number>(START);

  useEffect(() => {
    setCount(readCount());
    const id = window.setInterval(() => {
      setCount((prev) => {
        const fresh = readCount();
        return fresh === prev ? prev : fresh;
      });
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  const increment = useCallback(() => {
    const next = writeCount(readCount() + 1);
    setCount(next);
    return next;
  }, []);

  const percent = Math.min(100, (count / CAP) * 100);

  return { count, cap: CAP, percent, increment };
}
