# Raising Atlantic Go-Live: `AUDIT` View

> Companion roadmap generated on 2026-07-06 from a full-stack security / PII
> audit of the application (API, web, mobile), infrastructure/CI, and a
> cross-check of the `docs/GO_LIVE/` plan against the codebase on disk.
>
> **This document is analysis only.** No code was changed to produce it. Every
> item below is a remediation task with file:line evidence so it can be picked
> up and executed later.

---

## How to run this with `/golive-phase`

This file follows the **exact structural conventions of `DEV.md`** — `### Phase <N>: Title`
headings, `#### <N>.<M>` sub-sections, `- [ ]` / `- [x]` / `- [/]` checkboxes, a
`**Roles:**` line per phase, and a `> Source:` footer — so `/golive-phase` can browse,
count, plan, and execute its phases identically.

Phases here use an **`S` prefix** (`S0`–`S7`) to avoid colliding with `DEV.md`'s numeric
phases and `MOBILE.md`'s `M` phases. The skill's roadmap resolver currently hard-codes
`DEV.md` and `MOBILE.md` only, so to run a phase from this file, invoke the skill and
when it asks *"Which roadmap?"*, tell it to use `docs/GO_LIVE/AUDIT.md` and the phase token
(e.g. `S0`). Everything downstream — checkbox counting, plan drafting, worktree naming
(`feat/golive-audit-phase-s0`), the `PHASE_S0_TODO.md` file, the PR flow — works as-is.

Phases are ordered by risk: **S0–S1 are release blockers**, S2–S6 are POPIA/hardening
obligations, S7 is doc hygiene.

---

## TL;DR: Severity roll-up

| Sev | Count | Where the worst ones live |
| --- | ---: | --- |
| 🔴 **Critical** | 9 | API auth guards are no-ops (`JwtAuthGuard` always returns `true`); 3 controllers have no guards at all; web auth is spoofable `localStorage` identity; Neon data residency |
| 🟠 **High** | 12 | Cross-tenant IDOR via client-supplied `tenantId`; ungated child/report reads; consent never gated server-side; DSAR/erasure are UI-only stubs; hard-delete cascades; PII to Sentry |
| 🟡 **Medium** | 14 | No record-access audit trail; no web security headers; mobile role-guard bypass; Sentry replay/residency; `roles/editor` CI SA; public `/login/test` |
| 🔵 **Low / hygiene** | many | Console PII, SHA-unpinned actions, dual lockfiles, doc-vs-reality drift |

