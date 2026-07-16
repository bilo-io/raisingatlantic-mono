import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

// RFC 6238 TOTP (SHA-1, 30s step, 6 digits — the authenticator-app default),
// implemented on Node crypto directly: the otplib v13 dependency chain is
// ESM-only (@scure/base) and breaks the CJS jest/ts-jest toolchain.

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const TIME_STEP_SECONDS = 30;
const DIGITS = 6;

export function generateTotpSecret(byteLength = 20): string {
  return base32Encode(randomBytes(byteLength));
}

export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

export function base32Decode(encoded: string): Buffer {
  const clean = encoded.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error('Invalid base32 character in TOTP secret');
    }
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

export function totpCode(
  secret: string,
  epochMs: number = Date.now(),
  stepOffset = 0,
): string {
  const counter = Math.floor(epochMs / 1000 / TIME_STEP_SECONDS) + stepOffset;
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const digest = createHmac('sha1', base32Decode(secret))
    .update(counterBuffer)
    .digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3];
  return (binary % 10 ** DIGITS).toString().padStart(DIGITS, '0');
}

// Accepts the current step ±1 to absorb clock drift between the phone and
// the server (the standard authenticator-app tolerance).
export function verifyTotp(
  secret: string,
  token: string,
  epochMs: number = Date.now(),
): boolean {
  if (!/^\d{6}$/.test(token)) return false;
  const candidate = Buffer.from(token);
  for (const stepOffset of [0, -1, 1]) {
    const expected = Buffer.from(totpCode(secret, epochMs, stepOffset));
    if (
      expected.length === candidate.length &&
      timingSafeEqual(expected, candidate)
    ) {
      return true;
    }
  }
  return false;
}

export function totpUri(secret: string, issuer: string, label: string): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedLabel = encodeURIComponent(label);
  return `otpauth://totp/${encodedIssuer}:${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}`;
}
