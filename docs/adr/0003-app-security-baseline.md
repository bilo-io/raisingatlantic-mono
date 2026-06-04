# ADR 0003 — Application Security Baseline

**Status:** Accepted
**Date:** 2026-05-28
**Phase:** Go-live Phase 5.1

## Context

Phase 5.1 of the go-live checklist requires baseline application-security
controls before we expose the API to real parents and clinicians. The product
holds **special personal information** under POPIA (children's health
records), so the floor is non-negotiable. We need the controls in code now,
even though the GCP / Cloud Armor layer (§5.2) will not exist until Phase 1
is complete.

## Decision

### HTTP security headers — Helmet

`helmet@^8` is applied as Express middleware in
[src/apps/api/src/main.ts](../../src/apps/api/src/main.ts) before global
pipes. We use Helmet's defaults plus:

- `hsts` enabled **only** when `NODE_ENV === 'production'` — local HTTP dev
  must not get pinned to HTTPS.
- `contentSecurityPolicy` **disabled**. The API serves JSON and Swagger UI
  ships inline scripts; CSP belongs on the Next.js web layer, which will get
  its own configuration in a follow-up.
- `crossOriginEmbedderPolicy` disabled to keep Swagger UI working.

CORS is unchanged — a strict env-extended allowlist in production, permissive
in dev for LAN access from Expo. No wildcard origin in any environment.

### Rate limiting — global throttler with per-user tracker

`@nestjs/throttler@^6` is registered with three named tiers — `short` (10/s),
`medium` (60/min), `long` (1000/h) — and bound globally via an `APP_GUARD`
in [src/apps/api/src/app.module.ts](../../src/apps/api/src/app.module.ts).

The guard is a thin subclass, `UserAwareThrottlerGuard`, that overrides
`getTracker(req)` to return `user:<id>` for authenticated requests and
`ip:<addr>` otherwise. This prevents one shared NAT (a school, a clinic, a
kiosk) from starving every user behind it once we have authenticated
traffic.

Per-route overrides use `@Throttle({ short: { limit, ttl } })`. The public
leads form is capped at 3 submissions per minute. **Auth endpoints (Phase 2)
must default to `@Throttle({ short: { limit: 5, ttl: 60_000 } })`** to blunt
credential-stuffing; this convention is recorded here so the Phase 2 author
inherits it.

### DTO validation gaps

Two DTOs were tightened:

- `CreatePracticeDto.latitude` / `longitude`: added `@IsNumber()` plus
  `@Min/@Max` bounds (±90 / ±180).
- `CreateReportDto.content`: a free-form JSON field gained a custom
  `MaxObjectDepth` validator capping depth at 4 and total keys at 200,
  preventing JSON-bomb-style DoS.

### Output encoding

All first-party markdown (blog, legal documents) now renders through a
single `MarkdownContent` primitive in
[src/apps/web/src/components/ui/markdown-content.tsx](../../src/apps/web/src/components/ui/markdown-content.tsx)
using `react-markdown` + `remark-gfm`. The previous hand-rolled regex
markdown converter in the legal page (which used `dangerouslySetInnerHTML`)
has been removed. The one remaining occurrence of `dangerouslySetInnerHTML`
in the codebase ([chart.tsx](../../src/apps/web/src/components/ui/chart.tsx))
emits CSS variables from a typed config and is annotated `// safe: …`.

### Dependency scanning

- Dependabot configured for npm (5 workspaces + root), github-actions,
  terraform, and docker ecosystems with weekly cadence.
- CI `security-audit` job runs `npm audit --audit-level=high --omit=dev` as
  a matrix across api/web/mobile/ui/types. (A future switch to `bun audit`
  is tracked in PHASE_5_TODO; the current CI is npm-based.)

### Secret scanning

- `.github/workflows/secret-scan.yml` runs `gitleaks-action@v2` on every PR
  and push, plus a nightly cron sweep.
- `.gitleaks.toml` extends the default ruleset with narrow allowlists for
  known placeholder strings in `.env.example` files.
- Local pre-commit enforcement via `lefthook` runs `gitleaks protect
  --staged` before every commit; bypass with `git commit --no-verify` is
  documented but discouraged.

### Pre-commit hooks

`lefthook@^1` was chosen over Husky for three reasons: language-agnostic
(no Node-postinstall coupling), single Go binary, and explicit parallel
command support. Hooks installed via root `package.json`'s `prepare`
script.

## Consequences

- Every endpoint now has at least the `medium` (60/min) cap by default. If
  legitimate flows exceed that (e.g. bulk-import endpoints), they need an
  explicit `@SkipThrottle()` or a per-route override — the test suite
  surfaces this quickly.
- Helmet's defaults send headers that some load-balancer-supplied headers
  duplicate (HSTS, X-Frame-Options). When the Phase 1 Cloud Armor / GLB
  layer lands, we must align — pick exactly one origin per header.
- `npm audit` returning a high-severity finding will block CI. This is the
  point, but expect occasional churn while waiting for upstream patches.
- The `MaxObjectDepth` cap is conservative (depth 4, 200 keys). If clinical
  report payloads outgrow this, raise the constants in
  [src/apps/api/src/common/validators/max-object-depth.validator.ts](../../src/apps/api/src/common/validators/max-object-depth.validator.ts);
  do not remove the cap.

## Out of scope (Phase 5.2 / 5.3 / 5.4)

Tracked in `docs/GO_LIVE/PHASE_5_TODO.md`. Highlights:

- Cloud Armor WAF, TLS-at-LB, private VPC, private-IP DB, Workload Identity
  (blocked on Phase 1 GCP foundation).
- KMS field-level encryption for HPCSA / SANC / child medical conditions
  (Tier-3 follow-up).
- PII redaction in structured logs (depends on Phase 7 Pino integration).
- 2FA enforcement, YubiKey procurement, quarterly access reviews, annual
  pen-test, bug bounty (non-DEV / OPS procurement).
