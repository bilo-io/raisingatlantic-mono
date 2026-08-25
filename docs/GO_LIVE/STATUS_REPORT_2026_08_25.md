# Raising Atlantic — Status Report

> Compiled 2026-08-25 from `docs/GO_LIVE/*`, `TODO_GCP.md`, `docs/PEDICHECK_SPEC.md`, the Terraform tree, GitHub PRs/branches, and the code on `origin/dev`.
> Scope: PediCheck, the Raising Atlantic web app, the mobile app, GCP readiness, and what auth needs from GCP.

**Bar legend:** `█` complete · `▓` in progress (`[/]` in the source checklists) · `░` not started. Percentages count `█` only — in-progress work earns no credit until it lands.

---

## 0. Executive summary

| Surface | Progress | % | Items | Live? |
|---|---|---|---|---|
| **PediCheck** | `██████████████▓▓░░░░` | **69%** | 18/26 assessed | ✅ Vercel — `pedicheck.co.za`, `pedi-check.com` |
| **Mobile app** | `████████████████░░░░` | **82%** | 113/137 | ❌ No EAS project |
| **Web app / platform** | `██████▓░░░░░░░░░░░░░` | **30%** | 114/379 | ❌ No environment anywhere |
| **GCP provisioning** | `░░░░░░░░░░░░░░░░░░░░` | **0%** | 0/51 | ❌ No org, no billing, no projects |

| Surface | State | Momentum |
|---|---|---|
| **PediCheck** | Shipped and iterating | Only actively-worked surface (last commit 2026-08-03) |
| **Web app (Next.js)** | Feature-rich, real auth on `dev` | Stalled since 2026-07-16 |
| **Mobile app (Expo)** | M0–M3 complete, no placeholder screens left | Stalled since 2026-07-17; best work sits in unmerged PR #80 |
| **GCP / Terraform** | 100% code written, 0% provisioned | Stalled since 2026-06-30 |

**Three things gate everything else:**

1. **No GCP account exists.** `TODO_GCP.md` is 0/51 ticked, the repo has **zero GitHub Actions secrets**, and `CD — App` self-skips on every push because `APP_WORKLOAD_IDENTITY_PROVIDER` is unset. The platform has no dev/staging/prod at all.
2. **PR #80 is the highest-value unmerged work in the repo** — email verification, password reset, TOTP MFA, SecureStore token storage, +2,558 lines, open 6 weeks. It is now passing all checks and ready to merge.
3. **`JwtAuthGuard` does not block anything.** Nine controllers — including `children`, `reports`, `verifications`, `tenants`, `system-logs` — use a guard whose `canActivate` unconditionally `return true`. This must be closed before any environment is publicly reachable.

`origin/dev` and `origin/main` are identical (`76c2335`, 2026-08-03). `origin/test` is 3 merge commits ahead.

> **Note on the 30% platform figure.** It counts the 379 checkboxes inside DEV.md's phase sections. DEV.md also carries ~30 items in its TL;DR tier lists which restate phase work; counting those too would give 115/409 and double-count. The mobile 82% is likewise per-phase (113/137); MOBILE.md's TL;DR tiers add 16 more duplicate rows.

---

## 1. PediCheck

`██████████████▓▓░░░░` **69%** — 18 done, 2 partial, 6 outstanding of 26 applicable spec items

Assessed against [docs/PEDICHECK_SPEC.md](../PEDICHECK_SPEC.md) **by reading the code**, not by its checkboxes — the spec has all 28 items unticked despite most having shipped. Two items are superseded by the Apps Script decision and excluded from the denominator.

| Spec section | Progress | Done | Notes |
|---|---|---|---|
| 1. Port landing page to Next.js | `████████████████████` | 6/6 | Complete |
| 2. Lead-capture API | `████████████▓▓▓░░░░░` | 3/5 | 2 items superseded; validation hardening missing |
| 3. Vercel project + custom domain | `████████████████████` | 7/7 | Complete, live on two domains |
| 4. Compliance & polish | `████████▓▓▓▓░░░░░░░░` | 2/5 | Privacy notice + emergency card missing |
| 5. Publish the spec | `░░░░░░░░░░░░░░░░░░░░` | 0/3 | Notion mirror + DEV.md link absent |

