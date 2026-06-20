export interface FixtureTokenClaims {
  sub: string;
  role: string;
  tenantId?: string;
  practiceIds?: string[];
  iat?: number;
  exp?: number;
}

function base64UrlDecode(segment: string): string {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  );
  return Buffer.from(padded, 'base64').toString('utf8');
}

/**
 * Decodes the unsigned (`alg: "none"`) fixture JWT minted by the mobile dev
 * signer (`src/apps/mobile/lib/api/fixture-jwt.ts`). Returns the claims only
 * when the header advertises `alg: "none"`; returns null for any signed or
 * malformed token.
 *
 * This is deliberately NOT signature verification — it exists so the dev API
 * can attach a user from the fixture token under `EXPO_PUBLIC_USE_API=true`.
 * Real verification is owned by DEV.md §2 / mobile §M4.4 (real auth cutover),
 * at which point the fixture signer is replaced wholesale.
 */
export function decodeUnsignedFixtureToken(
  token: string,
): FixtureTokenClaims | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as { alg?: string };
    if (header?.alg !== 'none') return null;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as FixtureTokenClaims;
    if (
      !payload ||
      typeof payload.sub !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
