# Raising Atlantic Go-Live: `PRODUCT` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `PRODUCT` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** Product and business decisions: pricing, scope, B2B negotiation, store-listing copy, hosting cost trade-offs.

**Phase involvement:**

- [Phase 1: Infrastructure & Hosting Decision](#phase-1-infrastructure--hosting-decision): `PRODUCT 10%`
- [Phase 2: Authentication & Identity](#phase-2-authentication--identity): `PRODUCT 10%`
- [Phase 3: Payments](#phase-3-payments): `PRODUCT 30%`
- [Phase 6: Legal Documents](#phase-6-legal-documents): `PRODUCT 25%`
- [Phase 10: Mobile App Release](#phase-10-mobile-app-release): `PRODUCT 25%`
- [Phase 12: Pre-Launch Testing](#phase-12-pre-launch-testing): `PRODUCT 25%`
- [Phase 13: Launch & Marketing](#phase-13-launch--marketing): `PRODUCT 20%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `PRODUCT` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `PRODUCT` are marked N/A.

### 🔴 Required (non-negotiable) before release

The minimum viable launch list. Skip any of these and we are either non-compliant, insecure, or unable to operate.

**Roles:** `DEV 45%` · `COMPLIANCE 15%` · `LEGAL 12%` · `PRODUCT 10%` · `OPS 10%` · `FINANCE 5%` · `CLINICAL 3%` *(over half of this tier is non-engineering, Information Officer, DPAs, lawyer-reviewed legal docs, Stripe KYC, beta recruitment)*

**`PRODUCT` + `FINANCE`: payments enablement**

- [ ] **Stripe live** with at least one paying tier wired end-to-end (KYC, SARS VAT, CIPC docs, pricing tiers) ([§3.2](#32-stripe-setup)–[§3.5](#35-compliance))

**`CLINICAL` + `PRODUCT`: beta validation**

- [ ] **Closed beta with ≥1 real practice for ≥30 days**, zero P0 bugs in last 14 days ([§12.4](#124-closed-beta))

### 🟠 Follow-up Tier 1 (release week + first month)

Not strictly blocking, but embarrassing or risky if they slip past week 4 of being live.

**Roles:** `DEV 50%` · `OPS 15%` · `MARKETING 10%` · `DESIGN 10%` · `PRODUCT 5%` · `FINANCE 5%` · `SUPPORT 5%` *(branded emails, Slack workspace, helpdesk inbox, mobile-store listings, Xero setup all need stakeholder hands)*

**`PRODUCT` + `DESIGN` + `DEV`: mobile store launch**

- [ ] **Mobile app submitted** to Apple App Store + Google Play (web typically launches first; mobile follows in week 1–4) ([§10](#phase-10-mobile-app-release))

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

Conversion-uplift and ops-quality work that pays back fast once real users are flowing.

**Roles:** `DEV 50%` · `MARKETING 20%` · `DESIGN 15%` · `PRODUCT 10%` · `OPS 5%` *(press kit, multi-language QA validation, LinkedIn launch, content calendar all sit with stakeholders)*

**`PRODUCT` + `DEV`: billing UX**

- [ ] **[Ozow](https://ozow.com) as second checkout option** for parent paid tier ([§3.6](#36-ozow-integration-fast-follow-post-launch))
- [ ] **Stripe Customer Portal** embedded at `/dashboard/account/billing` ([§3.4](#34-billing-ux))

### 🟢 Follow-up Tier 3 (first quarter post-launch)

Maturity work, the shift from "launched" to "grown-up".

**Roles:** `DEV 55%` · `OPS 25%` · `COMPLIANCE 10%` · `PRODUCT 10%` *(quarterly DR drills, access reviews, annual POPIA review, YubiKey rollout, GA-readiness sign-off live with stakeholders)*

**`PRODUCT` + `DEV`: readiness sign-off**

- [ ] **Open beta → general availability** transition ([§12.4](#124-closed-beta))

### 🔵 Future work (likely outside this document's scope)

On the radar but not load-bearing for the SA launch. Re-evaluate at the 6-month mark; some of these may belong in their own RFCs rather than this checklist.

**Roles:** `PRODUCT 30%` · `DEV 30%` · `COMPLIANCE 15%` · `LEGAL 10%` · `FINANCE 5%` · `CLINICAL 5%` · `MARKETING 5%` *(mostly strategic decisions, African expansion, SOC 2 / HIPAA scoping, advisory-board recruitment, R&D incentive, `DEV` only does the engineering follow-through)*

**`PRODUCT` + `DEV`: strategic product expansion**

- [ ] **African-market expansion**: revisit [Paystack](https://paystack.com) for Nigeria / Ghana / Kenya ([§3.1](#31-provider-selection-stripe-vs-paystack-vs-ozow))
- [ ] **API public/partner program** with rate-limited keys and developer portal

**`COMPLIANCE` + `PRODUCT`: enterprise / international compliance**

- [ ] **SOC 2 Type 1 audit** if pursuing enterprise tenants (medical-aid schemes, hospital groups)
- [ ] **HIPAA / HITRUST readiness** if entering the US market

**`LEGAL` + `PRODUCT` + `DEV`: B2B contracting**

- [ ] **B2B self-serve Master Services Agreement portal** for new tenants ([§6.2](#62-role-specific-agreements))

**`CLINICAL` + `PRODUCT`: clinical governance**

- [ ] **External clinical advisory board** of registered paediatricians beyond the launch reviewer ([§12.2](#122-manual--exploratory))

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `PRODUCT` share are marked N/A with a back-link.

### Phase 0: Minimum Viable Product

N/A. See [Phase 0: Minimum Viable Product](../GO_LIVE.md#phase-0-minimum-viable-product) in the source document for context.

### Phase 1: Infrastructure & Hosting Decision

**Roles:** `DEV 90%` · `PRODUCT 10%` *(`PRODUCT` signs off on cost trade-offs and hosting strategy; `DEV` executes everything else)*

The single biggest pre-launch decision: stay on Vercel or migrate to [Google Cloud Platform](https://cloud.google.com). Making the wrong call here is expensive to undo, so it's worth resolving this **before** wiring up payments, observability, and compliance, because each of those depends on where the workloads live.

#### 1.1 Vercel vs GCP: Decision Framework
In plain terms: Vercel is fast to ship on but charges premium prices, has no native data residency in South Africa, and is awkward for long-running NestJS workloads. GCP gives us [`africa-south1`](https://cloud.google.com/about/locations#africa) (Johannesburg) for POPIA-friendly residency, predictable enterprise pricing, and far more control, but we take on more ops work.

- [ ] Decide hosting target (recommendation: **GCP `africa-south1`** for production, keep Vercel only for marketing preview deploys)
- [ ] Document the decision and rationale in `docs/ADR/0001-hosting.md`
- [ ] Inventory every Vercel-specific assumption in code (Edge runtime, [Vercel KV](https://vercel.com/docs/storage/vercel-kv), image optimization, ISR) and confirm portability
- [ ] Estimate 12-month cost on each platform at projected traffic

#### 1.2 GCP Foundation (recommended path)
If we go with GCP, we set up the bones once and never have to revisit them. This is the "boring infrastructure" everything else sits on top of. **Hard rule: every item below is provisioned via Terraform from the start (see [§1.4](#14-infrastructure-as-code-terraform--github-actions)), no click-ops in the GCP console for anything that touches a deployable environment.**

- [ ] Create GCP organization tied to a `raisingatlantic.com` domain on [Google Workspace](https://workspace.google.com)
- [ ] Set up billing account with budget alerts at 50%/80%/100% of monthly cap (defined in Terraform)
- [ ] Create separate projects per environment: `ra-prod`, `ra-staging`, `ra-dev` (via `google_project` resources)
- [ ] Enable APIs: [Cloud Run](https://cloud.google.com/run), [Cloud SQL](https://cloud.google.com/sql), [Secret Manager](https://cloud.google.com/secret-manager), [Cloud Storage](https://cloud.google.com/storage), [Artifact Registry](https://cloud.google.com/artifact-registry), [Cloud Build](https://cloud.google.com/build), [Cloud Logging](https://cloud.google.com/logging), [Cloud Monitoring](https://cloud.google.com/monitoring), [Error Reporting](https://cloud.google.com/error-reporting), [Cloud Armor](https://cloud.google.com/armor), [Cloud CDN](https://cloud.google.com/cdn) (via `google_project_service`)
- [ ] Set up IAM with least-privilege service accounts (one per workload, never reuse)
- [ ] Enable [Organization Policies](https://cloud.google.com/resource-manager/docs/organization-policy/overview): domain-restricted sharing, disable service-account-key creation, enforce uniform bucket-level access
- [ ] Enable [VPC Service Controls](https://cloud.google.com/vpc-service-controls) around `ra-prod` so prod data cannot be exfiltrated to dev/staging
- [ ] Set the default region to `africa-south1` (Johannesburg) and reject resources outside it via Org Policy

#### 1.3 Workload Hosting Layout
A practical layout for where each piece of the app actually runs.

- [ ] **API** → Cloud Run service (`ra-api-prod`) behind a [Global HTTPS Load Balancer](https://cloud.google.com/load-balancing/docs/https) + Cloud Armor
- [ ] **Web** → Cloud Run service (Next.js standalone build) OR keep on Vercel for marketing only
- [ ] **Static assets / blog images** → Cloud Storage bucket with Cloud CDN in front
- [ ] **Background jobs** (vaccination reminders, EPI schedule recalculation) → [Cloud Run Jobs](https://cloud.google.com/run/docs/create-jobs) + [Cloud Scheduler](https://cloud.google.com/scheduler)
- [ ] **Email queue** → [Pub/Sub](https://cloud.google.com/pubsub) topic consumed by a Cloud Run worker
- [ ] **DNS** → [Cloud DNS](https://cloud.google.com/dns) with DNSSEC enabled

#### 1.4 Infrastructure as Code ([Terraform](https://www.terraform.io) + [GitHub Actions](https://github.com/features/actions))
The single most important rule of this go-live: **no one should ever have to log into the GCP console to change anything in production**. Every project, IAM binding, Cloud Run service, Cloud SQL instance, DNS record, secret, monitoring alert, and budget is described in Terraform under version control, reviewed via PR, and applied by GitHub Actions. The benefits are concrete: full audit trail (every change is a Git commit), free disaster recovery (re-apply in a new region in an afternoon), no "what did we click last Tuesday?" debugging, and POPIA evidence on demand.

##### Repository layout
- [ ] Create a top-level `infra/` directory in the monorepo (or a sibling `raisingatlantic-infra` repo if we'd rather isolate blast radius)
- [ ] Suggested layout:
  ```
  infra/
  ├── modules/                  # Reusable: cloud-run-service, cloud-sql, vpc, …
  │   ├── cloud-run-service/
  │   ├── cloud-sql-postgres/
  │   ├── secret/
  │   ├── monitoring-alert/
  │   └── workload-identity/
  ├── envs/
  │   ├── dev/
  │   ├── staging/
  │   └── prod/
  ├── bootstrap/                # One-off: org, billing, tf-state bucket, GH OIDC
  └── README.md
  ```
- [ ] Pin Terraform version with `.terraform-version` ([`tfenv`](https://github.com/tfutils/tfenv) / [`mise`](https://mise.jdx.dev)), recommend Terraform `>= 1.9` or **[OpenTofu](https://opentofu.org) 1.8** if we want to dodge HashiCorp's BSL licensing
- [ ] Pin all provider versions in `versions.tf` (no floating `~>`)

##### State & bootstrap
The chicken-and-egg problem: we need a state bucket before we can manage anything in Terraform.

- [ ] One-time `bootstrap/` module run **manually** to create: a dedicated `ra-tfstate` GCS bucket (versioning + object lock + CMEK), the GitHub OIDC [Workload Identity Pool](https://cloud.google.com/iam/docs/workload-identity-federation), and the deployer service accounts
- [ ] After bootstrap, commit the state bucket name and import the bootstrap resources into Terraform itself, so the bootstrap module manages itself going forward
- [ ] Remote state in GCS with state-locking ([GCS native locking](https://cloud.google.com/docs/terraform/resource-management/store-state), no separate DynamoDB needed)
- [ ] Per-environment state files (`envs/prod/terraform.tfstate`, etc.), never share state across envs

##### Provider coverage
Most things we need a Terraform provider for are already first-class. Some are not.

- [ ] **[`hashicorp/google`](https://registry.terraform.io/providers/hashicorp/google/latest/docs) + [`google-beta`](https://registry.terraform.io/providers/hashicorp/google-beta/latest/docs)**: GCP core (Cloud Run, Cloud SQL, IAM, networking, Secret Manager, monitoring, Cloud DNS)
- [ ] **[`integrations/github`](https://registry.terraform.io/providers/integrations/github/latest/docs)**: repo settings, branch protection, environments, secrets
- [ ] **[`stripe/stripe`](https://registry.terraform.io/providers/stripe/stripe/latest/docs)** (community), products, prices, webhook endpoints
- [ ] **[`cloudflare/cloudflare`](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)**: only if we put [Cloudflare](https://www.cloudflare.com) in front of Cloud DNS (optional, but nice for WAF + DDoS as a second layer)
- [ ] **[`vercel/vercel`](https://registry.terraform.io/providers/vercel/vercel/latest/docs)**: if we keep marketing on Vercel, manage projects + envs from Terraform
- [ ] **[`neondatabase/neon`](https://registry.terraform.io/providers/kislerdm/neon/latest/docs)** (community), if we stay on Neon
- [ ] **[`PagerDuty`](https://registry.terraform.io/providers/PagerDuty/pagerduty/latest/docs) / [`BetterStack`](https://registry.terraform.io/providers/BetterStackHQ/better-uptime/latest/docs) / [`Sentry`](https://registry.terraform.io/providers/jianyuan/sentry/latest/docs) / [`SendGrid`](https://registry.terraform.io/providers/Trois-Six/sendgrid/latest/docs) / [`1Password`](https://registry.terraform.io/providers/1Password/onepassword/latest/docs)**: every SaaS in our stack with a TF provider goes in IaC
- [ ] Use the **[`tfe` / Terraform Cloud provider](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs)** only if we want [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) as backend, otherwise GCS is fine

##### GitHub Actions ↔ GCP authentication
We should **never** put a GCP service-account JSON key in a GitHub secret. Use [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation) instead, short-lived OIDC tokens, no long-lived keys.

- [ ] Bootstrap a Workload Identity Pool + Provider in `ra-prod` for `token.actions.githubusercontent.com`
- [ ] One deployer service account per environment (`tf-deployer-prod@ra-prod.iam.gserviceaccount.com`, etc.) with scoped IAM
- [ ] Restrict the WIF binding to specific repo + branch (`repo:bilo-lwabona/raisingatlantic-mono:ref:refs/heads/main`), prevents PRs from arbitrary forks from assuming the role
- [ ] In each workflow: [`google-github-actions/auth@v2`](https://github.com/google-github-actions/auth) with `workload_identity_provider` + `service_account` (no `credentials_json`)
- [ ] Store nothing in `GITHUB_SECRETS` for GCP auth other than the WIF provider resource name

##### GitHub Actions pipelines for Terraform
Two workflows is enough; resist the urge to over-engineer.

- [ ] **`.github/workflows/terraform-plan.yml`**: runs on every PR that touches `infra/**`:
  - [ ] `terraform fmt -check`, `terraform validate`, [`tflint`](https://github.com/terraform-linters/tflint), [`tfsec`](https://github.com/aquasecurity/tfsec) / [`checkov`](https://www.checkov.io) for security policy violations
  - [ ] `terraform plan -out=tfplan` per affected env, posted as a sticky PR comment
  - [ ] Cost diff via **[Infracost](https://www.infracost.io)** posted in the same PR comment
  - [ ] Required for merge, block on plan failure or security findings
- [ ] **`.github/workflows/terraform-apply.yml`**: runs on push to `main` (after merge):
  - [ ] `dev` applies automatically
  - [ ] `staging` applies automatically after `dev` succeeds
  - [ ] `prod` requires manual approval via a [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) with required reviewers (only one approver today, but the gate is still there)
  - [ ] Apply uses the merged-PR plan if reachable; otherwise re-plans and confirms parity
  - [ ] Notifies `#deploys` Slack channel on apply (success + failure)
- [ ] No one, not even an admin, can `terraform apply` from a laptop against `prod`. IAM denies it. CI is the only path.

##### Secrets management
- [ ] **GCP Secret Manager** as the single source of truth at runtime, Cloud Run mounts secrets directly
- [ ] Secrets are *created* by Terraform but their *values* are written separately (either via `gcloud secrets versions add` once, or via a sealed-secrets workflow), Terraform should know a secret exists, not what's in it
- [ ] Use `lifecycle { ignore_changes = [secret_data] }` so Terraform doesn't fight value rotations
- [ ] No secrets ever in GitHub Actions logs (`::add-mask::` for any echoed value)
- [ ] Rotate the deployer service-account WIF binding annually (calendar reminder)

##### What Terraform manages: the full inventory
Treat this as the contract. If it's in production and not in this list, document why.

- [ ] GCP projects, billing links, API enablement, org policies
- [ ] VPC, subnets, firewall rules, NAT, [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect)
- [ ] Cloud Run services (API, web, workers), image tag updated by the **app** CI pipeline, not infra (see [§9](#phase-9-cicd--release-engineering))
- [ ] Cloud SQL Postgres instance, databases, users, backup config, replicas
- [ ] Cloud Storage buckets (assets, backups, tfstate) with lifecycle + retention
- [ ] Artifact Registry repositories
- [ ] Cloud DNS zones + records
- [ ] HTTPS Load Balancer, Cloud Armor policies, Cloud CDN
- [ ] IAM service accounts, roles, bindings, WIF pools/providers
- [ ] Secret Manager secret resources (not values)
- [ ] Cloud Monitoring dashboards, alert policies, uptime checks, notification channels (Slack, PagerDuty)
- [ ] Cloud Logging sinks (long-term archive, [BigQuery](https://cloud.google.com/bigquery) export for analytics)
- [ ] Cloud Scheduler jobs (vaccination reminders, EPI recompute, nightly DB exports)
- [ ] Pub/Sub topics + subscriptions
- [ ] Budgets + budget alerts
- [ ] GitHub repo settings, branch protection rules, environments, repo-level secrets, required status checks
- [ ] Stripe products + prices + webhook endpoints
- [ ] Sentry projects, alert rules, DSN issuance
- [ ] SendGrid sending domains, DKIM/SPF/DMARC records (DMARC record itself lives in Cloud DNS via TF)
- [ ] PagerDuty / BetterStack services, escalation policies, integrations

##### What Terraform does **not** manage
Out of scope is just as important as in-scope.

- [ ] Application code deploys (that's the app pipeline, TF only manages the Cloud Run service shell, not the image tag of each release)
- [ ] Database schema ([TypeORM](https://typeorm.io) migrations remain the schema source of truth)
- [ ] User-generated data, blog content, runtime feature flags
- [ ] Per-developer GCP IAM grants for ad-hoc debugging (use just-in-time access via `gcloud iam service-accounts add-iam-policy-binding` with a 1-hour TTL, not a permanent TF binding)

##### Drift & policy
Even with IaC discipline, things drift. Catch it early.

- [ ] Nightly GitHub Actions cron: `terraform plan` on every env, fail-and-notify if non-empty
- [ ] **[OPA](https://www.openpolicyagent.org) / [Conftest](https://www.conftest.dev)** or **`tfsec`** policy gates in PR (no public buckets, no `0.0.0.0/0` SSH, no `serviceAccountKey` resources, no resources outside `africa-south1`)
- [ ] Quarterly review: anything imported manually gets either codified or destroyed
- [ ] When the [Information Regulator](https://inforegulator.org.za) asks "who has access to production?", the answer is `git log infra/envs/prod/iam.tf`: that is the audit

#### 1.5 Database: Neon vs Cloud SQL
We're currently on Neon. Neon is excellent for dev velocity (branches, serverless) but has two issues for this project: (1) data lives in `eu-central-1` / `us-east-2`: not South Africa, which is awkward under POPIA, and (2) it's a third-party processor we'll need a DPA from.

- [ ] Decide: stay on Neon (sign DPA, document cross-border transfer) **or** migrate to [Cloud SQL Postgres](https://cloud.google.com/sql/postgresql) in `africa-south1`
- [ ] If staying on Neon: confirm region, sign DPA, configure point-in-time recovery, set up read replica
- [ ] If migrating: provision Cloud SQL Postgres 15, enable HA + automated backups + 7-day PITR, run a one-time `pg_dump | pg_restore` rehearsal in staging
- [ ] Lock down access: private IP only, [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy) from Cloud Run, no public IP
- [ ] Generate strong rotating credentials in Secret Manager (never in `.env`)
- [ ] Set up nightly logical backups exported to a separate GCS bucket with object versioning + 30-day retention
- [ ] Replace `synchronize: true` with explicit migrations for production (already partially done in `db/migrations/`)
- [ ] Test a full DR drill: drop the database, restore from backup, confirm RTO < 1h and RPO < 15min

---

> Source: [Phase 1: Infrastructure & Hosting Decision](../GO_LIVE.md#phase-1-infrastructure--hosting-decision)

### Phase 2: Authentication & Identity

**Roles:** `DEV 90%` · `PRODUCT 10%` *(provider choice has cost and UX implications `PRODUCT` must weigh in on)*

Right now there's a JWT auth guard but the registration / password-reset / MFA story is thin. For a healthcare product holding minor children's records, this layer has to be airtight.

#### 2.1 Auth Provider Decision
Building auth from scratch for a regulated product is a long, thankless job. Buy it.

- [ ] Decide: build our own NestJS auth (current direction) vs. **[Firebase Auth](https://firebase.google.com/docs/auth) / [Identity Platform](https://cloud.google.com/identity-platform)** vs. **[Auth0](https://auth0.com) / [Clerk](https://clerk.com) / [Stytch](https://stytch.com) / [Supabase Auth](https://supabase.com/auth)**
- [ ] Recommendation: **Firebase Auth / GCP Identity Platform**: same ecosystem as the rest of the infra, supports MFA, SAML, OIDC, magic links, and works on web + mobile out of the box
- [ ] If Firebase: integrate via [Admin SDK](https://firebase.google.com/docs/admin/setup) on the NestJS side, validate ID tokens in `JwtAuthGuard`

#### 2.2 Account Security Hardening
The user-facing controls that prevent account takeover.

- [ ] Email verification required before first login
- [ ] Password reset flow (magic-link or token-based), wired through [`nodemailer`](https://nodemailer.com) or [SendGrid](https://sendgrid.com)
- [ ] Mandatory MFA for `CLINICIAN`, `ADMIN`, `SUPER_ADMIN` roles (TOTP or SMS)
- [ ] Optional MFA for `PARENT` (encouraged but not blocking)
- [ ] Rate-limit login attempts (already have [`@nestjs/throttler`](https://docs.nestjs.com/security/rate-limiting), apply per-IP + per-account)
- [ ] Account lockout after N failed attempts with admin unlock path
- [ ] Session management: short-lived access tokens (15min) + refresh tokens with rotation
- [ ] Logout-everywhere endpoint that invalidates all refresh tokens
- [ ] Audit log of every login, logout, password change, role change → `SystemLog`

#### 2.3 Clinician Verification Workflow
The [HPCSA](https://www.hpcsa.co.za) / [SANC](https://www.sanc.co.za) verification today is a manual admin form. Make it harder to spoof.

- [ ] Document number format validation (HPCSA / SANC regex)
- [ ] Manual admin-review queue with diff/approve/reject states (already in `verifications` module)
- [ ] Capture upload of practising-certificate PDF into a private GCS bucket
- [ ] Annual re-verification reminder (Cloud Scheduler → email)

---

> Source: [Phase 2: Authentication & Identity](../GO_LIVE.md#phase-2-authentication--identity)

### Phase 3: Payments

**Roles:** `PRODUCT 30%` · `FINANCE 25%` · `DEV 45%` *(`PRODUCT` defines pricing tiers and trial logic; `FINANCE` handles Stripe KYC, CIPC docs, SARS VAT registration; `DEV` integrates the rails)*

The product currently has no monetization wired up. South Africa is a multi-rail payments market: international card processors, locally-licensed PSPs, and instant-EFT specialists each cover a different slice of the buyer base. The wrong choice burns conversion (asking parents for a credit card they don't have) or burns runway (paying premium fees for buyers who'd happily EFT). Below is the provider comparison, then the recommendation, then the implementation work.

#### 3.1 Provider Selection: [Stripe](https://stripe.com) vs [Paystack](https://paystack.com) vs [Ozow](https://ozow.com)

Plain-language summary of the three credible providers for a SA healthtech in 2026:

| Provider | Best at | SA fees (typical) | Methods supported | Subscriptions | Verdict for us |
| --- | --- | --- | --- | --- | --- |
| **[Stripe](https://stripe.com)** | International cards, polished subscriptions, [Stripe Tax](https://stripe.com/tax), [Stripe Billing](https://stripe.com/billing), [Radar](https://stripe.com/radar) fraud, best DX | ~2.9% + R2 (local cards), +1% intl | Cards, Apple/Google Pay, [Stripe ACH-style EFT](https://stripe.com/za) (limited) | First-class | **Primary**: wins on B2B subscriptions for clinicians/practices |
| **[Paystack](https://paystack.com)** (Stripe-owned since 2020) | African-market cards + local UX optics, dev-friendly REST API | ~2.9% local cards, lower negotiable at volume | Cards, [bank transfer](https://paystack.com/za/payments), QR, Apple Pay | Yes ([Paystack Subscriptions](https://paystack.com/docs/payments/subscriptions/)), less mature than Stripe Billing | **Skip pre-launch**: overlaps Stripe (same parent company), only adds value if we expand into Nigeria/Ghana/Kenya |
| **[Ozow](https://ozow.com)** | SA instant-EFT (pull from any major SA bank), no card required | ~1.5% (lowest of the three), capped fees on large transactions | Instant-EFT only (no cards, no international) | No native subscriptions, needs custom recurring-charge logic via [Ozow's API](https://hub.ozow.com/docs) or pairing with a card-on-file flow | **Add as fast-follow** once parent paid tier exists, meaningful conversion uplift for the ~40% of SA adults with bank accounts but no credit card |

**Decision:**
- [ ] **Pre-launch: Stripe only.** It covers the buyers who'll actually be paying on day one (clinicians, practices, tenants), they all have business cards, want VAT-compliant invoices, and are international-card friendly. Stripe Billing + Stripe Tax give us subscription billing, dunning, ZAR-VAT, and proration out of the box; Paystack would force us to rebuild the subscription layer ourselves, and Ozow doesn't do recurring at all. One integration is one integration.
- [ ] **Fast-follow (post-launch, ~30 days after parent paid tier launches): add Ozow as a second checkout option for parents.** This is the SA-specific play, many parent buyers will not have a Visa/Mastercard but will EFT instantly. Ozow's 1.5% fee also beats Stripe on per-transaction economics for large one-off charges (e.g. annual family plan).
- [ ] **Defer Paystack indefinitely** unless and until we expand into another African market (Nigeria, Ghana, Kenya). Adding it pre-launch is duplicate work for marginal coverage.
- [ ] Document the decision in `docs/ADR/0002-payments.md` so the rationale survives staff turnover.

#### 3.2 Stripe Setup
The fundamentals of taking money.

- [ ] Stripe account in **[South Africa](https://stripe.com/za)** with ZAR as primary currency
- [ ] Verify business identity (KYC), needs [CIPC](https://www.cipc.co.za) company registration + proof of address
- [ ] Enable **Stripe Tax** for South African VAT (15%), auto-calculated and remitted
- [ ] Configure tax registrations ([SARS](https://www.sars.gov.za) VAT number)
- [ ] Set up [Stripe webhooks](https://stripe.com/docs/webhooks) (`/v1/webhooks/stripe`) with signature verification
- [ ] Store Stripe IDs (`stripeCustomerId`, `stripeSubscriptionId`) on `User` and `Tenant` entities

#### 3.3 Pricing & Plans
The actual product packaging.

- [ ] Define pricing tiers (Parent free? Clinician seat-based? Tenant flat-rate?)
- [ ] Create Stripe products + prices in dashboard (or via Terraform)
- [ ] Build `/pricing` page (page exists, needs real numbers + [Stripe Checkout](https://stripe.com/payments/checkout) buttons)
- [ ] Free trial logic (14 days clinician, no credit card upfront?)
- [ ] Coupon / promo code support for early-adopter practices

#### 3.4 Billing UX
The screens users actually see.

- [ ] [Stripe Customer Portal](https://stripe.com/docs/customer-management) embedded in `/dashboard/account/billing`
- [ ] Invoice history with PDF download
- [ ] Failed-payment retry + dunning emails (Stripe Billing handles this)
- [ ] Upgrade / downgrade / cancel flows
- [ ] Proration handling for mid-cycle plan changes
- [ ] **Provider-agnostic abstraction:** wrap Stripe behind a `PaymentProvider` interface in the API now (even with one implementation) so adding Ozow later is a new adapter, not a refactor
`
#### 3.5 Compliance
The legal/regulatory side of payments.

- [ ] Confirm [PCI-DSS SAQ-A](https://www.pcisecuritystandards.org/document_library) scope (we only use [Stripe Elements](https://stripe.com/payments/elements) / Checkout, no card data touches our servers)
- [ ] Add cardholder-data flow diagram to security docs
- [ ] Enable Stripe Radar for fraud detection

#### 3.6 Ozow Integration (Fast-Follow, Post-Launch)
Trigger this phase only after the parent paid tier is live and we see real card-decline / abandonment data justifying the second rail. The integration itself is small (~1 week of dev) but adds an ongoing reconciliation burden.

- [ ] Sign up for an [Ozow merchant account](https://ozow.com/get-started), KYC similar to Stripe (CIPC registration, proof of address, bank account verification)
- [ ] Implement Ozow as a second adapter behind the `PaymentProvider` interface introduced in [§3.4](#34-billing-ux)
- [ ] Add Ozow as a checkout option on parent-facing flows only (not B2B clinician/practice subscriptions, keep those on Stripe for cleaner reconciliation)
- [ ] Wire up the [Ozow notification webhook](https://hub.ozow.com/docs/notification-callback) (`/v1/webhooks/ozow`) with HMAC verification
- [ ] Reconciliation job: nightly cron compares Ozow settlement reports against `Payment` records, flag discrepancies in Slack `#stripe` (rename to `#payments` once Ozow lands)
- [ ] For recurring parent plans: card-on-file via Stripe remains primary; Ozow stays one-off (annual upfront, top-ups). Don't try to fake recurring on Ozow, the UX is bad
- [ ] Update Privacy Policy + sub-processor list to disclose Ozow
- [ ] Sign Ozow DPA (SA-domiciled processor, much simpler than Stripe's cross-border story)

---

> Source: [Phase 3: Payments](../GO_LIVE.md#phase-3-payments)

### Phase 4: POPIA Compliance

N/A. See [Phase 4: POPIA Compliance](../GO_LIVE.md#phase-4-popia-compliance) in the source document for context.

### Phase 5: Security

N/A. See [Phase 5: Security](../GO_LIVE.md#phase-5-security) in the source document for context.

### Phase 6: Legal Documents

**Roles:** `LEGAL 70%` · `PRODUCT 25%` · `DEV 5%` *(stakeholder-led, `LEGAL` engages and manages the SA attorney; `PRODUCT` negotiates B2B MSAs with first practices; `DEV` only hosts the final content in `legal/[slug]`)*

Before a single real user signs up, the legal pages need to be real, lawyer-reviewed, and version-controlled. The `legal/[slug]` route already exists in code, the actual content does not.

#### 6.1 Public-facing Documents
What every visitor sees.

- [ ] **Privacy Policy**: POPIA-compliant, lists every processor, retention periods, DSAR contact
- [ ] **Terms of Service**: limits of liability, dispute resolution, governing law (South African)
- [ ] **Cookie Policy** + cookie consent banner (essential, functional, analytics, marketing buckets)
- [ ] **Acceptable Use Policy**
- [ ] **Disclaimer**: explicit "this app is not a substitute for medical advice, no clinician-patient relationship is formed by use of the platform"

#### 6.2 Role-specific Agreements
Different audiences sign different things.

- [ ] **Parent EULA**: consent on behalf of minor, dispute terms, age limits
- [ ] **Clinician Service Agreement**: professional indemnity disclaimers, scope of clinician obligations on the platform
- [ ] **Tenant / Practice Master Services Agreement** (B2B contract for practices) + Order Form + DPA addendum
- [ ] **Data Processing Agreement** (we act as processor for the tenant/practice in some flows)

#### 6.3 Internal Documents
What the team needs even if the public doesn't see it.

- [ ] Incident response policy
- [ ] Information security policy
- [ ] Data retention & deletion policy
- [ ] Acceptable use policy for staff
- [ ] DPA with each subprocessor, countersigned and filed

#### 6.4 Professional Review
Don't ship lawyer documents written by an LLM.

- [ ] Engage a South African attorney experienced in POPIA + healthtech (e.g. [Webber Wentzel](https://www.webberwentzel.com), [ENS Africa](https://www.ensafrica.com), or a healthtech specialist boutique)
- [ ] Get sign-off on all public-facing documents
- [ ] Get sign-off on the consent flow specifically (parental consent for minors is the highest-risk path)

---

> Source: [Phase 6: Legal Documents](../GO_LIVE.md#phase-6-legal-documents)

### Phase 7: Observability & Monitoring

N/A. See [Phase 7: Observability & Monitoring](../GO_LIVE.md#phase-7-observability--monitoring) in the source document for context.

### Phase 8: Email, SMS & Notifications

N/A. See [Phase 8: Email, SMS & Notifications](../GO_LIVE.md#phase-8-email-sms--notifications) in the source document for context.

### Phase 9: CI/CD & Release Engineering

N/A. See [Phase 9: CI/CD & Release Engineering](../GO_LIVE.md#phase-9-cicd--release-engineering) in the source document for context.

### Phase 10: Mobile App Release

**Roles:** `DEV 50%` · `DESIGN 25%` · `PRODUCT 25%` *(`DEV` configures EAS and submits builds; `DESIGN` produces store screenshots and icons; `PRODUCT` writes the listing copy and answers Apple/Google data-safety forms)*

The Expo app is scaffolded but has never been submitted to a store. Store review is its own multi-week process, start early.

#### 10.1 Apple App Store
- [ ] [Apple Developer Program](https://developer.apple.com/programs/) enrollment ($99/yr, requires [DUNS number](https://developer.apple.com/support/D-U-N-S/) for legal entity)
- [ ] [App Store Connect](https://appstoreconnect.apple.com) listing: screenshots, description, keywords, [privacy nutrition labels](https://developer.apple.com/app-store/app-privacy-details/)
- [ ] Configure EAS Build for iOS (`eas.json`)
- [ ] First [TestFlight](https://developer.apple.com/testflight/) build for internal testing
- [ ] [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency) prompt if we add any tracking
- [ ] Submit for review (typically 1-3 days)

#### 10.2 Google Play Store
- [ ] [Google Play Console](https://play.google.com/console) enrollment ($25 one-time)
- [ ] [Data safety form](https://support.google.com/googleplay/android-developer/answer/10787469) (declares what data is collected and why)
- [ ] Configure EAS Build for Android
- [ ] Internal testing track → closed beta → production
- [ ] Health-app declaration (Play has additional rules for medical-data apps)

#### 10.3 Mobile-specific Compliance
- [ ] Privacy policy URL accessible from inside the app
- [ ] In-app account deletion (Apple requires this since iOS 16)
- [ ] No advertising IDs collected without consent

---

> Source: [Phase 10: Mobile App Release](../GO_LIVE.md#phase-10-mobile-app-release)

### Phase 11: Workspace & Communications

N/A. See [Phase 11: Workspace & Communications](../GO_LIVE.md#phase-11-workspace--communications) in the source document for context.

### Phase 12: Pre-Launch Testing

**Roles:** `DEV 50%` · `CLINICAL 25%` · `PRODUCT 25%` *(`DEV` writes automation; `CLINICAL` is the registered paediatrician validating EPI / milestones / growth charts; `PRODUCT` recruits and manages closed-beta practices)*

The final shake-out before real parents and clinicians.

#### 12.1 Automated Coverage
- [ ] Unit test coverage > 70% on API business logic (verifications, EPI scheduling, growth percentile calc)
- [ ] Cypress smoke suite on every prod deploy
- [ ] Postman contract tests run nightly against staging
- [ ] Mobile E2E ([Detox](https://wix.github.io/Detox/) or [Maestro](https://maestro.mobile.dev)) on critical flows: signup, add child, log growth

#### 12.2 Manual / Exploratory
- [ ] Internal alpha, the team + 2-3 friendly testers for 2 weeks
- [ ] Clinical accuracy review by a registered paediatrician (EPI schedule, milestone wording, growth chart correctness)
- [ ] Accessibility audit ([axe-core](https://github.com/dequelabs/axe-core) + manual keyboard nav + screen reader on dashboard)
- [ ] Multi-language QA (i18n is wired, verify Afrikaans + Zulu translations are actually correct)
- [ ] Mobile device matrix, at minimum: iPhone 13, Pixel 7, mid-range Android (Samsung A-series)

#### 12.3 Performance & Load
- [ ] [Lighthouse](https://developer.chrome.com/docs/lighthouse) score > 90 on landing page
- [ ] API load test ([k6](https://k6.io) or [Artillery](https://www.artillery.io)) against staging, 100 concurrent users, sustained 5min
- [ ] DB slow-query log review, every query > 100ms gets an index review
- [ ] Cold-start benchmarks on Cloud Run (set min-instances if needed)

#### 12.4 Closed Beta
- [ ] Recruit 3-5 paediatric practices for closed beta (1-month free + feedback calls)
- [ ] Onboard their parents through a waitlist (`/v1/leads` already captures this)
- [ ] Weekly feedback sync via Slack `#clinician-feedback`
- [ ] Define exit criteria for closed → open beta (zero P0 bugs in 14 days, NPS > 30)

---

> Source: [Phase 12: Pre-Launch Testing](../GO_LIVE.md#phase-12-pre-launch-testing)

### Phase 13: Launch & Marketing

**Roles:** `MARKETING 50%` · `DESIGN 20%` · `PRODUCT 20%` · `DEV 10%` *(stakeholder-led, `MARKETING` runs LinkedIn, paediatric-association outreach, press; `DESIGN` produces the press kit; `PRODUCT` finalises pricing copy and demo flow; `DEV` only wires analytics and SEO metadata)*

The "tell people about it" phase. Cheap to defer, expensive to skip entirely.

- [ ] Final landing page copy and SEO (`about`, `pricing`, `contact`, `blog` already scaffolded)
- [ ] [Open Graph](https://ogp.me) + [Twitter card](https://developer.x.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) metadata on every public route
- [ ] Sitemap + robots.txt + [Google Search Console](https://search.google.com/search-console) verification
- [ ] Analytics: **[Plausible](https://plausible.io)** or **PostHog** (POPIA-friendlier than [GA4](https://marketingplatform.google.com/about/analytics/)), avoid GA4 unless we have a clean DPA story
- [ ] Launch announcement channels: [LinkedIn](https://www.linkedin.com), paediatric-association mailing lists, parenting groups
- [ ] Press kit (logo, screenshots, founder bio, one-pager) hosted on the marketing site
- [ ] Pricing-page CTA → Stripe Checkout (live)
- [ ] Demo booking flow via Calendly for B2B (practice / tenant) sales

---

> Source: [Phase 13: Launch & Marketing](../GO_LIVE.md#phase-13-launch--marketing)

### Phase 14: Post-Launch Operations

N/A. See [Phase 14: Post-Launch Operations](../GO_LIVE.md#phase-14-post-launch-operations) in the source document for context.
