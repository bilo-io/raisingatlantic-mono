import { NextRequest, NextResponse } from 'next/server';
import { AppsScriptError, callAppsScript } from '@/lib/appsScript';

export const dynamic = 'force-dynamic';

// POST /api/feature-requests/:id/vote — increments the up/down counter on the sheet.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const direction = body.direction;
  if (direction !== 'up' && direction !== 'down') {
    return NextResponse.json(
      { message: 'Vote direction must be "up" or "down".' },
      { status: 400 },
    );
  }

  try {
    const { value } = await callAppsScript<{ value: number }>('vote', {
      id,
      direction,
    });
    return NextResponse.json({ value });
  } catch (err) {
    if (err instanceof AppsScriptError && err.code === 'not_found') {
      return NextResponse.json(
        { message: 'Feature request not found.' },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: 'Could not record your vote.' },
      { status: 502 },
    );
  }
}
