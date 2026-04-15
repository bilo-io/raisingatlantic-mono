import { Suspense } from 'react';
import DashboardLoading from './loading';
import DashboardClient from './DashboardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your activity and records.',
};

import { cookies, headers } from 'next/headers';

/**
 * Server Component entry point for the Dashboard.
 * Performs a server-side fetch to the NestJS API forwarding cookies for auth.
 */
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const allHeaders = await headers();
  const cookieHeader = allHeaders.get('cookie') || '';

  let initialData = null;
  try {
    // In dev, the API runs on :3000. 
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/dashboard`, {
      headers: {
        'Cookie': cookieHeader,
      },
      // Using cache: 'no-store' for private dashboard data
      cache: 'no-store',
    });

    if (response.ok) {
      initialData = await response.json();
    }
  } catch (error) {
    console.error('Dashboard server-side fetch failed:', error);
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient initialServerData={initialData} />
    </Suspense>
  );
}