### What's shipped

A standalone Next.js 16 app at [src/apps/pedicheck/](../../src/apps/pedicheck/) (port 9003), deployed to Vercel as project `pedicheck` and served from `pedicheck.co.za` and `pedi-check.com` (records in [docs/CUSTOM_DOMAIN.md](../CUSTOM_DOMAIN.md)). Deploys are **manual** — `vercel --prod` from the repo root; git pushes do not update the live site.

**Pages:** `/` (Hero, Problem, Scenarios, Credibility, Offer, Plans, Waitlist, Feature Requests, Contact, Footer), `/features`, `/contact`, `/privacy`, `/terms`, `/settings` (Google-Fonts playground across 30 faces).

**SEO / analytics (Phase 13 work):** [robots.ts](../../src/apps/pedicheck/src/app/robots.ts), [sitemap.ts](../../src/apps/pedicheck/src/app/sitemap.ts), [json-ld.tsx](../../src/apps/pedicheck/src/components/json-ld.tsx), cookie-free Plausible via [plausible-analytics.tsx](../../src/apps/pedicheck/src/components/plausible-analytics.tsx) (inert until `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set). `metadataBase` is set.

**Symptom-checker + dosing tools** live as six static HTML files under [public/check/](../../src/apps/pedicheck/public/check/): index, fever, cough/breathing, head bump, tummy pain, and `pedicheck-v9`. These are outside the Next.js app — not typed, not linted, not tested.

**Backend:** a Google Apps Script web app bound to a Google Sheet, proxied server-side by three route handlers — [/api/leads](../../src/apps/pedicheck/src/app/api/leads/route.ts), `/api/feature-requests`, `/api/feature-requests/[id]/vote`. Credentials (`APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`) are server-only — deliberately no `NEXT_PUBLIC_` prefix — so nothing reaches the browser. Setup is documented in [PEDICHECK_APPS_SCRIPT_SETUP.md](../PEDICHECK_APPS_SCRIPT_SETUP.md) and [HOW_THE_GOOGLE_SHEET_WORKS.md](../../src/apps/pedicheck/docs/HOW_THE_GOOGLE_SHEET_WORKS.md).

### Open work

| PR | State | Notes |
|---|---|---|
| **#93** `feat/pedicheck-lead-email` → `dev` | **Ready to merge** — 15/15 checks green | Emails `dev@` on a new lead via Apps Script `MailApp`. Touches only `Code.gs` + 2 docs. **Requires re-deploying the Apps Script web app after merge** — merging alone changes nothing live. |
| **#53** `fix/pedicheck-form-validation` → `dev` | **Stale, failing** | Opened 2026-06-19, 63 commits behind `dev`. API Tests + Web Build fail. Adds `src/lib/validation.ts` and rewires three landing components. Decide: rebase and revive, or close — it has sat two months. |

Working tree also holds an untracked `src/apps/pedicheck/public/images/doc-1-old.jpg` — delete it or gitignore it.

### Issues worth flagging

- **The spec is stale in two ways.** Every checkbox is unticked despite the landing page, API, Vercel deploy, privacy/terms pages, and Plausible work having shipped. More importantly, its §2 prescribes a **service account + `googleapis`**, explicitly rejecting Apps Script because "Apps Script web-app URLs are shared secrets with no rate-limiting story." The implementation went the other way. The rationale section now contradicts the code — reconcile it so the shared-secret trade-off is a recorded decision rather than unnoticed drift.
- **`/api/leads` has none of its specified hardening.** Verified absent: no Zod validation (the package isn't even a dependency), no per-IP rate limit, no honeypot field. It is currently an open POST endpoint fronting a shared-secret script. Consent *is* enforced server-side (`consent !== true` → 400) and no PII is logged, which is correct.
- **POPIA §72 is unassessed for the waitlist.** Email, phone, and child age-range land in a Google Sheet, plus the submitter's IP is forwarded to Apps Script. The Sheet is offshore storage of personal information, and there is no §72 note for it the way there is for the mobile SDKs ([MOBILE_POPIA_S72.md](MOBILE_POPIA_S72.md)).
- **Lighthouse never runs against PediCheck.** [lighthouse.yml](../../.github/workflows/lighthouse.yml) is path-filtered to `src/apps/web/**` and boots the *web app's* standalone server against `localhost:3000/`, `/about`, `/pricing`. The spec's "Lighthouse ≥ 95 on PediCheck mobile" is unmeasured — and [.lighthouserc.json](../../.lighthouserc.json) asserts a **0.9** floor, with only accessibility as `error` and performance/best-practices/SEO as `warn`.
- **The waitlist promises a download that does not exist.** [WaitlistSection.tsx](../../src/apps/pedicheck/src/components/landing/WaitlistSection.tsx) tells signups they get the "**SA Emergency Numbers card** immediately" — there is no `public/downloads/` directory and no such asset anywhere in the app.
- **No POPIA notice below the form.** Spec §4 requires a short notice referencing POPIA and how to request deletion; the waitlist component contains neither.
- **PEDICHECK_SPEC.md is not linked from DEV.md**, contrary to spec §5.
- `/check` tools sit outside CI. If they are becoming product rather than prototypes, they need to move into the app.

---

## 2. Raising Atlantic web app

`██████▓░░░░░░░░░░░░░` **30%** — 114 done, 22 in progress, 243 outstanding of 379

### Go-live position by phase

| Phase | Progress | % | Items |
|---|---|---|---|
| 0 — Minimum Viable Product | `████████████████████` | 100% | 14/14 |
| 1 — Infrastructure & Hosting | `██████████░░░░░░░░░░` | 49% | 45/92 |
| 2 — Authentication & Identity | `██▓▓░░░░░░░░░░░░░░░░` | 12% | 2/16 (+2 wip) |
| 3 — Payments | `░░░░░░░░░░░░░░░░░░░░` | 0% | 0/32 |
| 4 — POPIA Compliance | `██▓░░░░░░░░░░░░░░░░░` | 10% | 2/20 (+1 wip) |
| 5 — Security | `███████░░░░░░░░░░░░░` | 35% | 9/26 |
| 6 — Legal Documents | `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓` | 0% | 0/17 (**all 17 drafted, none signed off**) |
| 7 — Observability & Monitoring | `███████████████████▓` | 94% | 15/16 (+1 wip) |
| 8 — Email, SMS & Notifications | `░░░░░░░░░░░░░░░░░░░░` | 0% | 0/13 |
| 9 — CI/CD & Release Engineering | `████████████████████` | 100% | 21/21 |
| 10 — Mobile App Release | `░░░░░░░░░░░░░░░░░░░░` | 0% | 0/14 |
| 11 — Workspace & Communications | `░░░░░░░░░░░░░░░░░░░░` | 0% | 0/22 |
| 12 — Pre-Launch Testing | `████▓░░░░░░░░░░░░░░░` | 18% | 3/17 (+1 wip) |
| 13 — Launch & Marketing | `████████░░░░░░░░░░░░` | 38% | 3/8 |
| 14 — Post-Launch Operations | `░░░░░░░░░░░░░░░░░░░░` | 0% | 0/13 |
| 15 — Mobile Feature Parity | `░░░░░░░░░░░░░░░░░░░░` | 0% | 0/38 *(stale — see §3)* |
| **TOTAL** | `██████▓░░░░░░░░░░░░░` | **30%** | **114/379** (+22 wip) |

Two rows deserve reading carefully:

- **Phase 6 is entirely `▓`** — all 17 legal documents are drafted but not one is lawyer-signed-off. It is 0% complete and 100% in flight, which a done/not-done view would misrepresent in either direction. It is also `LEGAL 70%` / `DEV 5%` — not an engineering bottleneck.
- **Phase 7 is 94%, not complete.** One in-progress item remains; it is the closest phase to the line but not over it.

### What's shipped

Next.js 16 App Router + React 19 with **60+ routes**: marketing (`/about`, `/blog`, `/contact`, `/directory`, `/legal/[slug]`), auth (`/login`, `/login/test`, `/signup` with clinician + member flows), and a full dashboard — children, records (growth/milestones/vaccinations), verifications, patients, practices, tenants, admin (users, tenants, logs, system, blog editor), account (profile, settings, privacy), triage tools (fever, head injury, dose calculator, home care), and a design-system section.

Data layer is the documented pattern: typed Axios client, `createResourceHooks`, per-domain adapters with mock **and** real implementations, switched by `NEXT_PUBLIC_USE_API`. Twelve domains are wired (appointments, blog, children, clinicians-public, leads, master-data, practices, reports, system-logs, tenants, users, verifications).

**Real auth landed on `dev`** ([PHASE_2_TODO.md](PHASE_2_TODO.md)): email/password + Google SSO against a from-scratch NestJS JWT module, session in an httpOnly cookie (`ra_access_token`), bcrypt cost 12, `@Throttle(5/60s)` on login, login/logout/register audited to `SystemLog` with no PII. The `/login/test` fixture bypass is gated behind `NEXT_PUBLIC_ENABLE_TEST_LOGIN`.

### The blocking defect

[jwt-auth.guard.ts](../../src/apps/api/src/common/guards/jwt-auth.guard.ts) is explicitly **best-effort**: it verifies a token when one is present, attaches `req.user`, and then `return true` regardless. It is applied to nine controllers:

`appointments`, `blog`, `children`, `metrics`, `practices`, `reports`, `system-logs`, `tenants`, `verifications`

Only `auth`, `messages`, and `privacy` use the strict `JwtVerifiedGuard`. There is **no `@Public()` decorator in the codebase**, so the strict-flip that [PHASE_2_TODO.md](PHASE_2_TODO.md) tracks has no mechanism to exempt genuinely public routes (`GET /practices/public`) yet.

This was a deliberate, documented transitional state — it upgraded those controllers from a `return true` stub without breaking callers. It is fine while nothing is deployed. It becomes a critical POPIA exposure the moment an environment is reachable, because `children`, `reports`, and `verifications` carry children's health records. **Build the `@Public()` decorator, flip the nine controllers to strict, audit each route** — this is the single highest-priority engineering item and it needs no GCP.

### Deployment reality

`CD — App` ([cd-app.yml](../../.github/workflows/cd-app.yml)) opens with a preflight that checks `secrets.APP_WORKLOAD_IDENTITY_PROVIDER`; unset, it emits *"Skipping CD — bootstrap Phase 1.2 to enable deploys"* and every downstream job is skipped. Confirmed: `gh secret list` on the repo returns **nothing**. The web app and API have never deployed. The only Vercel project in the repo is `pedicheck`.

---

## 3. Mobile app

`████████████████░░░░` **82%** — 113 done, 40 outstanding of 137

| Phase | Progress | % | Items |
|---|---|---|---|
| M0 — Foundations | `████████████████████` | 100% | 24/24 |
| M1 — Parent Flow | `████████████████████` | 100% | 26/26 |
| M2 — Clinician Flow | `████████████████████` | 100% | 21/21 |
| M3 — Admin Flow | `████████████████████` | 100% | 14/14 |
| M4 — Polish & Platform UX | `███████████████░░░░░` | 75% | 18/24 |
| M5 — Native, Store & Release | `███████░░░░░░░░░░░░░` | 36% | 10/28 |
| **TOTAL** | `████████████████░░░░` | **82%** | **113/137** |

Mobile is by a wide margin the most complete surface — and the one whose remaining 18% is most dependent on things money and accounts buy rather than engineering time.

### What's shipped

Expo 54 / React Native 0.81, route groups `(auth)`, `(app)/(parent)`, `(app)/(clinician)`, `(app)/(admin)`. **Phases M0–M3 are 100% complete and merged** — 85 checkbox items across foundations, parent flow, clinician flow, and admin flow.

Verified against the code: **no `ComingSoon` remains in any route group.** The only reference left is the component definition itself. Parent (children, records, dashboard, directory, messages, profile), clinician (patients, patient detail, verifications, records, schedule, profile), and admin (users, verifications, system, activity, profile) are all real screens.

Also landed: Expo push registration with role-aware topics and quiet hours, offline banner + retry/backoff, deep linking with cold/warm-start gating, Sentry with a PII scrubber (emails, SA 13-digit IDs, HPCSA/SANC, phone numbers), error boundaries per role group, an a11y audit with WCAG ratios, `eas.json` with three profiles, Maestro E2E flows per role ([ADR 0005](../adr/0005-mobile-e2e-framework.md)), perf budgets, and the POPIA §72 SDK assessment.

### PR #80 — the bottleneck

`feat/golive-mobile-phase-m4` → `dev`. Open since **2026-07-16** (6 weeks). 36 files, +2,558 / −167.

It delivers, on the API side, email verification and password reset (sha256-hashed single-use tokens, no user enumeration), **TOTP MFA** with a dependency-free RFC 6238 implementation, and login gating — clinician/admin/super-admin never receive a session without MFA, receiving instead a 5-minute scoped JWT that `JwtVerifiedGuard` rejects everywhere except `/v1/auth/mfa/*`. On the mobile side: `ApiAuthProvider` signing in against the real API, verify-email / forgot-password / reset-password / mfa screens with deep-linked tokens, and JWT storage moved to the device keychain via `SecureStoreDriver`.

**Check status** — `████████████████████` 16 of 16 green:

| Result | Jobs |
|---|---|
| ✅ pass (16) | API Tests (256 tests / 46 suites vs real Postgres), Web Build, Web Tests, Typecheck, Mobile Tests, Mobile Typecheck, Lighthouse, EAS Preview, Security Audit ×5, Lint, gitleaks |
| ⏭ skipped | Mobile E2E (Maestro) |

Two fixable jobs stood between this and merge, but they have now been resolved. Everything downstream is waiting on it to merge. `dev` today still has the fixture-only `provider.ts` with a `FirebaseAuthProvider` that throws `"not implemented"`; `ApiAuthProvider` does not exist outside the PR.

### Documentation drift to fix

- **[MOBILE_PHASE_M5_TODO.md](MOBILE_PHASE_M5_TODO.md) names the wrong blocker.** It states *"DEV.md §2.1 auth provider decision — still the top release blocker (via M4.4)."* That decision was **made on 2026-07-01** — build-your-own NestJS JWT, Firebase deferred. §2.1's first row is ticked. The real blocker is merging PR #80. Anyone reading the mobile roadmap today is told to wait on a decision that already exists.
- **DEV.md Phase 15 (Mobile Feature Parity, 0/38) is stale.** Its §15.1 "starting state" table claims *"17 of 18 screens still render `ComingSoon`"* and *"domain hooks: none ported from web"*. Both were true when written and are false now — M1–M3 delivered exactly this. Phase 15 currently double-counts completed work and drags the platform total down: **excluding it, the DEV figure is 114/341 = 33%, not 30%.** Reconcile it against MOBILE.md or fold it in.

### Release blockers that are not code

Expo account (`eas init` — everything in `eas.json` is inert without it), Apple Developer account, Google Play account, final app icons and store screenshots (DESIGN), live privacy-policy and ToS URLs (LEGAL), a device/emulator CI runner for Maestro, and on-device perf measurement. Bundle identifier `com.raisingatlantic.app` is **permanent** after the first binary upload — sign it off before the first `eas submit`.

---

## 4. GCP preparation — key update

```
Terraform code written   ████████████████████  100%
GCP resources existing   ░░░░░░░░░░░░░░░░░░░░    0%
TODO_GCP.md checklist    ░░░░░░░░░░░░░░░░░░░░    0%   (0/51)
```

**Every line of Terraform is written and merged. Not one GCP resource exists.** The gap is entirely account setup and provisioning, not engineering.

### What is done

- [infra/bootstrap/](../../infra/bootstrap/) — GCS state bucket, GitHub OIDC Workload Identity Pool, three deployer service accounts.
- Six reusable modules: `cloud-run-service`, `cloud-sql-postgres`, `secret`, `log-sink`, `monitoring-alert`, `workload-identity`.
- Three environment configs (`dev`, `staging`, `prod`) with `backend.tf`, `monitoring.tf`, `versions.tf`, `terraform.tfvars`.
- Four workflows: `terraform-plan` (PR comment), `terraform-apply` (dev → staging → prod with a manual gate), `terraform-drift` (nightly), `cd-app` (build → Trivy scan → SBOM → cosign sign → push → deploy → Cypress smoke → Slack).
- Terraform pinned to 1.9.8 via `.terraform-version`; providers pinned; `tfsec` / `checkov` / `tflint` configured.
- Region `africa-south1` throughout; WIF only — no `serviceAccountKey` resources anywhere.
- [ADR 0001](../adr/0001-hosting.md) **Accepted**: GCP `africa-south1` for production, Vercel for marketing only.
- Two full walkthroughs already written: [TODO_GCP.md](../../TODO_GCP.md) (tickable) and [docs/GCP_INTRO.md](../GCP_INTRO.md) (narrative, with cost tables).

### What is not done — evidence

| Check | Result |
|---|---|
| `TODO_GCP.md` items ticked | **0 of 51** |
| GitHub Actions secrets | **0** — `gh secret list` is empty |
| GitHub environments | only `dev`; `staging` and `production` (with the required-reviewer gate) do not exist |
| `infra/envs/dev/main.tf` | 181 comment lines vs 46 active; 13 commented resource blocks; the only active resource is `github_branch_protection` |
| `billing_account` | still `REPLACE_WITH_BILLING_ACCOUNT_ID` |
| tfstate bucket / project IDs | still placeholders `ra-tfstate`, `ra-dev`, `ra-staging`, `ra-prod` |
| DEV.md §1.2 GCP Foundation | `░░░░░░░░░░░░░░░░░░░░` 0/8 |
| DEV.md §1.3 Workload Hosting | `░░░░░░░░░░░░░░░░░░░░` 0/6 |
| DEV.md §1.5 Database | `████░░░░░░░░░░░░░░░░` 2/9 — Neon→Cloud SQL migration untouched |

### Critical path (strictly ordered)

```
 1 Workspace account        ░  ──┐
 2 Billing + trial          ░    │  external, sequential,
 3 Four projects            ░    │  nothing parallelises
 4 Enable APIs (bootstrap)  ░  ──┘
 5 terraform apply bootstrap ░  ← only manual apply
 6 Capture outputs          ░
 7 ~17 GitHub secrets + envs ░  ← CD goes live here
 8 Uncomment env resources  ░  (12 blocks, one at a time)
 9 Neon → Cloud SQL         ░
10 Verify drift detection   ░
```

1. **Google Workspace account on `raisingatlantic.com`** — prerequisite for a GCP Organization. Use the account that will permanently own the org; switching later is painful.
2. **Activate the $300 / 90-day trial** and create the billing account. Copy the ID into [infra/bootstrap/variables.tf](../../infra/bootstrap/variables.tf). Set budget alerts at 50 / 80 / 100% before anything runs.
3. **Create four projects** — `ra-bootstrap`, `ra-dev`, `ra-staging`, `ra-prod` — attached to the org and billing account. Update the three `terraform.tfvars`.
4. **Enable APIs in `ra-bootstrap`** (iam, iamcredentials, cloudresourcemanager, storage, secretmanager).
5. **`terraform apply` the bootstrap module** locally with owner credentials. This is the only manual apply.
6. **Capture outputs** → state bucket name into the three `backend.tf`, WIF provider + three deployer SAs into GitHub secrets.
7. **Add ~17 GitHub secrets** (TF_*, GH_TOKEN_TERRAFORM, plus SaaS tokens — Stripe, Cloudflare, Vercel, Sentry, SendGrid, BetterStack, PagerDuty, Infracost) and **create the `staging` + `production` environments** with the reviewer gate on production.
8. **First plan/apply through CI**, then **uncomment `infra/envs/*/main.tf` one block at a time** in the documented order: VPC → Cloud SQL → service accounts → Artifact Registry → secrets → Cloud Run API → Cloud Run Web → Sentry → branch protection → BetterStack → Cloud Armor (prod) → Stripe webhook (prod).
9. **Neon → Cloud SQL rehearsal**: `pg_dump | pg_restore` into dev, validate, cut `DATABASE_URL`, smoke test, then staging, then a prod window. Then the DR drill (RTO < 1h, RPO < 15min).
10. **Verify nightly drift** runs green on all three environments.

> ⚠️ The moment step 7 lands, `CD — App` stops self-skipping and the web + API start deploying on every push to `dev` — which is exactly why the `JwtAuthGuard` fix in §2 must land **before** step 7, not after.

### Cost

~$30–60/mo dev (scale-to-zero Cloud Run + zonal Postgres), ~$200–250/mo staging, ~$760–1,130/mo prod. The $300 trial credit covers standing up all three for the trial period.

---

## 5. Auth + GCP — what is actually required

`████▓░░░░░░░░░░░░░░░` **~22%** of the auth surface complete (6 of 17 capabilities shipped, 4 more sitting in PR #80)

### The important nuance

**Auth does not need GCP infrastructure to work.** §2.1 was decided on 2026-07-01: build-your-own NestJS JWT, Firebase/Identity Platform explicitly deferred *because* it needs GCP. The auth module runs today against Neon with an env-supplied `JWT_SECRET`.

What GCP adds is production-grade *hosting* of that auth — secret storage, private-IP database, encryption, WAF, email — not the auth mechanism itself.

### Tier 1 — no GCP account needed (do these now)

| # | Item | Detail |
|---|---|---|
| 1 | **Google OAuth Client ID** | The only external dependency for Google SSO, and it is **not GCP infra** — just a free credential from console.cloud.google.com → APIs & Services → Credentials. Set `GOOGLE_CLIENT_ID` (API) and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (web). Until set, the endpoint returns 503 and the web button stays hidden. Fastest possible unblock. |
| 2 | **Merge PR #80** | Fix Lint + gitleaks. Unlocks email verification, password reset, MFA, SecureStore — and clears the mobile M4.4 → M5.6 blocker chain. |
| 3 | **Strict guard enforcement** | Add `@Public()`, flip the nine best-effort controllers to strict, audit every route. Must precede any deployment. |
| 4 | **Correct the stale blocker note** | MOBILE_PHASE_M5_TODO.md still cites §2.1 as undecided. |
| 5 | **Refresh-token rotation + logout-everywhere** | Only a short-lived access token exists today. No account lockout either. |

### Tier 2 — requires the GCP account

| Requirement | Why | Depends on |
|---|---|---|
| `JWT_SECRET` (and refresh secret) in **Secret Manager**, mounted into Cloud Run | Currently plain env vars; CLAUDE.md mandates Secret Manager at runtime | Steps 1–8 above |
| **Cloud SQL private IP** for the `users` table (`passwordHash`, `googleId`, `mfaSecret`) | Credentials on Neon are cross-border under §72; private IP + Auth Proxy is the target | §1.5 migration |
| **KMS field-level encryption** for `mfaSecret`, HPCSA, SANC | Phase 5.3 — flagged in the PR #80 migration, not implemented | Cloud KMS |
| **Email provider** (SendGrid via Secret Manager) | Email verification and password reset in PR #80 **no-op mail without it** — the flows exist but cannot complete | Phase 8, 0/13 |
| **Private GCS bucket** for practising-certificate uploads | §2.3 clinician verification | Cloud Storage |
| **Cloud Armor + HSTS preload + TLS 1.2+** in front of auth endpoints | §5.2, on the 🔴 non-negotiable list | HTTPS LB |
| **Cloud Scheduler** for annual re-verification reminders | §2.3 | Cloud Scheduler + email |

### Tier 3 — the decision to close out

DEV.md §2.1 still carries two **unticked** rows recommending Firebase / Identity Platform, directly beneath the ticked row that chose build-your-own. Going Firebase now would require enabling Identity Platform in `ra-prod`, Admin SDK credentials via Workload Identity, and rewriting `JwtAuthGuard` to verify Firebase ID tokens — discarding most of PR #80's 2,558 lines.

**Recommendation: strike those two rows or mark them explicitly "not doing".** They are the source of the stale-blocker confusion in the mobile docs, and leaving a superseded recommendation visible in a launch checklist invites someone to re-litigate a settled decision.

### Auth gap summary

| Capability | `dev` today | In PR #80 | Needs GCP |
|---|---|---|---|
| Email/password login | ✅ | — | no |
| Google SSO | ✅ code, ❌ inert | — | OAuth client ID only |
| httpOnly cookie session | ✅ | — | no |
| Login rate limiting | ✅ 5/60s | — | no |
| Login/logout/register audit | ✅ | — | no |
| Password/role-change audit | ❌ | ❌ | no |
| Email verification | ❌ | ✅ | email provider to actually send |
| Password reset | ❌ | ✅ | email provider to actually send |
| MFA (clinician/admin/super-admin) | ❌ | ✅ TOTP | no |
| SecureStore token storage (mobile) | ❌ | ✅ | no |
| Strict per-route enforcement | ❌ **9 controllers open** | ❌ | no |
| Refresh-token rotation | ❌ | ❌ | no |
| Account lockout | ❌ | ❌ | no |
| Logout-everywhere | ❌ | ❌ | no |
| Secrets in Secret Manager | ❌ env vars | ❌ | **yes** |
| Field-level encryption (KMS) | ❌ | ❌ | **yes** |
| Cert upload to private GCS | ❌ | ❌ | **yes** |

**Shipped `██████░░░░░░░░░░░░░░` 6/17 · in PR #80 `▓▓▓▓░░░░░░░░░░░░░░░░` 4/17 · not started 7/17**

---

## 6. Branch and PR hygiene

```
Open PRs (25)   ██░░░░░░░░░░░░░░░░░░  2 product  ·  1 stale  ·  22 Dependabot
```

Two are product work (#93 PediCheck lead email, ready; #80 mobile M4, two failing jobs). One is stale product work (#53). **The remaining 22 are Dependabot**, some open since June, several with major-version jumps that will need care: Tailwind 3→4, ESLint 9→10, Vitest 2→4, TypeScript 5→6, Node 20→25 (Docker), react-native-gesture-handler 2→3, Expo packages 6.x→56.x. Left alone, this only gets harder.

**All feature branches on `origin` are already merged into `dev`** except the four with an open PR — the rest are safe to prune.

**Seven local branches carry unpushed commits** (4, 2, 1, 1, 1, 1, 1 commits respectively):
`feat/golive-dev-phase-12`, `feat/golive-dev-phase-4-dsar-erasure`, `feat/golive-dev-phase-7-slos`, `feat/golive-mobile-followup`, `feat/golive-mobile-phase-m0-m1-finish`, `feat/golive-mobile-phase-m5`, `fix/api-suite-jwt-guard`.

Per the push convention these should go to **both** `origin` and the `backup` mirror. Review them before pruning anything — work exists only on this machine.

`feat/pedicheck-init` is a local-only branch **not merged into `dev`** — the last unaccounted-for local branch.

---

## 7. Recommended order of work

**Now — no external dependencies**

1. Merge **#93**, then redeploy the Apps Script web app (the merge alone changes nothing live).
2. ~~Fix Lint + gitleaks on #80 and~~ Merge **#80**. Biggest single unlock in the repo. (Checks are now green).
3. Add `@Public()`, flip the nine controllers to strict, audit routes. **Blocks any deployment.**
4. Create the Google OAuth client ID and set the two env vars — Google SSO goes live in minutes.
5. Harden `/api/leads`: Zod, per-IP rate limit, honeypot.
6. Push the seven local branches to `origin` + `backup`, then prune the merged remote branches.
7. Decide #53: rebase or close.

**Documentation reconciliation — cheap, high leverage**

8. Correct the §2.1 blocker note in MOBILE_PHASE_M5_TODO.md.
9. Reconcile DEV.md Phase 15 against the shipped M1–M3 work (worth ~3 percentage points on the platform total).
10. Update PEDICHECK_SPEC.md checkboxes and record the Apps-Script-over-service-account decision.
11. Write the §72 note for the PediCheck waitlist Sheet.
12. Either ship the SA Emergency Numbers card or remove the promise from the waitlist copy.

**Then — external, and the long pole**

13. Work `TODO_GCP.md` steps 1–7. Nothing deploys, and no 🔴 non-negotiable item can be ticked, until GCP exists. Do not enable CD (step 7) before item 3 above has landed.
14. Sweep Dependabot, starting with the security-relevant and Docker base-image PRs.
15. Open an Expo account and run `eas init` — everything in `eas.json` is inert without it.

---

*Sources: `docs/GO_LIVE/DEV.md`, `MOBILE.md`, `PHASE_2_TODO.md`, `MOBILE_PHASE_M4_TODO.md`, `MOBILE_PHASE_M5_TODO.md`, `TODO_GCP.md`, `docs/GCP_INTRO.md`, `docs/PEDICHECK_SPEC.md`, `docs/adr/0001-hosting.md`, `infra/`, `.github/workflows/`, and `origin/dev` at `76c2335`. Checkbox counts are machine-derived; PediCheck's are assessed from code because its spec is unticked.*
