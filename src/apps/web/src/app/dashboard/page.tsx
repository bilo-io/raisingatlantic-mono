import { Suspense } from 'react';
import DashboardLoading from './loading';
import DashboardClient from './DashboardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Raising Atlantic',
  description: 'Manage your activity and records.',
};

/**
 * Server Component entry point for the Dashboard.
 * 
 * Phase 2 Refactor: Wraps the monolithic client component in a Suspense boundary.
 * In Phase 3, the heavy data logic will be hoisted out to this Server Component
 * fetching from NestJS API and passing the data down as props.
 */
export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
