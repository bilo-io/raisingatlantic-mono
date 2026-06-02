// Local PII redaction for log lines emitted by notification transports.
// Kept local to src/core/notifications/ to avoid src/core/ depending on src/apps/.
// Mirrors the helpers in src/apps/api/src/common/utils/masking.util.ts.

export function redactEmail(email: string): string {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `***@${domain}`;
  return `${local.substring(0, 2)}***@${domain}`;
}

export function redactPhone(phone: string): string {
  if (!phone) return '***';
  const cleaned = phone.trim();
  if (cleaned.length < 7) return '***-***-****';
  return `${cleaned.substring(0, 4)} *** ${cleaned.substring(cleaned.length - 4)}`;
}

export function redactToken(token: string): string {
  if (!token || token.length < 8) return '***';
  return `${token.substring(0, 6)}…${token.substring(token.length - 4)}`;
}