**The single most important fact:** authentication and authorization on the API are
placeholders. [`JwtAuthGuard.canActivate()`](../../src/apps/api/src/common/guards/jwt-auth.guard.ts#L5-L9)
unconditionally returns `true` and [`RolesGuard`](../../src/apps/api/src/common/guards/roles.guard.ts#L21-L26)
fails open when no user is attached. Every "protected" endpoint holding children's health
data is therefore reachable unauthenticated today. This is expected pre-Phase-2 (auth is
0%), but it means **nothing else in this document can be considered enforced until S0 lands.**

---

## Phases S0 to S7

### Phase S0: Authentication & Authorization Core

**Roles:** `DEV 100%` *(pure engineering; overlaps heavily with `DEV.md` Phase 2 — this phase is the security-audit framing of the same work, plus the missing-guard fixes that Phase 2 does not enumerate)*

Auth is not "thin" — it is absent. The guards exist as classes and are wired onto most
controllers, but they enforce nothing, and three controllers skip them entirely. Until this
phase is done, treat the entire API as public.

#### S0.1 API guard placeholders (🔴 Critical)

- [ ] **[🔴]** `JwtAuthGuard.canActivate()` unconditionally `return true` — verifies no token, attaches no user. Every `@UseGuards(JwtAuthGuard, RolesGuard)` route is open. [common/guards/jwt-auth.guard.ts:5-9](../../src/apps/api/src/common/guards/jwt-auth.guard.ts#L5-L9)
- [ ] **[🔴]** `RolesGuard` fails **open**: when `req.user` is missing it `console.warn`s and `return true`. Because the JWT guard never populates `req.user`, this path is always taken and `@Roles(...)` is a no-op in every environment. [common/guards/roles.guard.ts:21-26](../../src/apps/api/src/common/guards/roles.guard.ts#L21-L26)
- [ ] **[🔴]** No auth subsystem exists at all: no `@nestjs/jwt` / `passport` / `bcrypt` / `argon2` in `src/apps/api/package.json`, no login module, no `password` column on `User`, no token issuance/refresh/rotation/revocation, no lockout. `SystemLog` even defines a `LOGIN_FAILURE` type that is never produced. [users/users.model.ts](../../src/apps/api/src/users/users.model.ts), [system-logs/system-log.model.ts:14](../../src/apps/api/src/system-logs/system-log.model.ts#L14)
- [ ] **[🟡]** `GET /api/dashboard` derives identity from a **client-supplied cookie** `currentUserId` (defaulting to `'user-1'`) with no auth — identity is spoofable. [app.controller.ts:26-36](../../src/apps/api/src/app.controller.ts#L26-L36)

#### S0.2 Controllers with no guard annotations (🔴 Critical)

- [ ] **[🔴]** `MasterDataController` has **no `@UseGuards` / `@Roles`** on the class or any route, yet `GET /records/growth`, `/records/milestones/completed`, `/records/vaccinations/completed` return every child's growth/milestone/vaccination history with the `child` relation attached. Unauthenticated bulk child-health dump. [master-data.controller.ts:8-35](../../src/apps/api/src/master-data/master-data.controller.ts#L8-L35), service at [master-data.service.ts:450-469](../../src/apps/api/src/master-data/master-data.service.ts#L450-L469)
- [ ] **[🔴]** `VerificationsController` fully unauthenticated — returns all clinicians (full unmasked `User`) plus all pending child growth/milestone/vaccination records. [verifications.controller.ts:4-17](../../src/apps/api/src/verifications/verifications.controller.ts#L4-L17), [verifications.service.ts:31-79](../../src/apps/api/src/verifications/verifications.service.ts#L31-L79)
- [ ] **[🔴]** `UsersController` has no guards: `create`, `findAll` (returns every user w/ email+phone), `findOne`, `update`, `remove` (hard delete) are all open. [users.controller.ts:17-53](../../src/apps/api/src/users/users.controller.ts#L17-L53)
- [ ] **[🟠]** Child read routes carry no `@Roles` — `findAll`, `findOne`, `getUnifiedRecords`. Once guards work, a PARENT could still read any family's child. [children.controller.ts:37-50](../../src/apps/api/src/children/children.controller.ts#L37-L50)
- [ ] **[🟠]** Report read routes have no `@Roles` — clinical summary / creche-admission reports readable by any role. [reports.controller.ts:32-37](../../src/apps/api/src/reports/reports.controller.ts#L32-L37)
- [ ] **[🟠]** Appointment read routes have no `@Roles`. [appointments.controller.ts:36-49](../../src/apps/api/src/appointments/appointments.controller.ts#L36-L49)
- [ ] **[🟡]** Swagger UI + `/v1/api-json` are exposed without auth. [main.ts:88-94](../../src/apps/api/src/main.ts#L88-L94)

#### S0.3 Web auth is client-side and spoofable (🔴 Critical)

- [ ] **[🔴]** No `middleware.ts` anywhere — all dashboard gating is a `'use client'` `<RequireRole>` that only `router.replace()`s in a `useEffect`. Protected RSC payloads (children's records) are reachable before hydration. [dashboard/layout.tsx:12](../../src/apps/web/src/app/dashboard/layout.tsx#L12), [components/auth/RequireRole.tsx:36-43](../../src/apps/web/src/components/auth/RequireRole.tsx#L36-L43)
- [ ] **[🔴]** Identity is sent as spoofable `X-User-Id` / `X-User-Role` headers derived from `localStorage` — no bearer token, no cryptographic session. If the API trusts these headers, it is trivial IDOR + privilege escalation. [lib/api/auth-bridge.ts:9-15](../../src/apps/web/src/lib/api/auth-bridge.ts#L9-L15), [lib/api/api-client.ts:21-27](../../src/apps/web/src/lib/api/api-client.ts#L21-L27)
- [ ] **[🔴]** Identity/user list stored in `localStorage` (XSS-theft surface); logout is `localStorage.removeItem` with no server-side invalidation or expiry. [lib/auth.ts:29-124](../../src/apps/web/src/lib/auth.ts#L29-L124)
- [ ] **[🔴]** `PrivateLayout` silently auto-logs-in as a default dummy user when no session is found — a live auth-bypass fallback. [components/layout/PrivateLayout.tsx:149-162](../../src/apps/web/src/components/layout/PrivateLayout.tsx#L149-L162)
- [ ] **[🟡]** Public `/login/test` page lets anyone pick any role/user and log in; only `SUPER_ADMIN` is host-gated. A production role-impersonation console if the route ships. [app/(auth)/login/test/page.tsx:69-84,149-155](../../src/apps/web/src/app/(auth)/login/test/page.tsx#L69-L84)

#### S0.4 Account hardening (cross-links `DEV.md` §2.2)

- [ ] **[🟠]** No password hashing (no bcrypt/argon2), no account lockout, no brute-force protection, no password-reset token handling. (All downstream of S0.1 — there is no credential store to protect yet.)
- [ ] **[🟡]** Short-lived access tokens + refresh-token rotation + logout-everywhere (revocation) — none exist. See `DEV.md` §2.2.

---

> Source: [Phase 2: Authentication & Identity](DEV.md#phase-2-authentication--identity)

### Phase S1: Tenant Isolation & Access Control

**Roles:** `DEV 100%`

The multi-tenant boundary (Tenant → Practice → Clinician) is the critical cross-tenant
security boundary named in `CLAUDE.md`. It is currently not enforced: tenant scoping is
derived from **client-supplied query params**, not from an authenticated principal.

#### S1.1 Cross-tenant IDOR (🔴 Critical)

- [ ] **[🔴]** `tenantId` is a client-supplied `@Query('tenantId')` passed straight into the service; omitting it makes `findAll` return children across **all** tenants (`getMany()` with no scoping). Classic cross-tenant leak. [children.controller.ts:39](../../src/apps/api/src/children/children.controller.ts#L39), [children.service.ts:110-174](../../src/apps/api/src/children/children.service.ts#L110-L174)
- [ ] **[🟠]** Reports query filters only on optional client `childId`; no `childId` → all reports across tenants. [reports.service.ts:72-90](../../src/apps/api/src/reports/reports.service.ts#L72-L90)
- [ ] **[🟠]** Appointments `findAll` filters only on client-supplied `childId` / `clinicianId` / `practiceId` — no tenant scoping. [appointments — findAll](../../src/apps/api/src/appointments/appointments.service.ts)
- [ ] **[🟠]** There is **no mechanism anywhere** that derives tenant context from an authenticated user. Add a tenant-context plumb (from JWT claims) and scope every child/record/report/appointment query by it. (Blocked on S0.)

#### S1.2 Mobile role-based route guards (🟡 Medium)

- [ ] **[🟡]** `app/(app)/_layout.tsx` gates only on authentication, never role; the `(parent)` / `(clinician)` / `(admin)` group layouts contain no role check and render tabs unconditionally. A signed-in parent following a crafted deep link renders admin/clinician UI client-side. [app/(app)/_layout.tsx:9-11](../../src/apps/mobile/app/(app)/_layout.tsx#L9-L11), [(clinician)/_layout.tsx:14](../../src/apps/mobile/app/(app)/(clinician)/_layout.tsx#L14), [(admin)/_layout.tsx:8](../../src/apps/mobile/app/(app)/(admin)/_layout.tsx#L8)
- [ ] **[🟡]** The deep-link gate `router.replace()`s to the pending path after auth with no role validation. [lib/linking/useDeepLinkGate.ts:35-38](../../src/apps/mobile/lib/linking/useDeepLinkGate.ts#L35-L38)
- [ ] **[🟠]** Mobile attaches client-asserted `X-User-Id` / `X-User-Role` headers unconditionally in all builds, and mints an `alg:none` JWT (dev-guarded). The backend contract must **never** trust these once `EXPO_PUBLIC_USE_API=true`. [lib/api/auth-header.ts:15-22](../../src/apps/mobile/lib/api/auth-header.ts#L15-L22), [lib/api/fixture-jwt.ts:20-23](../../src/apps/mobile/lib/api/fixture-jwt.ts#L20-L23)

#### S1.3 Fail-open data adapters (🟠 High)

- [ ] **[🟠]** Web adapters catch API failures and fall back to bundled dummy data (`user`/`practice`/`tenant` adapters + `PrivateLayout`). A 401/outage renders fixture identities instead of failing closed. Should fail closed. [lib/api/adapters/user.adapter.ts:20](../../src/apps/web/src/lib/api/adapters/user.adapter.ts#L20), [practice.adapter.ts:54](../../src/apps/web/src/lib/api/adapters/practice.adapter.ts#L54), [tenant.adapter.ts:24](../../src/apps/web/src/lib/api/adapters/tenant.adapter.ts#L24)
- [ ] **[🟠]** `NEXT_PUBLIC_USE_API` fails **open to mock**: unset/empty/misspelled ⇒ serves bundled mock PII with no API and no auth. Invert to fail-closed (require explicit opt-in to mock). [lib/api/data-source.ts:5-11](../../src/apps/web/src/lib/api/data-source.ts#L5-L11)

---

> Source: [Phase 5: Security](DEV.md#phase-5-security)

### Phase S2: PII in Logs & Telemetry

**Roles:** `DEV 90%` · `OPS 10%`

`CLAUDE.md` forbids PII in logs. The Pino redaction list is good, but several paths
bypass it — Sentry error context, the DB `system_logs` table, and raw `console.*` writes.

#### S2.1 API log/telemetry leakage

- [ ] **[🟡]** Full DTOs (email/phone/name) shipped to Sentry via `reportException(error, { dto })` — Pino's `redact` list does **not** apply to Sentry context, so this bypasses redaction. [users.service.ts:53](../../src/apps/api/src/users/users.service.ts#L53), [tenants.service.ts:34](../../src/apps/api/src/tenants/tenants.service.ts#L34), [examples.service.ts:35](../../src/apps/api/src/examples/examples.service.ts#L35)
- [ ] **[🟡]** Lead PII (email + name) written into `system_logs.message` and `metadata` in plaintext, persisted to the DB and readable by ADMIN/SUPER_ADMIN — outside the redaction control. [leads.service.ts:52-53](../../src/apps/api/src/leads/leads.service.ts#L52-L53), [system-logs.service.ts:19](../../src/apps/api/src/system-logs/system-logs.service.ts#L19)
- [ ] **[🔵]** `console.log(context.age)` in the AI service and `console.warn` in `RolesGuard` write raw to stdout, bypassing Pino redaction. [ai.service.ts:22-25](../../src/apps/api/src/ai/ai.service.ts#L22-L25), [roles.guard.ts:22](../../src/apps/api/src/common/guards/roles.guard.ts#L22)

#### S2.2 Web console PII (🟠 High)

- [ ] **[🟠]** Children's health-record data and contact-form PII logged to the browser console (captured by Sentry breadcrumbs / session replay / extensions). Strip all of these. [children/page.tsx:114](../../src/apps/web/src/app/dashboard/children/page.tsx#L114), [children/[id]/page.tsx:228](../../src/apps/web/src/app/dashboard/children/[id]/page.tsx#L228), [children/[id]/edit/page.tsx:50](../../src/apps/web/src/app/dashboard/children/[id]/edit/page.tsx#L50), [records/growth/page.tsx:169](../../src/apps/web/src/app/dashboard/records/growth/page.tsx#L169), [records/milestones/page.tsx:174](../../src/apps/web/src/app/dashboard/records/milestones/page.tsx#L174), [records/vaccinations/page.tsx:171](../../src/apps/web/src/app/dashboard/records/vaccinations/page.tsx#L171), [patients/page.tsx:160](../../src/apps/web/src/app/dashboard/patients/page.tsx#L160), [contact/page.tsx:45](../../src/apps/web/src/app/contact/page.tsx#L45)
- [ ] **[🟡]** Toasts echo child names and raw `err.message` to the UI; child `[id]` appears in every dashboard URL (server/proxy access logs, browser history, Referer). [children/page.tsx:117](../../src/apps/web/src/app/dashboard/children/page.tsx#L117), [children/[id]/page.tsx:231,273,280](../../src/apps/web/src/app/dashboard/children/[id]/page.tsx#L231)

#### S2.3 Cross-border telemetry — POPIA s72 (🟡 Medium)

- [ ] **[🟡]** Web Sentry has `replaysOnErrorSampleRate: 1.0` — a full replay of the children's-data dashboard is uploaded to Sentry (US/EU SaaS) on any error. `maskAllText` reduces but does not guarantee PII removal; no `beforeSend` scrub on the server config. Add scrubbing / regional endpoint / documented s72 basis before enabling the DSN. [sentry.client.config.ts:14-21](../../src/apps/web/sentry.client.config.ts#L14-L21), [sentry.server.config.ts](../../src/apps/web/sentry.server.config.ts)
- [ ] **[🟡]** Mobile Sentry ships to the default (US) region (`url: https://sentry.io/`) — a cross-border transfer. Scrubbing is thorough (see strengths), so this is residency-only. [app.json:52-58](../../src/apps/mobile/app.json#L52-L58), [lib/sentry/init.ts:17-25](../../src/apps/mobile/lib/sentry/init.ts#L17-L25)

---

> Source: [Phase 5: Security](DEV.md#phase-5-security)

### Phase S3: Consent, Erasure & Data-Subject Rights

**Roles:** `DEV 70%` · `COMPLIANCE 30%`

These are POPIA obligations for special personal information (children's health data)
that the plan *names* (`DEV.md` §4.2) but the code does not yet implement — and in two
cases the UI actively **lies** to the user that they were actioned.

#### S3.1 Parental consent not enforced (🟠 High)

- [ ] **[🟠]** A child health record can be created with **no parental-consent gate**: no consent field on `CreateChildDto`, no `parentalConsent` column on the `Child` entity, no check in `create()`. Contrast the leads flow, which correctly gates on `consent`. Core POPIA gap. [children/dto/create-child.dto.ts](../../src/apps/api/src/children/dto/create-child.dto.ts), [children.service.ts:50-104](../../src/apps/api/src/children/children.service.ts#L50-L104), [children.model.ts:14-75](../../src/apps/api/src/children/children.model.ts#L14-L75)
- [ ] **[🟡]** Mobile parental-consent record is stored **local-only** in AsyncStorage (`@ra/parental-consent`) and never sent to a backend — not auditable, trivially forged, lost on reinstall. The lawful basis for processing must be server-persisted and tamper-evident. [components/children/ParentalConsentModal.tsx:9,56-63](../../src/apps/mobile/components/children/ParentalConsentModal.tsx#L56-L63)

#### S3.2 DSAR / erasure are UI-only stubs (🟠 High)

- [ ] **[🟠]** Mobile POPIA data-export / account-deletion requests are written **only to AsyncStorage** (`@ra/popia-requests`), then a toast falsely says *"We'll be in touch within 30 days as required by POPIA."* Nothing is transmitted server-side; the record is lost on uninstall. Direct data-subject-rights failure. [components/profile/ProfileScreenParent.tsx:144-179](../../src/apps/mobile/components/profile/ProfileScreenParent.tsx#L144-L179)
- [ ] **[🟠]** No DSAR endpoint exists in the API (grep = none) despite `DEV.md` §4.2 line 472 promising a self-service export as JSON + PDF.
- [ ] **[🟠]** No right-to-erasure / hard-delete-after-grace job exists. `DEV.md` §4.2 line 473 names "soft delete with 30-day grace + hard delete after retention expiry" but there is no Cloud Scheduler / cron sweep item and no endpoint.

#### S3.3 Hard-delete cascades destroy PII irrecoverably (🟠 High)

- [ ] **[🟠]** Deletes are physical `repository.remove`, not an `ARCHIVED`-status soft delete, even though a `ResourceStatus.ARCHIVED`/`DELETED` enum exists and is never used for erasure. [children.service.ts:259](../../src/apps/api/src/children/children.service.ts#L259), [users.service.ts:147](../../src/apps/api/src/users/users.service.ts#L147), [reports.service.ts:107](../../src/apps/api/src/reports/reports.service.ts#L107), [tenants.service.ts:80](../../src/apps/api/src/tenants/tenants.service.ts#L80)
- [ ] **[🟠]** `Child` cascades `onDelete: 'CASCADE'` to parent and every sub-record (Growth, CompletedMilestone, CompletedVaccination, Allergy, MedicalCondition); Practice→Tenant cascades too. A single delete can wipe linked clinical history with no audit-preserving path. [children.model.ts:18,82,124,162,217,252](../../src/apps/api/src/children/children.model.ts#L18)

#### S3.4 No access audit trail (🟡 Medium)

- [ ] **[🟡]** There is no audit trail for reads/writes of child records — `SystemLogsService` is written to only by the leads flow. POPIA accountability requires a record of who accessed or modified a minor's health data. [leads.service.ts:50](../../src/apps/api/src/leads/leads.service.ts#L50)

---

> Source: [Phase 4: POPIA Compliance](DEV.md#phase-4-popia-compliance)

### Phase S4: Mobile Client Security & Data-at-Rest

**Roles:** `DEV 100%` *(cross-links `MOBILE.md` M4)*

The mobile app currently runs on fixture auth + mock data, so nothing here is exploitable
today — but each item goes live the moment real auth / real API are switched on. A correct
secure-storage implementation already exists as **dead code**.

- [ ] **[🟠]** Full `User` object (id, name, email, tenantId, practiceIds) is JSON-stringified into **unencrypted** AsyncStorage (`@ra/auth`) on every hydrate/sign-in — recoverable from a device backup or rooted device. A working `expo-secure-store` wrapper (`auth/secure-token.ts`) exists but has **zero call sites**. Wire it in. [auth/storage.ts:16,33-35](../../src/apps/mobile/auth/storage.ts#L16), [auth/types.ts:3-10](../../src/apps/mobile/auth/types.ts#L3-L10), [auth/secure-token.ts](../../src/apps/mobile/auth/secure-token.ts)
- [ ] **[🟡]** No screenshot / app-switcher obscuring on medical-data screens (no `expo-screen-capture` / `FLAG_SECURE` / background blur). Children's growth/milestone/immunisation data is captured in the OS app-switcher snapshot. [components/records/*](../../src/apps/mobile/components/records)
- [ ] **[🔵]** No biometric / PIN app-lock (`expo-local-authentication` absent) — session restored silently from AsyncStorage on relaunch with no re-auth. Advisable for children's health records.
- [ ] **[🔵]** TLS not enforced in config: `EXPO_PUBLIC_API_URL` defaults to `http://localhost:3000` and the zod schema accepts `http://` in any environment — add an `https`-scheme assertion for production. [lib/env.ts:4](../../src/apps/mobile/lib/env.ts#L4)
- [ ] **[🔵]** No `eas.json` / no `expo-updates` config — no OTA channel, runtime-version, or update-signing. Note for update-integrity when EAS is adopted (also `MOBILE.md` M4.5 / M5).

---

> Source: [Phase M4: Polish & Platform UX](MOBILE.md#phase-m4-polish--platform-ux)

### Phase S5: Infrastructure, Secrets & Data Residency

**Roles:** `DEV 70%` · `OPS 30%`

Most GCP resources are deliberately commented out / flag-gated pending the Phase 1 GCP
bootstrap — those are tracked in `DEV.md` Phase 1, not here. The items below are **live
risks today** or **defects in committed IaC** that will ship as-is when the staged blocks
are uncommented.

#### S5.1 Data residency — POPIA s72 (🔴 Critical)

- [ ] **[🔴]** Production/test child-health data currently lives on Neon in `eu-central-1` / `us-east-2` — **not** South Africa — with no signed DPA. The `africa-south1` Cloud SQL module is designed but not applied. This is the headline compliance finding; it resolves only when the DB migration lands. [DEV.md:323](DEV.md#L323), [.env.example:29](../../src/apps/api/.env.example#L29), [adr/0001-hosting.md](../adr/0001-hosting.md)
- [ ] **[🟡]** Vercel projects have no `regions` config — serverless/edge functions default to a US region (`iad1`), and the manual `vercel --prod` deploy captures no IaC/audit trail (config drift vs the "everything in Terraform" principle). [web/vercel.json](../../src/apps/web/vercel.json), [api/vercel.json](../../src/apps/api/vercel.json)

#### S5.2 Secret & state hygiene (🔴 Critical / 🟡 Medium)

- [ ] **[🔴]** No `.gitignore` protection for Terraform state under `infra/` — root `.gitignore` lacks `*.tfstate` / `*.tfvars` / `.terraform/`, and there is no `infra/.gitignore`. A local `terraform apply` writes prod state (containing plaintext Stripe LIVE key, GitHub token, Cloudflare token, SendGrid key, DB password) that an accidental `git add .` could commit.
- [ ] **[🟡]** gitleaks allowlists the **entire** `docs/` tree and `.env.example` — a real secret pasted into any runbook or example file is silently ignored by both PR and nightly scans. [.gitleaks.toml:12-16](../../.gitleaks.toml#L12-L16)

#### S5.3 CI/CD supply chain & least privilege (🟠 High / 🟡 Medium)

- [ ] **[🟠]** `aquasecurity/trivy-action@master` pinned to a moving branch in a job that has GCP WIF auth and pushes prod images — pin to a release SHA. [.github/workflows/cd-app.yml:134,143](../../.github/workflows/cd-app.yml#L134)
- [ ] **[🟠]** Bootstrap grants CI deployer SAs `roles/editor` project-wide (the prescribed binding to uncomment). Replace with a curated custom role before go-live. [infra/bootstrap/main.tf:158-174](../../infra/bootstrap/main.tf#L158-L174)
- [ ] **[🟠]** CMEK promised in docs but absent on all data-at-rest stores: no `google_kms_*` resources anywhere, Cloud SQL module has no `encryption_key_name`, tfstate + log-archive CMEK commented/unset. [infra/modules/cloud-sql-postgres/main.tf](../../infra/modules/cloud-sql-postgres/main.tf), [infra/bootstrap/main.tf:39-42](../../infra/bootstrap/main.tf#L39-L42)
- [ ] **[🟡]** `ci.yml` and `cd-app.yml` have no top-level `permissions:` block (inherit org-default GITHUB_TOKEN, possibly write-all); `cd-app.yml` also never declares `id-token: write`, so WIF OIDC will fail until added. [.github/workflows/ci.yml](../../.github/workflows/ci.yml), [.github/workflows/cd-app.yml](../../.github/workflows/cd-app.yml)
- [ ] **[🟡]** Cloud Run module defaults `allow_public_access = true` (binds `roles/run.invoker` to `allUsers`); commented API/web calls inherit it. Flip default to `false` + explicit opt-in. [infra/modules/cloud-run-service/variables.tf:72-76](../../infra/modules/cloud-run-service/variables.tf#L72-L76)
- [ ] **[🟡]** WIF branch bindings trust `refs/heads/dev` only, but `terraform-apply.yml` triggers `apply-dev`/`apply-staging` from `main` — the pipeline will fail the WIF `attribute.ref` condition. Reconcile before Phase 1.2. [infra/bootstrap/main.tf:121-138](../../infra/bootstrap/main.tf#L121-L138), [.github/workflows/terraform-apply.yml:4-8](../../.github/workflows/terraform-apply.yml#L4-L8)
- [ ] **[🟡]** Stripe TF provider pinned to pre-release `0.0.3` managing LIVE payment products/webhooks — unstable API surface. [infra/envs/prod/versions.tf:17-20](../../infra/envs/prod/versions.tf#L17-L20)
- [ ] **[🔵]** All GitHub Actions pinned by mutable tag, not SHA; `npm audit` in CI is non-blocking (`exit 0`); dual `bun.lock` + `package-lock.json` per app; base images pinned by floating tag not digest. [.github/workflows/ci.yml:216-223](../../.github/workflows/ci.yml#L216-L223)

#### S5.4 API config hardening

- [ ] **[🟡]** CSP disabled in helmet (`contentSecurityPolicy: false`) and dev CORS reflects any origin with `credentials: true`. [main.ts:40,69](../../src/apps/api/src/main.ts#L40)
- [ ] **[🟡]** No security headers on the web app at all — no `headers()` in `next.config.ts`, no CSP / X-Frame-Options / HSTS / Referrer-Policy. This is what would contain the `localStorage` XSS in S0.3. [src/apps/web/next.config.ts](../../src/apps/web/next.config.ts)
- [ ] **[🔵]** `NEXT_PUBLIC_VERCEL_BYPASS_TOKEN` is inlined into the client bundle (any `NEXT_PUBLIC_` var is public); a comment says "never set in Production" but nothing enforces it. [lib/api/api-client.ts:10,16](../../src/apps/web/src/lib/api/api-client.ts#L10)
- [ ] **[🔵]** Dev/preview runs with `synchronize: true` (any non-production `NODE_ENV` auto-alters schema) — drift/accidental column-drop risk in shared preview DBs. [app.module.ts:118](../../src/apps/api/src/app.module.ts#L118)

---

> Source: [Phase 5: Security](DEV.md#phase-5-security)

### Phase S6: POPIA Governance & Documentation Gaps

**Roles:** `COMPLIANCE 50%` · `DEV 30%` · `LEGAL 20%`

Topics that a POPIA children's-health product needs but that **no phase in any current
doc covers, or covers too thinly**. These are gaps in the *plan itself*, surfaced by the
cross-check.

- [ ] **[🟠]** **PAIA manual** (Promotion of Access to Information Act) — mandatory for a South African responsible party, mentioned nowhere in `docs/GO_LIVE/*`. Add to Phase 4/6.
- [ ] **[🟠]** **Data-breach runbook** — `DEV.md` §4.4 names `docs/runbooks/data-breach.md`, but the file does not exist (`docs/runbooks/` holds only `on-call.md`). Author it + notification templates + one tabletop.
- [ ] **[🟡]** **Record-access audit logging** — no checklist item covers logging *who viewed which child's medical record* (distinct from the auth-event log in §2.2). Add it. (Implementation is S3.4.)
- [ ] **[🟡]** **DPIA vs PIIA mismatch** — `MOBILE.md:351` links to a non-existent `DEV.md §4.1 DPIA` anchor; §4.1 is actually "Governance & Legal Basis" containing a **PIIA**. Either add a DPIA section or fix the reference. The per-SDK POPIA s72 assessment demanded by `MOBILE.md` M5.6 has no home in `DEV.md` Phase 4. [MOBILE.md:351](MOBILE.md#L351), [DEV.md:456-461](DEV.md#L456)
- [ ] **[🟡]** **Sub-processor register** — §4.3 says "disclose in privacy policy" but there is no living sub-processor register as a build artifact.
- [ ] **[🟡]** **Break-glass / emergency admin access** — RBAC + quarterly review exist (§5.4) but no break-glass procedure or JIT SUPER_ADMIN elevation for the *app* (§1.4's JIT is developer-GCP only).
- [ ] **[🔵]** **Interim-residency risk item** — the plan documents the target `africa-south1` migration but has no explicit task tracking the interim state (prod data on Neon EU/US) as an accepted, time-boxed risk. (Pairs with S5.1.)
- [ ] **[🔵]** **security.txt / vulnerability disclosure** — `DEV.md` §11.3 has the checkbox; no `security.txt` on disk. Correctly `[ ]`, noted here for the security bundle.
- [ ] **[🔵]** **Pen-test remediation tracking** — §5.4 procures the pen test but no item tracks/closes its findings.

---

> Source: [Phase 4: POPIA Compliance](DEV.md#phase-4-popia-compliance)

### Phase S7: Roadmap Reconciliation

**Roles:** `DEV 100%` *(doc hygiene — no product code)*

The cross-check found the plan documents drifting from the code. These are quick edits
to the checklists themselves so nobody plans off stale numbers.

#### S7.1 Stale checkboxes — reality is ahead of the doc

- [ ] **[🟠]** `DEV.md` Phase 15 (all 38 items `[ ]`, "0%") and `PROGRESS_REPORT_2026_06_27.md` ("17 of 18 ComingSoon screens") are **materially wrong**: `grep ComingSoon src/apps/mobile/app` returns nothing, the mobile data layer (14 hooks, 11 adapters) and real screens are implemented, and `MOBILE.md` correctly shows M0 92% / M1 96% / M2 76% / M3 100% / M4 75%. Reconcile Phase 15 against the M-phases (genuinely-undone: biometric unlock, camera/doc-scan, real-auth cutover, all of M5). [MOBILE.md:11-16](MOBILE.md#L11-L16)
- [ ] **[🟡]** `OPS.md` and `COMPLIANCE.md` are stale role-mirrors — every Phase 5/7 item is `[ ]` even though `DEV.md` marks §5.1 (9 items) and §7.1-7.3 done. Re-sync or add a "source of truth is DEV.md" banner.
- [ ] **[🔵]** Checkbox-count drift: `DEV.md` now totals 379 phase checkboxes vs the progress report's 375 (Phase 1: 92 vs 88). Regenerate the report.

#### S7.2 Inaccurate `[x]` wording — right outcome, wrong description

- [ ] **[🟡]** §5.1 claims "trufflehog in pre-commit" `[x]` — the actual tool is **gitleaks** (`.github/workflows/secret-scan.yml`, `.gitleaks.toml`, `lefthook.yml`). No trufflehog exists. Fix the wording. [DEV.md:512](DEV.md#L512)
- [ ] **[🟡]** §5.1 claims "`bun audit` in CI" `[x]` — CI actually runs an **`npm audit`** matrix. Fix the wording. [DEV.md:511](DEV.md#L511)
- [ ] **[🔵]** "Authored ≠ operational": Phases 1/7/9 are marked done/100% but are gated behind a non-existent GCP org (deploy jobs fail "service not found"; every `enable_*` flag defaults `false`). Add an "authored, not yet operational" marker so readiness isn't over-stated.
- [ ] **[🔵]** ADR path casing: `DEV.md:180,396` reference `docs/ADR/` (uppercase); the directory is `docs/adr/` — 404s on Linux/CI link-checkers. [DEV.md:180](DEV.md#L180)

#### S7.3 Blockers worth re-checking now

- [ ] **[🔵]** These blocked items may be unblockable without GCP: §7.4 SLO sign-off (ADR 0004 already drafted), verification PATCH endpoints + `hpcsa_number` column (pure backend, no infra dep), §2.1 auth-provider decision (a choice), §5.3 encryption-at-rest doc (doc-only), Sentry/BetterStack SaaS sign-ups (independent of GCP).

---

> Source: [Go-Live Progress Report](PROGRESS_REPORT_2026_06_27.md)

---

## Appendix A — Sensitive-field inventory (for the Phase 5.3 KMS work)

All columns below are stored **plaintext** today (expected — field-level KMS encryption is
`DEV.md` §5.3, Tier-3). This is the inventory to encrypt when that lands:

- **Child** — `name`, `firstName`, `lastName`, `gender`, `dateOfBirth`, `notes`, `imageUrl` [children.model.ts:24-49](../../src/apps/api/src/children/children.model.ts#L24)
- **MedicalCondition** — `conditionName`, `diagnosisDate`, `notes` [children.model.ts:257-263](../../src/apps/api/src/children/children.model.ts#L257)
- **Allergy** — `allergen`, `severity`, `notes` [children.model.ts:220-230](../../src/apps/api/src/children/children.model.ts#L220)
- **CompletedVaccination** — `vaccineId`, `batchNumber`, `manufacturer`, `administeredByName`, `clinicName` [children.model.ts:167-193](../../src/apps/api/src/children/children.model.ts#L167)
- **GrowthRecord** — `height`, `weight`, `headCircumference`, `notes` [children.model.ts:90-99](../../src/apps/api/src/children/children.model.ts#L90)
- **CompletedMilestone** — `milestoneId`, `dateAchieved`, `notes` [children.model.ts:129-135](../../src/apps/api/src/children/children.model.ts#L129)
- **Report** — `content` (jsonb clinical), `pdfUrl` [reports.model.ts:37-40](../../src/apps/api/src/reports/reports.model.ts#L37)
- **User** — `name`, `email`, `phone`; **ClinicianProfile** — `bio` [users.model.ts:22-28](../../src/apps/api/src/users/users.model.ts#L22)
- **Practice** — `address`, `phone`, `email`; **Tenant** — `email`, `phone` [practices.model.ts:26-42](../../src/apps/api/src/practices/practices.model.ts#L26)

> **Note the mismatch:** the Pino redaction list references `hpcsaNumber` / `sancNumber` /
> `practiceNumber` / `idNumber` ([redact-paths.ts:26-31](../../src/apps/api/src/common/logger/redact-paths.ts#L26-L31))
> but **no entity currently has HPCSA/SANC/national-ID columns**. Reconcile when the
> clinician-verification schema (`DEV.md` §2.3) is built — either the columns are missing
> from the model or the redaction list is aspirational.

## Appendix B — Confirmed-good controls (strengths, not gaps)

So the report distinguishes true misses from work already done well:

- Global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted` + `transform`; create DTOs decorated, update DTOs inherit via `PartialType`; report `content` depth-bounded by `MaxObjectDepth`. [main.ts:73-79](../../src/apps/api/src/main.ts#L73-L79)
- Structured Pino logging with a comprehensive POPIA redaction path list + correlation-id middleware; helmet + prod HSTS; prod CORS allowlist; multi-tier + per-route rate limiting (leads pinned 3/min).
- `synchronize:false` in prod; migration-based schema; Sentry global filter wired.
- Public clinician directory masks email/phone; notification adapter redacts recipient email; lead PII persisted to Sheets only with explicit `consent === true`.
- **Mobile**: React Query is in-memory only (no child data cached to disk); push payloads carry no PII (scrub guard + role-scoped topics); Sentry scrubbing is thorough (`sendDefaultPii:false`, `beforeSend` redacts emails/SA-IDs/HPCSA/SANC/phones); no PII in logs; no clipboard/WebView usage; minimal permissions; fixtures use `@example.test`.
- **Infra**: Workload Identity Federation everywhere (zero SA JSON keys); all resources region-locked to `africa-south1`; Cloud SQL hardened (private IP only, `ENCRYPTED_ONLY`, PITR, `deletion_protection` in prod, `record_client_address = false`); GCS buckets UBLA + public-access-prevention + versioning; branch protection + prod approval gate in IaC; gitleaks on PR/push/nightly; CI runs lint+typecheck+tests+build; CD adds Trivy CRITICAL gate + SBOM + cosign + canary/rollback; broad Dependabot coverage.
- **Web**: only two `dangerouslySetInnerHTML` uses, both safe (typed chart CSS + `react-markdown`); no third-party analytics/trackers; synthetic fixture PII; OG meta is static (no PII); PDF export is client-side only.
