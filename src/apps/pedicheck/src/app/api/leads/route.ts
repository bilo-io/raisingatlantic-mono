import { NextRequest, NextResponse } from 'next/server';
import { callAppsScript } from '@/lib/appsScript';

// Always run server-side per request; never cache lead submissions.
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const consent = body.consent === true;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { message: 'A valid email address is required.' },
      { status: 400 },
    );
  }
  // POPIA: never store contact PII without explicit consent.
  if (!consent) {
    return NextResponse.json({ message: 'Consent is required.' }, { status: 400 });
  }

  // First hop of x-forwarded-for is the client IP (Vercel sets this header).
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() ?? '';

  try {
    await callAppsScript('createLead', {
      email,
      message: typeof body.message === 'string' ? body.message : '',
      name: typeof body.name === 'string' ? body.name : '',
      subject: typeof body.subject === 'string' ? body.subject : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      type: body.type === 'waitlist' ? 'waitlist' : 'contact',
      consent,
      ip,
    });
  } catch {
    // No PII in logs — surface a generic message only.
    return NextResponse.json(
      { message: 'Could not submit right now. Please try again.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: 'Lead submitted successfully',
    timestamp: new Date().toISOString(),
  });
}
