const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const SA_ID_RE = /\b\d{13}\b/;
const HPCSA_RE = /\b(?:MP|PS|DP|OT|PT)\s?\d{6,7}\b/i;
const SANC_RE = /\bSANC\s?\d{6,8}\b/i;

export type PushPayloadFields = {
  title?: string | null;
  body?: string | null;
  subtitle?: string | null;
};

export function payloadContainsPII(payload: PushPayloadFields): boolean {
  const text = [payload.title, payload.body, payload.subtitle]
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .join(" ");
  if (!text) return false;
  return (
    EMAIL_RE.test(text) ||
    SA_ID_RE.test(text) ||
    HPCSA_RE.test(text) ||
    SANC_RE.test(text)
  );
}

export function warnIfPushPayloadHasPII(payload: PushPayloadFields): void {
  if (__DEV__ && payloadContainsPII(payload)) {
    console.warn(
      "[push] payload contains PII-shaped text. Push bodies must be generic; carry IDs in data.",
    );
  }
}
