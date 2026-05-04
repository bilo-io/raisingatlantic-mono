'use client';

import { RouteError } from '@/components/errors/RouteError';

export default function DashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError {...props} homeHref="/dashboard" homeLabel="Back to Dashboard" />;
}
