# OWASP Top 10 (2021) — Raising Atlantic Audit

> Audit date: 2026-05-28. Re-audit on every PR that touches `auth/`,
> `guards/`, payment webhooks, or data export. See
> [ADR 0003](../adr/0003-app-security-baseline.md) for the baseline.

Each category maps to the **current control** in the codebase and the
**deferred work** that closes the gap. "Deferred" items are tracked in
[`docs/GO_LIVE/PHASE_5_TODO.md`](../GO_LIVE/PHASE_5_TODO.md) or the relevant
phase checklist.

## A01 — Broken Access Control

- **Control:** `JwtAuthGuard` + `RolesGuard` on every non-public endpoint;
  RBAC enforced both client-side (`web/lib/rbac`) and server-side. Tenant
  context is the multi-tenant boundary.
- **Deferred:** systematic audit that every controller has the decorator
  pair (Phase 2 will add a lint rule); cross-tenant query review.

## A02 — Cryptographic Failures

- **Control:** TLS at the edge (Vercel today; Cloud Armor / GLB in Phase 1).
  Database encryption at rest is default-on for Neon / Cloud SQL.
- **Deferred:** field-level encryption for HPCSA / SANC numbers and child
  medical conditions via GCP KMS (Phase 5.3, Tier-3); CMEK on backup
  buckets.

## A03 — Injection

- **Control:** TypeORM parameterised queries everywhere — no string
  concatenation of SQL. Global `ValidationPipe` with
  `whitelist`/`forbidNonWhitelisted`/`transform` rejects unknown properties.
  All 19 DTOs carry `class-validator` decorators (verified). Markdown
  output goes through `react-markdown` (auto-sanitised) — no
  `dangerouslySetInnerHTML` on user content after this PR.
- **Deferred:** none material; revisit when raw SQL or NoSQL stores are
  introduced.

## A04 — Insecure Design

- **Control:** ADRs document load-bearing decisions (hosting, payments, this
  baseline). Parental-consent flow is non-bypassable in the children
  module. Soft-delete + 30-day grace before hard-delete (POPIA erasure).
- **Deferred:** threat-model exercise once Phase 2 auth flows are real.

## A05 — Security Misconfiguration

- **Control:** Helmet applied with safe defaults + HSTS in prod (this PR).
  Strict CORS allowlist (this PR verifies). `synchronize: true` disabled in
  prod. Swagger UI exposed but at `/v1/docs` — acceptable for our threat
  model (small team, no scraping concern); revisit before scale.
- **Deferred:** Cloud Armor WAF + bot management at the LB (Phase 5.2).

## A06 — Vulnerable & Outdated Components

- **Control:** Dependabot weekly across 5 npm workspaces, terraform,
  github-actions, docker (this PR). CI `npm audit --audit-level=high`
  matrix across api/web/mobile/ui/types. Trivy scans built container
  images for CRITICAL CVEs and blocks deploy (existing, Phase 9).
- **Deferred:** switch CI audit from npm to `bun audit` once the toolchain
  fully migrates; Renovate as a possible Dependabot replacement if grouping
  becomes painful.

## A07 — Identification & Authentication Failures

- **Control:** `@nestjs/throttler` registered globally with three tiers and
  a per-user/per-IP tracker (this PR). Public form (`/v1/leads`) capped at
  3/min. Auth-endpoint convention `@Throttle({ short: { limit: 5, ttl:
  60_000 } })` documented for Phase 2.
- **Deferred:** MFA for `CLINICIAN` / `ADMIN` / `SUPER_ADMIN` (Phase 2.2);
  short-lived access tokens + refresh-token rotation; logout-everywhere
  endpoint; account-lockout after N failed attempts.

## A08 — Software & Data Integrity Failures

- **Control:** Container images built once on merge, signed with
  `cosign`, SBOM generated with `syft` (existing, Phase 9). Dependabot
  PRs are reviewed before merge — no auto-merge.
- **Deferred:** supply-chain attestations (SLSA L3) — not a launch
  blocker.

## A09 — Security Logging & Monitoring Failures

- **Control:** `SystemLog` entity captures auth events, role changes, and
  verification decisions. Structured-logging interfaces exist in
  `core/telemetry`.
- **Deferred:** Pino + Cloud Logging shipping (Phase 7.1); Sentry for
  web/API/mobile (Phase 7.3); PII redaction filter in the log pipeline
  (Phase 5.3 + Phase 7).

## A10 — Server-Side Request Forgery (SSRF)

- **Control:** the API does not currently fetch outbound URLs supplied by
  users. Image / PDF upload paths route through GCS-prefixed URLs only.
- **Deferred:** when the verification module starts pulling external
  registry pages, wrap fetches in an allowlist-only HTTP client and reject
  RFC-1918 / link-local responses.

---

## Verification matrix

| Category | Verified by | Frequency |
|---|---|---|
| A01 | `/security-review` on auth-touching PRs | per-PR |
| A02 | manual review on schema changes touching sensitive fields | per-PR |
| A03 | global ValidationPipe + DTO unit tests | CI on every push |
| A04 | ADR review | per-feature |
| A05 | `curl -I` smoke + Helmet test in API e2e | per-PR |
| A06 | `npm audit` matrix in CI; Dependabot PRs | weekly + per-PR |
| A07 | throttler integration test (429 after 11th hit) | CI |
| A08 | cosign verify in deploy gate | per-deploy |
| A09 | runbook review | quarterly |
| A10 | code review against outbound HTTP usage | per-PR |
