import { NextRequest, NextResponse } from 'next/server';
import { callAppsScript } from '@/lib/appsScript';

// The board must always reflect the latest sheet state — never cache.
export const dynamic = 'force-dynamic';

interface PublicFeature {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TITLE_LIMIT = 80;
const DESCRIPTION_LIMIT = 200;

// GET /api/feature-requests — APPROVED rows only (the script filters + strips PII).
export async function GET() {
  try {
    const data = await callAppsScript<PublicFeature[]>('listFeatures', {});
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: 'Could not load the board right now.' },
      { status: 502 },
    );
  }
}

// POST /api/feature-requests — create a PENDING request (not shown until approved).
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description =
    typeof body.description === 'string' ? body.description.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const consent = body.consent === true;

  if (!title || title.length > TITLE_LIMIT) {
    return NextResponse.json(
      { message: `Title is required (max ${TITLE_LIMIT} characters).` },
      { status: 400 },
    );
  }
  if (!description || description.length > DESCRIPTION_LIMIT) {
    return NextResponse.json(
      { message: `Description is required (max ${DESCRIPTION_LIMIT} characters).` },
      { status: 400 },
    );
  }
  // Email is optional; if supplied it must be valid AND consented (POPIA).
  if (email) {
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { message: 'Enter a valid email or leave it blank.' },
        { status: 400 },
      );
    }
    if (!consent) {
      return NextResponse.json(
        { message: 'Please consent before we store your email.' },
        { status: 400 },
      );
    }
  }

  try {
    const { id } = await callAppsScript<{ id: string }>('createFeature', {
      title,
      description,
      email,
      consent,
    });
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { message: 'Could not submit right now. Please try again.' },
      { status: 502 },
    );
  }
}
