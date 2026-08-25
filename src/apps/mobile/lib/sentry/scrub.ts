const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const SA_ID_RE = /\b\d{13}\b/g;
const HPCSA_RE = /\b(?:MP|PS|DP|OT|PT)\s?\d{6,7}\b/gi;
const SANC_RE = /\bSANC\s?\d{6,8}\b/gi;
const PHONE_RE = /\+?\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
const REDACT = "[redacted]";

const SENSITIVE_KEY_RE =
  /^(email|name|first_?name|last_?name|full_?name|display_?name|phone|phone_?number|id_?number|national_?id|sa_?id|hpcsa|hpcsa_?number|sanc|sanc_?number|child_?name|patient_?name|dob|date_?of_?birth|address|message|message_?body|note|content)$/i;

export function scrubString(input: string): string {
  return input
    .replace(EMAIL_RE, REDACT)
    .replace(SA_ID_RE, REDACT)
    .replace(HPCSA_RE, REDACT)
    .replace(SANC_RE, REDACT)
    .replace(PHONE_RE, REDACT);
}

export function scrubValue(value: unknown, parentKey?: string): unknown {
  if (typeof value === "string") {
    if (parentKey && SENSITIVE_KEY_RE.test(parentKey)) return REDACT;
    return scrubString(value);
  }
  if (Array.isArray(value)) return value.map((v) => scrubValue(v, parentKey));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = scrubValue(v, k);
    }
    return out;
  }
  return value;
}

export type SentryEventLike = {
  message?: string | { message?: string; formatted?: string };
  exception?: {
    values?: Array<{ value?: string; stacktrace?: unknown }>;
  };
  breadcrumbs?: Array<{ message?: string; data?: Record<string, unknown> }>;
  extra?: Record<string, unknown>;
  user?: Record<string, unknown>;
  request?: Record<string, unknown>;
  tags?: Record<string, unknown>;
  contexts?: Record<string, unknown>;
};

export function scrubSentryEvent<E extends SentryEventLike>(event: E): E {
  const next: SentryEventLike = { ...event };

  if (typeof next.message === "string") {
    next.message = scrubString(next.message);
  } else if (next.message && typeof next.message === "object") {
    const msg = { ...next.message };
    if (typeof msg.message === "string") msg.message = scrubString(msg.message);
    if (typeof msg.formatted === "string") msg.formatted = scrubString(msg.formatted);
    next.message = msg;
  }

  if (next.exception?.values) {
    next.exception = {
      ...next.exception,
      values: next.exception.values.map((v) => ({
        ...v,
        value: typeof v.value === "string" ? scrubString(v.value) : v.value,
      })),
    };
  }

  if (next.breadcrumbs) {
    next.breadcrumbs = next.breadcrumbs.map((b) => ({
      ...b,
      message: typeof b.message === "string" ? scrubString(b.message) : b.message,
      data: b.data ? (scrubValue(b.data) as Record<string, unknown>) : b.data,
    }));
  }

  if (next.extra) next.extra = scrubValue(next.extra) as Record<string, unknown>;
  if (next.request) next.request = scrubValue(next.request) as Record<string, unknown>;
  if (next.tags) next.tags = scrubValue(next.tags) as Record<string, unknown>;
  if (next.contexts) next.contexts = scrubValue(next.contexts) as Record<string, unknown>;

  if (next.user) {
    const u: Record<string, unknown> = { ...next.user };
    delete u.email;
    delete u.username;
    delete u.ip_address;
    if (typeof u.id === "string") u.id = scrubString(u.id);
    next.user = u;
  }

  return next as E;
}
