// Shared, framework-agnostic validators for the public lead-capture forms
// (waitlist, contact, feature requests). South-Africa-first, with international
// support. Pure functions — safe to import from server or client components.

// Pragmatic, HTML5-aligned email pattern: a non-empty local part, a single @,
// then a dotted domain with a real TLD. Stricter than a bare "something@
// something" check (it requires a TLD) without chasing full RFC 5322.
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(raw: string): boolean {
  const s = raw.trim();
  // RFC 5321 caps an address at 254 characters; also reject the empty string.
  if (s.length === 0 || s.length > 254) return false;
  return EMAIL_RE.test(s);
}

// Strip the punctuation people routinely type into phone numbers (spaces,
// dashes, dots, parentheses) so only the dialling digits remain.
function normalizePhone(raw: string): string {
  return raw.replace(/[\s.\-()]/g, '');
}

/**
 * Accepts:
 *  - South African local numbers: a leading 0 followed by 9 digits
 *    (10 total), e.g. "082 123 4567".
 *  - South African international: +27 followed by exactly 9 digits,
 *    e.g. "+27 82 123 4567". No other country uses +27, so a +27 number with
 *    the wrong digit count is treated as a malformed SA number, not a foreign
 *    one.
 *  - Any other international number in E.164 form: a leading + then 8–15 digits
 *    with a non-zero country code, e.g. "+1 415 555 0123".
 *
 * Returns false for empty input — callers decide whether the field is optional.
 */
export function isValidPhone(raw: string): boolean {
  const s = normalizePhone(raw.trim());
  if (s === '') return false;
  // South African local: leading 0 then 9 more digits.
  if (/^0\d{9}$/.test(s)) return true;
  // South African international: +27 must carry exactly 9 national digits.
  if (s.startsWith('+27')) return /^\+27\d{9}$/.test(s);
  // Other international, E.164: leading + then 8–15 digits, non-zero country code.
  return /^\+[1-9]\d{7,14}$/.test(s);
}
