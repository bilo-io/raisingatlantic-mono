# Mobile POPIA Section 72 — Cross-Border Transfer Assessment

> Deliverable for [MOBILE.md §M5.6](MOBILE.md#m56-release-checklist). Scope: the third-party
> SDKs **shipped inside the mobile app binary** that transmit data outside South Africa.
> POPIA **Section 72** restricts sending personal information across the border without the
> data subject's consent, an adequacy basis, or Standard Contractual Clauses (SCCs).
>
> Owner: DEV (this assessment). DPA **signing** and privacy-policy disclosure are
> COMPLIANCE-owned — see [COMPLIANCE.md §4.3](COMPLIANCE.md#43-cross-border-transfers).
>
> This assessment covers the **binary only**. The app's own API is Cloud Run + Cloud SQL in
> `africa-south1` per [ADR 0001](../adr/0001-hosting.md) — **in-country, not a §72 concern.**

## SDKs in the shipped bundle

| SDK | Data transmitted | Destination | Personal info? | §72 basis | Mitigations in place | DPA |
|---|---|---|---|---|---|---|
| **Sentry** (`@sentry/react-native`) | Crash/exception events, stack traces, device/OS context | sentry.io (US/EU) | Potentially — scrubbed | Consent + SCC-backed DPA + privacy-policy disclosure | `sendDefaultPii: false`, `tracesSampleRate: 0` (no perf/replay), `beforeSend` scrub of emails / SA 13-digit IDs / HPCSA·SANC / phones / sensitive keys ([scrub.ts](../../src/apps/mobile/lib/sentry/scrub.ts)); DSN-gated no-op when unset ([init.ts](../../src/apps/mobile/lib/sentry/init.ts)) | ☐ COMPLIANCE |
| **Expo push** (`expo-notifications` → Expo push service) | Expo push token (device identifier) | Expo (US) | Yes — a device identifier is personal info under POPIA | DPA/SCCs + disclosure | Payloads carry **no PII** — generic bodies + opaque IDs enforced in M4.1 ([topics.ts](../../src/apps/mobile/lib/push/topics.ts), [scrub.ts](../../src/apps/mobile/lib/push/scrub.ts)) | ☐ COMPLIANCE |
| **FCM** (Google, Android) / **APNs** (Apple, iOS) | Push transport (token + encrypted payload) | US | Yes — device token | Standard platform DPAs | Transport only; same no-PII-payload rule as above | ☐ COMPLIANCE |
| **EAS Update** (`expo-updates`) | JS bundle download (no user data uploaded) | Expo CDN (US) | No | Sub-processor disclosure | OTA bundles are JS-only; no user PII transmitted | ☐ COMPLIANCE |

## Explicitly **not** shipped
- **No analytics SDK** in the binary (no Firebase Analytics, Amplitude, Segment, etc.).
- No advertising/tracking IDs collected.

## Findings & recommendations
1. **Sentry** is the only SDK that could carry incidental personal information. The existing
   code-level controls (no default PII, no tracing, aggressive `beforeSend` scrub) are the
   primary mitigation. **Recommend selecting Sentry's EU data region** (closest to an
   "adequate protection" jurisdiction; Sentry offers no SA region) and enabling Sentry only
   for `preview`/`production`.
2. **Expo push / FCM / APNs** transmit a device token (personal info) but no content PII —
   acceptable under §72 with the standard DPAs + disclosure.
3. **Actions for COMPLIANCE** (tracked in [COMPLIANCE.md §4.3](COMPLIANCE.md#43-cross-border-transfers)):
   sign DPAs with Sentry and Expo; list all four as sub-processors in the public privacy
   policy; confirm SCCs where no adequacy decision exists.

## Status against §M5.6
- ✅ **DEV assessment complete** (this document) — the shipped SDKs are inventoried, their
  transfers characterised, and mitigations recorded.
- ☐ **DPA signatures + privacy-policy disclosure** — COMPLIANCE-owned, outstanding.
