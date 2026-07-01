# Raising Atlantic Go-Live: `DEV` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `DEV` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** Solo developer (Bilo). Implementation, infrastructure, code, all technical decisions.

**Phase involvement:**

- [Phase 0: Minimum Viable Product](#phase-0-minimum-viable-product): `DEV 100%`
- [Phase 1: Infrastructure & Hosting Decision](#phase-1-infrastructure--hosting-decision): `DEV 90%`
- [Phase 2: Authentication & Identity](#phase-2-authentication--identity): `DEV 90%`
- [Phase 3: Payments](#phase-3-payments): `DEV 45%`
- [Phase 4: POPIA Compliance](#phase-4-popia-compliance): `DEV 20%`
- [Phase 5: Security](#phase-5-security): `DEV 80%`
- [Phase 6: Legal Documents](#phase-6-legal-documents): `DEV 5%`
- [Phase 7: Observability & Monitoring](#phase-7-observability--monitoring): `DEV 95%`
- [Phase 8: Email, SMS & Notifications](#phase-8-email-sms--notifications): `DEV 50%`
- [Phase 9: CI/CD & Release Engineering](#phase-9-cicd--release-engineering): `DEV 100%`
- [Phase 10: Mobile App Release](#phase-10-mobile-app-release): `DEV 50%`
- [Phase 11: Workspace & Communications](#phase-11-workspace--communications): `DEV 40%`
- [Phase 12: Pre-Launch Testing](#phase-12-pre-launch-testing): `DEV 50%`
- [Phase 13: Launch & Marketing](#phase-13-launch--marketing): `DEV 10%`
- [Phase 14: Post-Launch Operations](#phase-14-post-launch-operations): `DEV 20%`
- [Phase 15: Mobile Feature Parity](#phase-15-mobile-feature-parity): `DEV 80%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `DEV` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `DEV` are marked N/A.

### 🔴 Required (non-negotiable) before release

The minimum viable launch list. Skip any of these and we are either non-compliant, insecure, or unable to operate.

**Roles:** `DEV 45%` · `COMPLIANCE 15%` · `LEGAL 12%` · `PRODUCT 10%` · `OPS 10%` · `FINANCE 5%` · `CLINICAL 3%` *(over half of this tier is non-engineering, Information Officer, DPAs, lawyer-reviewed legal docs, Stripe KYC, beta recruitment)*

**`DEV`: engineering execution**

- [ ] **Hosting + DB decision finalised**: Vercel+Neon **or** GCP+Cloud SQL `africa-south1` ([§1.1](#11-vercel-vs-gcp-decision-framework), [§1.5](#15-database-neon-vs-cloud-sql))
- [ ] **Terraform + GitHub Actions IaC pipeline operational**: every prod resource provisioned via PR, zero console click-ops ([§1.4](#14-infrastructure-as-code-terraform--github-actions))
- [ ] **Auth provider live with MFA enforced** for `CLINICIAN` / `ADMIN` / `SUPER_ADMIN` ([§2.1](#21-auth-provider-decision), [§2.2](#22-account-security-hardening))
- [ ] **Email verification + password reset** working in production ([§2.2](#22-account-security-hardening))
- [ ] **WAF + TLS 1.2+ + HSTS preload + Cloud Armor + private-IP database** ([§5.2](#52-infrastructure-security))
- [ ] **Backup + restore drill** rehearsed; documented RTO < 1h, RPO < 15min ([§1.5](#15-database-neon-vs-cloud-sql))
- [ ] **Sentry + uptime checks + Slack alerting** wired and firing ([§7.3](#73-error-tracking), [§7.4](#74-uptime--slos), [§11.1](#111-should-we-use-slack-recommendation))

### 🟠 Follow-up Tier 1 (release week + first month)

Not strictly blocking, but embarrassing or risky if they slip past week 4 of being live.

**Roles:** `DEV 50%` · `OPS 15%` · `MARKETING 10%` · `DESIGN 10%` · `PRODUCT 5%` · `FINANCE 5%` · `SUPPORT 5%` *(branded emails, Slack workspace, helpdesk inbox, mobile-store listings, Xero setup all need stakeholder hands)*

**`DEV`: engineering execution**

- [ ] **Public status page** at `status.raisingatlantic.com` ([§7.4](#74-uptime--slos))
- [ ] **DSAR + right-to-erasure self-service endpoint** wired into the dashboard ([§4.2](#42-consent--data-subject-rights))
- [ ] **SLOs defined** with error budgets, baseline 99.5% availability / p95 < 500ms ([§7.4](#74-uptime--slos))
- [ ] **Cypress smoke suite gating prod deploys**, Postman contract tests on staging nightly ([§12.1](#121-automated-coverage))

**`MARKETING` + `DESIGN` + `DEV`: branded customer touchpoints**

- [ ] **Branded transactional email templates** (welcome, verification, EPI reminder, billing receipt) ([§8.1](#81-transactional-email))

**`PRODUCT` + `DESIGN` + `DEV`: mobile store launch**

- [ ] **Mobile app submitted** to Apple App Store + Google Play (web typically launches first; mobile follows in week 1–4) ([§10](#phase-10-mobile-app-release))

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

Conversion-uplift and ops-quality work that pays back fast once real users are flowing.

**Roles:** `DEV 50%` · `MARKETING 20%` · `DESIGN 15%` · `PRODUCT 10%` · `OPS 5%` *(press kit, multi-language QA validation, LinkedIn launch, content calendar all sit with stakeholders)*

**`DEV`: engineering execution**

- [ ] **SMS / WhatsApp** via [Twilio](https://www.twilio.com) for appointment and vaccination alerts ([§8.2](#82-sms--whatsapp))
- [ ] **Expo Push Notifications** wired into the mobile app with quiet-hours respect ([§8.3](#83-push-notifications-mobile))
- [ ] **Detox / Maestro mobile E2E** on signup → add child → log growth ([§12.1](#121-automated-coverage))
- [ ] **Analytics**: [Plausible](https://plausible.io) or [PostHog](https://posthog.com) deployed; GA4 explicitly avoided unless we have a clean DPA story ([§13](#phase-13-launch--marketing))

**`PRODUCT` + `DEV`: billing UX**

- [ ] **[Ozow](https://ozow.com) as second checkout option** for parent paid tier ([§3.6](#36-ozow-integration-fast-follow-post-launch))
- [ ] **Stripe Customer Portal** embedded at `/dashboard/account/billing` ([§3.4](#34-billing-ux))

**`CLINICAL` + `DEV`: localisation QA**

- [ ] **Multi-language QA**: Afrikaans + Zulu translations validated by native speakers ([§12.2](#122-manual--exploratory))

### 🟢 Follow-up Tier 3 (first quarter post-launch)

Maturity work, the shift from "launched" to "grown-up".

**Roles:** `DEV 55%` · `OPS 25%` · `COMPLIANCE 10%` · `PRODUCT 10%` *(quarterly DR drills, access reviews, annual POPIA review, YubiKey rollout, GA-readiness sign-off live with stakeholders)*

**`DEV`: engineering execution**

- [ ] **Field-level encryption with GCP KMS** for HPCSA numbers and child medical conditions ([§5.3](#53-data-security))
- [ ] **Feature-flag platform** wired in ([GrowthBook](https://www.growthbook.io) / [Flagsmith](https://www.flagsmith.com) / PostHog) ([§9.4](#94-environment-parity))
- [ ] **BigQuery analytics export** from Cloud Logging for business-metrics dashboards ([§7.2](#72-metrics--tracing))
- [ ] **Blue/green canary rollouts** (10% → 50% → 100%) tuned with automated rollback ([§9.2](#92-continuous-deployment-application-code))

**`PRODUCT` + `DEV`: readiness sign-off**

- [ ] **Open beta → general availability** transition ([§12.4](#124-closed-beta))

### 🔵 Future work (likely outside this document's scope)

On the radar but not load-bearing for the SA launch. Re-evaluate at the 6-month mark; some of these may belong in their own RFCs rather than this checklist.

**Roles:** `PRODUCT 30%` · `DEV 30%` · `COMPLIANCE 15%` · `LEGAL 10%` · `FINANCE 5%` · `CLINICAL 5%` · `MARKETING 5%` *(mostly strategic decisions, African expansion, SOC 2 / HIPAA scoping, advisory-board recruitment, R&D incentive, `DEV` only does the engineering follow-through)*

**`PRODUCT` + `DEV`: strategic product expansion**

- [ ] **African-market expansion**: revisit [Paystack](https://paystack.com) for Nigeria / Ghana / Kenya ([§3.1](#31-provider-selection-stripe-vs-paystack-vs-ozow))
- [ ] **API public/partner program** with rate-limited keys and developer portal

**`LEGAL` + `PRODUCT` + `DEV`: B2B contracting**

- [ ] **B2B self-serve Master Services Agreement portal** for new tenants ([§6.2](#62-role-specific-agreements))

**`CLINICAL` + `DEV`: clinical maturation**

- [ ] **Genkit AI clinical-summary maturation** beyond the current placeholder ([§4.3](#43-cross-border-transfers))

**`DEV`: long-horizon resilience**

- [ ] **Multi-region failover** to a warm-standby GCP region (e.g. `europe-west1`)

---

## Phases 0 to 15

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `DEV` share are marked N/A with a back-link.

### Phase 0: Minimum Viable Product

**Roles:** `DEV 100%` *(retrospective, no further action)*

The MVP is a proof of concept for stakeholders to make get an idea for a look and feel, and to make informed decisions for the next phases.
A snapshot of capabilities that are already shipped or in-repo. Treat this as the baseline we do **not** need to redo before going live.

#### 0.1 Product & Code
A working three-app monorepo with role-based flows for Parents, Clinicians, Admins, and Super Admins.

- [x] [Moonrepo](https://moonrepo.dev) monorepo with `apps/{api,web,mobile}` and shared `pkgs/{types,ui}`
- [x] Next.js 16 web app with App Router, RSC, [Tailwind](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com), i18n ([`react-i18next`](https://react.i18next.com)), [TipTap](https://tiptap.dev) blog, design-system route
- [x] NestJS 11 API with bounded modules: `users`, `tenants`, `practices`, `children`, `verifications`, `master-data`, `appointments`, `reports`, `blog`, `leads`, `system-logs`, `ai`
- [x] RBAC enforced both client-side (`lib/rbac`) and server-side (`JwtAuthGuard`, `RolesGuard`) 
- [x] Expo 54 mobile app with role-segmented [Expo Router](https://docs.expo.dev/router/introduction/) groups (`(parent)`, `(clinician)`, `(admin)`)
- [x] Shared TypeScript domain types (`pkgs/types`) and shared UI primitives (`pkgs/ui`)
- [x] Custom telemetry interfaces (`core/telemetry`) with [GCP](https://cloud.google.com) / [OpenTelemetry](https://opentelemetry.io) adapters
- [x] Dual data-source pattern (`withDataSource` + mock fallback) toggled by `NEXT_PUBLIC_USE_API`
- [x] [TanStack React Query](https://tanstack.com/query) v5 wired across web and mobile; error boundaries (`FeatureErrorBoundary`, `RouteError`)

#### 0.2 Testing & Tooling
Multiple test layers exist but coverage and CI gating are still inconsistent.

- [x] [Jest](https://jestjs.io) unit tests in API (`*.spec.ts`)
- [x] [Postman](https://www.postman.com) E2E collection in `tests/postman` with per-environment configs
- [x] [Cypress](https://www.cypress.io) 14 E2E suite under `src/test/cypress` (local/dev/staging/prod profiles)
- [x] Moon-driven `deploy-test` and `deploy-prod` scripts via `dev → test → main` branch flow
- [x] `apphosting.yaml` ([Firebase](https://firebase.google.com)) and `vercel.json` deploy descriptors

---

> Source: [Phase 0: Minimum Viable Product](../GO_LIVE.md#phase-0-minimum-viable-product)

### Phase 1: Infrastructure & Hosting Decision

**Roles:** `DEV 90%` · `PRODUCT 10%` *(`PRODUCT` signs off on cost trade-offs and hosting strategy; `DEV` executes everything else)*

The single biggest pre-launch decision: stay on Vercel or migrate to [Google Cloud Platform](https://cloud.google.com). Making the wrong call here is expensive to undo, so it's worth resolving this **before** wiring up payments, observability, and compliance, because each of those depends on where the workloads live.

#### 1.1 Vercel vs GCP: Decision Framework
In plain terms: Vercel is fast to ship on but charges premium prices, has no native data residency in South Africa, and is awkward for long-running NestJS workloads. GCP gives us [`africa-south1`](https://cloud.google.com/about/locations#africa) (Johannesburg) for POPIA-friendly residency, predictable enterprise pricing, and far more control, but we take on more ops work.

- [x] Decide hosting target (recommendation: **GCP `africa-south1`** for production, keep Vercel only for marketing preview deploys)
- [x] Document the decision and rationale in `docs/ADR/0001-hosting.md`
- [x] Inventory every Vercel-specific assumption in code (Edge runtime, [Vercel KV](https://vercel.com/docs/storage/vercel-kv), image optimization, ISR) and confirm portability
- [x] Estimate 12-month cost on each platform at projected traffic

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
- [x] Create a top-level `infra/` directory in the monorepo (or a sibling `raisingatlantic-infra` repo if we'd rather isolate blast radius)
- [x] Suggested layout:
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
- [x] Pin Terraform version with `.terraform-version` ([`tfenv`](https://github.com/tfutils/tfenv) / [`mise`](https://mise.jdx.dev)), recommend Terraform `>= 1.9` or **[OpenTofu](https://opentofu.org) 1.8** if we want to dodge HashiCorp's BSL licensing
- [x] Pin all provider versions in `versions.tf` (no floating `~>`)

##### State & bootstrap
The chicken-and-egg problem: we need a state bucket before we can manage anything in Terraform.

- [ ] One-time `bootstrap/` module run **manually** to create: a dedicated `ra-tfstate` GCS bucket (versioning + object lock + CMEK), the GitHub OIDC [Workload Identity Pool](https://cloud.google.com/iam/docs/workload-identity-federation), and the deployer service accounts
- [ ] After bootstrap, commit the state bucket name and import the bootstrap resources into Terraform itself, so the bootstrap module manages itself going forward
- [x] Remote state in GCS with state-locking ([GCS native locking](https://cloud.google.com/docs/terraform/resource-management/store-state), no separate DynamoDB needed)
- [x] Per-environment state files (`envs/prod/terraform.tfstate`, etc.), never share state across envs

##### Provider coverage
Most things we need a Terraform provider for are already first-class. Some are not.

- [x] **[`hashicorp/google`](https://registry.terraform.io/providers/hashicorp/google/latest/docs) + [`google-beta`](https://registry.terraform.io/providers/hashicorp/google-beta/latest/docs)**: GCP core (Cloud Run, Cloud SQL, IAM, networking, Secret Manager, monitoring, Cloud DNS)
- [x] **[`integrations/github`](https://registry.terraform.io/providers/integrations/github/latest/docs)**: repo settings, branch protection, environments, secrets
- [x] **[`stripe/stripe`](https://registry.terraform.io/providers/stripe/stripe/latest/docs)** (community), products, prices, webhook endpoints
- [x] **[`cloudflare/cloudflare`](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)**: only if we put [Cloudflare](https://www.cloudflare.com) in front of Cloud DNS (optional, but nice for WAF + DDoS as a second layer)
- [x] **[`vercel/vercel`](https://registry.terraform.io/providers/vercel/vercel/latest/docs)**: if we keep marketing on Vercel, manage projects + envs from Terraform
- [x] **[`neondatabase/neon`](https://registry.terraform.io/providers/kislerdm/neon/latest/docs)** (community), if we stay on Neon
- [x] **[`PagerDuty`](https://registry.terraform.io/providers/PagerDuty/pagerduty/latest/docs) / [`BetterStack`](https://registry.terraform.io/providers/BetterStackHQ/better-uptime/latest/docs) / [`Sentry`](https://registry.terraform.io/providers/jianyuan/sentry/latest/docs) / [`SendGrid`](https://registry.terraform.io/providers/Trois-Six/sendgrid/latest/docs) / [`1Password`](https://registry.terraform.io/providers/1Password/onepassword/latest/docs)**: every SaaS in our stack with a TF provider goes in IaC
- [x] Use the **[`tfe` / Terraform Cloud provider](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs)** only if we want [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) as backend, otherwise GCS is fine

##### GitHub Actions ↔ GCP authentication
We should **never** put a GCP service-account JSON key in a GitHub secret. Use [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation) instead, short-lived OIDC tokens, no long-lived keys.

- [x] Bootstrap a Workload Identity Pool + Provider in `ra-prod` for `token.actions.githubusercontent.com`
- [x] One deployer service account per environment (`tf-deployer-prod@ra-prod.iam.gserviceaccount.com`, etc.) with scoped IAM
- [x] Restrict the WIF binding to specific repo + branch (`repo:bilo-lwabona/raisingatlantic-mono:ref:refs/heads/main`), prevents PRs from arbitrary forks from assuming the role
- [x] In each workflow: [`google-github-actions/auth@v2`](https://github.com/google-github-actions/auth) with `workload_identity_provider` + `service_account` (no `credentials_json`)
- [x] Store nothing in `GITHUB_SECRETS` for GCP auth other than the WIF provider resource name

##### GitHub Actions pipelines for Terraform
Two workflows is enough; resist the urge to over-engineer.

- [x] **`.github/workflows/terraform-plan.yml`**: runs on every PR that touches `infra/**`:
  - [x] `terraform fmt -check`, `terraform validate`, [`tflint`](https://github.com/terraform-linters/tflint), [`tfsec`](https://github.com/aquasecurity/tfsec) / [`checkov`](https://www.checkov.io) for security policy violations
  - [x] `terraform plan -out=tfplan` per affected env, posted as a sticky PR comment
  - [x] Cost diff via **[Infracost](https://www.infracost.io)** posted in the same PR comment
  - [x] Required for merge, block on plan failure or security findings
- [x] **`.github/workflows/terraform-apply.yml`**: runs on push to `main` (after merge):
  - [x] `dev` applies automatically
  - [x] `staging` applies automatically after `dev` succeeds
  - [x] `prod` requires manual approval via a [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) with required reviewers (only one approver today, but the gate is still there)
  - [ ] Apply uses the merged-PR plan if reachable; otherwise re-plans and confirms parity
  - [x] Notifies `#deploys` Slack channel on apply (success + failure)
- [ ] No one, not even an admin, can `terraform apply` from a laptop against `prod`. IAM denies it. CI is the only path.

##### Secrets management
- [x] **GCP Secret Manager** as the single source of truth at runtime, Cloud Run mounts secrets directly
- [x] Secrets are *created* by Terraform but their *values* are written separately (either via `gcloud secrets versions add` once, or via a sealed-secrets workflow), Terraform should know a secret exists, not what's in it
- [x] Use `lifecycle { ignore_changes = [secret_data] }` so Terraform doesn't fight value rotations
- [x] No secrets ever in GitHub Actions logs (`::add-mask::` for any echoed value)
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

- [x] Application code deploys (that's the app pipeline, TF only manages the Cloud Run service shell, not the image tag of each release)
- [x] Database schema ([TypeORM](https://typeorm.io) migrations remain the schema source of truth)
- [x] User-generated data, blog content, runtime feature flags
- [x] Per-developer GCP IAM grants for ad-hoc debugging (use just-in-time access via `gcloud iam service-accounts add-iam-policy-binding` with a 1-hour TTL, not a permanent TF binding)

##### Drift & policy
Even with IaC discipline, things drift. Catch it early.

- [x] Nightly GitHub Actions cron: `terraform plan` on every env, fail-and-notify if non-empty
- [x] **[OPA](https://www.openpolicyagent.org) / [Conftest](https://www.conftest.dev)** or **`tfsec`** policy gates in PR (no public buckets, no `0.0.0.0/0` SSH, no `serviceAccountKey` resources, no resources outside `africa-south1`)
- [ ] Quarterly review: anything imported manually gets either codified or destroyed
- [ ] When the [Information Regulator](https://inforegulator.org.za) asks "who has access to production?", the answer is `git log infra/envs/prod/iam.tf`: that is the audit

#### 1.5 Database: Neon vs Cloud SQL
We're currently on Neon. Neon is excellent for dev velocity (branches, serverless) but has two issues for this project: (1) data lives in `eu-central-1` / `us-east-2`: not South Africa, which is awkward under POPIA, and (2) it's a third-party processor we'll need a DPA from.

- [x] Decide: stay on Neon (sign DPA, document cross-border transfer) **or** migrate to [Cloud SQL Postgres](https://cloud.google.com/sql/postgresql) in `africa-south1`
- [ ] If staying on Neon: confirm region, sign DPA, configure point-in-time recovery, set up read replica
- [ ] If migrating: provision Cloud SQL Postgres 15, enable HA + automated backups + 7-day PITR, run a one-time `pg_dump | pg_restore` rehearsal in staging
- [ ] Lock down access: private IP only, [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy) from Cloud Run, no public IP
- [ ] Generate strong rotating credentials in Secret Manager (never in `.env`)
- [ ] Set up nightly logical backups exported to a separate GCS bucket with object versioning + 30-day retention
- [x] Replace `synchronize: true` with explicit migrations for production (already partially done in `db/migrations/`)
- [ ] Test a full DR drill: drop the database, restore from backup, confirm RTO < 1h and RPO < 15min

---

> Source: [Phase 1: Infrastructure & Hosting Decision](../GO_LIVE.md#phase-1-infrastructure--hosting-decision)

### Phase 2: Authentication & Identity

**Roles:** `DEV 90%` · `PRODUCT 10%` *(provider choice has cost and UX implications `PRODUCT` must weigh in on)*

Right now there's a JWT auth guard but the registration / password-reset / MFA story is thin. For a healthcare product holding minor children's records, this layer has to be airtight.

#### 2.1 Auth Provider Decision
Building auth from scratch for a regulated product is a long, thankless job. Buy it.

- [x] Decide: build our own NestJS auth (current direction) vs. **[Firebase Auth](https://firebase.google.com/docs/auth) / [Identity Platform](https://cloud.google.com/identity-platform)** vs. **[Auth0](https://auth0.com) / [Clerk](https://clerk.com) / [Stytch](https://stytch.com) / [Supabase Auth](https://supabase.com/auth)** — **decided: build-your-own NestJS JWT** (Firebase needs GCP, deferred). Google SSO added via `google-auth-library` ID-token verification, env-gated.
- [ ] Recommendation: **Firebase Auth / GCP Identity Platform**: same ecosystem as the rest of the infra, supports MFA, SAML, OIDC, magic links, and works on web + mobile out of the box
- [ ] If Firebase: integrate via [Admin SDK](https://firebase.google.com/docs/admin/setup) on the NestJS side, validate ID tokens in `JwtAuthGuard`

#### 2.2 Account Security Hardening
The user-facing controls that prevent account takeover.

- [ ] Email verification required before first login
- [ ] Password reset flow (magic-link or token-based), wired through [`nodemailer`](https://nodemailer.com) or [SendGrid](https://sendgrid.com)
- [ ] Mandatory MFA for `CLINICIAN`, `ADMIN`, `SUPER_ADMIN` roles (TOTP or SMS)
- [ ] Optional MFA for `PARENT` (encouraged but not blocking)
- [x] Rate-limit login attempts (already have [`@nestjs/throttler`](https://docs.nestjs.com/security/rate-limiting), apply per-IP + per-account) — `@Throttle(5/60s)` on login + google
- [ ] Account lockout after N failed attempts with admin unlock path
- [/] Session management: short-lived access tokens (15min) + refresh tokens with rotation — access token (httpOnly cookie) done; **refresh-token rotation deferred**
- [ ] Logout-everywhere endpoint that invalidates all refresh tokens
- [/] Audit log of every login, logout, password change, role change → `SystemLog` — login/logout/register done; password/role-change events deferred

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

**Roles:** `COMPLIANCE 50%` · `LEGAL 30%` · `DEV 20%` *(stakeholder-led, `COMPLIANCE` drives the Information Officer registration, RoPA, and DPA paperwork; `LEGAL` handles attorney engagement; `DEV` builds DSAR / erasure endpoints only)*

[POPIA](https://popia.co.za) (Protection of Personal Information Act, 2013) is South Africa's GDPR equivalent. We're processing **special personal information** (children's health data), which has the highest protection bar. Non-compliance penalties run to R10m or 10 years imprisonment, so this is not optional.

#### 4.1 Governance & Legal Basis
The paperwork that proves we have the right to process this data at all.

- [ ] Appoint an **Information Officer** (must be registered with the [Information Regulator](https://inforegulator.org.za)), typically the CEO/Founder by default
- [ ] Register the Information Officer at [https://justice.gov.za/inforeg/](https://justice.gov.za/inforeg/)
- [ ] Conduct and document a **Personal Information Impact Assessment (PIIA)** before launch
- [ ] Maintain a **Record of Processing Activities** (data inventory: what, why, where, how long)
- [ ] Document lawful basis for each processing purpose (consent vs. legitimate interest vs. legal obligation)
- [ ] Define and document retention periods per data category (clinical records typically 6+ years for minors, often longer post-majority)

#### 4.2 Consent & Data Subject Rights
The "user-facing" side of POPIA.

- [ ] Granular consent capture at signup (separate toggles for processing, marketing, third-party sharing)
- [ ] Consent versioning, if we change the privacy policy, re-prompt
- [ ] **Parental consent** flow: parent must consent on behalf of child under 18
- [x] Self-service Data Subject Access Request (DSAR) endpoint, export all personal data as JSON + PDF — `GET /v1/privacy/export` + `/export/pdf`, JWT-scoped to the caller
- [/] Right to erasure ("delete my account"), soft delete with 30-day grace + hard delete after retention expiry — `POST /v1/privacy/erasure` soft-deletes (sets `deletionRequestedAt`, archives children, ends session); scheduled hard-delete job deferred
- [ ] Right to rectification, users can correct their own data
- [x] Data portability, machine-readable export — JSON export

#### 4.3 Cross-Border Transfers
POPIA Section 72 restricts sending personal information outside South Africa.

- [ ] Inventory every third-party processor (Stripe, [Ozow](https://ozow.com) when added, Vercel, Neon, [Genkit](https://firebase.google.com/docs/genkit) / Google AI, SendGrid, [Sentry](https://sentry.io), etc.) and their hosting region, note that Ozow is SA-domiciled and avoids the cross-border-transfer paperwork
- [ ] Sign Data Processing Agreements (DPAs) with every one
- [ ] For non-SA processors: confirm they offer "adequate protection" (contractually via SCCs, ideally)
- [ ] Disclose all sub-processors in the public privacy policy

#### 4.4 Breach Notification
Required by POPIA Section 22, "as soon as reasonably possible" after discovery.

- [ ] Documented incident-response runbook (`docs/runbooks/data-breach.md`)
- [ ] Pre-drafted notification templates (Information Regulator + affected data subjects)
- [ ] Practice tabletop exercise once before go-live

---

> Source: [Phase 4: POPIA Compliance](../GO_LIVE.md#phase-4-popia-compliance)

### Phase 5: Security

**Roles:** `DEV 80%` · `OPS 20%` *(`DEV` does the technical hardening; `OPS` procures the pen-test vendor and runs quarterly access reviews)*

The "make sure we don't end up on the front page of [News24](https://www.news24.com)" layer. Healthcare data is a high-value target.

#### 5.1 Application Security
What lives in code.

- [x] [OWASP Top 10](https://owasp.org/www-project-top-ten/) audit (consider `/security-review` skill on every PR touching auth/data)
- [x] [Helmet](https://helmetjs.github.io) middleware on the NestJS API (CSP, HSTS, X-Frame-Options)
- [x] Strict CORS allowlist (no wildcard in prod)
- [x] Input validation via [`class-validator`](https://github.com/typestack/class-validator) on every DTO (mostly done, audit the gaps)
- [x] Output encoding / no raw `dangerouslySetInnerHTML` on user content
- [x] Rate limiting per-IP + per-user via `@nestjs/throttler` (already installed, tune limits)
- [x] Dependency scanning: [GitHub Dependabot](https://github.com/dependabot) + [`bun audit`](https://bun.sh/docs/cli/audit) in CI
- [x] Secret scanning: [GitHub secret-scanning](https://docs.github.com/en/code-security/secret-scanning) + [`trufflehog`](https://github.com/trufflesecurity/trufflehog) in pre-commit
- [x] No secrets in `.env.example` or in git history (run [`git-filter-repo`](https://github.com/newren/git-filter-repo) if any leaked)

#### 5.2 Infrastructure Security
Network, hosts, perimeter.

- [ ] WAF (Cloud Armor) in front of public endpoints with [OWASP rules](https://cloud.google.com/armor/docs/waf-rules) + geo-rate-limiting
- [ ] DDoS protection (included with Cloud Armor)
- [ ] TLS 1.2+ enforced; redirect HTTP → HTTPS; [HSTS preload](https://hstspreload.org)
- [ ] All inter-service traffic over private VPC, not public internet
- [ ] Cloud Armor bot management for `/v1/leads` and `/v1/auth/*`
- [ ] Database accessible only via private IP + Cloud SQL Auth Proxy
- [ ] No service-account JSON keys on disk, use [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity)

#### 5.3 Data Security
Protecting data at rest and in transit.

- [ ] Database encryption at rest (default on GCP / Neon, confirm and document)
- [ ] Application-level encryption for highly sensitive fields (clinician HPCSA number, child medical conditions) using [GCP KMS](https://cloud.google.com/kms)
- [ ] PII redaction in logs, no emails, names, IDs, or DOBs in log lines
- [ ] Pseudonymisation in non-prod environments (seed scripts already use synthetic data, verify no real exports leak)
- [ ] Backup encryption with [customer-managed keys (CMEK)](https://cloud.google.com/kms/docs/cmek)

#### 5.4 Operational Security
The day-to-day discipline.

- [ ] Mandatory 2FA on GitHub, GCP, Stripe, Neon, Google Workspace, domain registrar
- [ ] Hardware security keys ([YubiKey](https://www.yubico.com)) for the `SUPER_ADMIN` accounts
- [ ] Quarterly access review (who has access to what, revoke stale accounts)
- [ ] Annual third-party penetration test before launch + yearly thereafter
- [ ] Bug bounty program (start private on [HackerOne](https://www.hackerone.com) / [Bugcrowd](https://www.bugcrowd.com)) once stable

---

> Source: [Phase 5: Security](../GO_LIVE.md#phase-5-security)

### Phase 6: Legal Documents

**Roles:** `LEGAL 70%` · `PRODUCT 25%` · `DEV 5%` *(stakeholder-led, `LEGAL` engages and manages the SA attorney; `PRODUCT` negotiates B2B MSAs with first practices; `DEV` only hosts the final content in `legal/[slug]`)*

Before a single real user signs up, the legal pages need to be real, lawyer-reviewed, and version-controlled. The `legal/[slug]` route already exists in code, the actual content does not.

#### 6.1 Public-facing Documents
What every visitor sees.

- [/] **Privacy Policy**: POPIA-compliant, lists every processor, retention periods, DSAR contact
- [/] **Terms of Service**: limits of liability, dispute resolution, governing law (South African)
- [/] **Cookie Policy** + cookie consent banner (essential, functional, analytics, marketing buckets)
- [/] **Acceptable Use Policy**
- [/] **Disclaimer**: explicit "this app is not a substitute for medical advice, no clinician-patient relationship is formed by use of the platform"

#### 6.2 Role-specific Agreements
Different audiences sign different things.

- [/] **Parent EULA**: consent on behalf of minor, dispute terms, age limits
- [/] **Clinician Service Agreement**: professional indemnity disclaimers, scope of clinician obligations on the platform
- [/] **Tenant / Practice Master Services Agreement** (B2B contract for practices) + Order Form + DPA addendum
- [/] **Data Processing Agreement** (we act as processor for the tenant/practice in some flows)

#### 6.3 Internal Documents
What the team needs even if the public doesn't see it.

- [/] Incident response policy
- [/] Information security policy
- [/] Data retention & deletion policy
- [/] Acceptable use policy for staff
- [/] DPA with each subprocessor, countersigned and filed

#### 6.4 Professional Review
Don't ship lawyer documents written by an LLM.

- [/] Engage a South African attorney experienced in POPIA + healthtech (e.g. [Webber Wentzel](https://www.webberwentzel.com), [ENS Africa](https://www.ensafrica.com), or a healthtech specialist boutique)
- [/] Get sign-off on all public-facing documents
- [/] Get sign-off on the consent flow specifically (parental consent for minors is the highest-risk path)

---

> Source: [Phase 6: Legal Documents](../GO_LIVE.md#phase-6-legal-documents)

### Phase 7: Observability & Monitoring

**Roles:** `DEV 80%` · `OPS 20%` *(`DEV` wires Sentry / OTel / dashboards; `OPS` defines the on-call rotation and SLO targets)*

Production systems need eyes on them. The telemetry interfaces exist in `core/telemetry`: the actual dashboards, alerts, and runbooks do not.

#### 7.1 Logging
The boring layer that saves us at 2am.

- [x] Structured JSON logging on the NestJS API ([Pino](https://getpino.io) or [Winston](https://github.com/winstonjs/winston)) shipped to Cloud Logging
- [x] Request correlation IDs propagated through every layer
- [x] PII redaction filter (no emails, names, IDs in logs)
- [x] Log retention: 30 days hot, 1 year cold (GCS bucket)

#### 7.2 Metrics & Tracing
Knowing the system is healthy without grepping logs.

- [x] OpenTelemetry SDK wired through `core/telemetry` (interfaces already exist, concrete impls need finishing)
- [x] [Cloud Trace](https://cloud.google.com/trace) for distributed traces across web → API → DB
- [x] Cloud Monitoring dashboards for: API p50/p95/p99 latency, error rate, DB connection pool, queue depth
- [/] Custom business metrics: signups/day, verifications pending, vaccinations due

#### 7.3 Error Tracking
Knowing when things break before users tell us.

- [x] **[Sentry](https://sentry.io)** for both web (Next.js) and API (NestJS) and mobile (Expo)
- [x] Source maps uploaded on deploy
- [x] Release tagging tied to Git SHA
- [x] Alert routing: Slack `#alerts-prod` for critical, email digest for low-severity

#### 7.4 Uptime & SLOs
External-perspective monitoring.

- [x] Synthetic uptime checks every 60s (Cloud Monitoring or [BetterStack](https://betterstack.com))
- [/] Public status page (`status.raisingatlantic.com`) via BetterStack / [Statuspage](https://www.atlassian.com/software/statuspage) / [Instatus](https://instatus.com)
- [ ] Define SLOs (e.g. 99.5% monthly availability, p95 latency < 500ms) and error budgets
- [/] On-call rotation, even with a single on-call engineer, define who gets paged and how ([PagerDuty](https://www.pagerduty.com) / [OpsGenie](https://www.atlassian.com/software/opsgenie) / BetterStack)

---

> Source: [Phase 7: Observability & Monitoring](../GO_LIVE.md#phase-7-observability--monitoring)

### Phase 8: Email, SMS & Notifications

**Roles:** `DEV 50%` · `MARKETING 25%` · `DESIGN 25%` *(`DEV` integrates SendGrid/Twilio; `MARKETING` writes template copy; `DESIGN` produces branded HTML templates and the press-pack visuals)*

`nodemailer` is wired into the API but no real provider is configured. Almost every flow (signup, verification, password reset, vaccination reminder, billing) needs reliable transactional comms.

> **Wrapper landed (2026-06-02):** framework-agnostic notification ports + dispatcher live at `src/core/notifications/`, wired into call sites with `TODO(phase-8)` seams. Provider swap is a single-file change in `src/apps/api/src/notifications/notifications.module.ts`. See [PHASE_8_TODO.md](./PHASE_8_TODO.md).

#### 8.1 Transactional Email
The "click here to verify your account" pipe.

- [ ] Choose provider: **SendGrid**, **[Postmark](https://postmarkapp.com)**, or **[AWS SES](https://aws.amazon.com/ses/)** (SendGrid has the best ZA deliverability)
- [ ] Configure custom sending domain `mail.raisingatlantic.com` with SPF + DKIM + DMARC
- [ ] Branded HTML templates (welcome, verification, password reset, EPI-due reminder, billing receipt, lead notification)
- [ ] Bounce + complaint handling (auto-suppress invalid addresses)
- [ ] One-click unsubscribe headers for marketing email

#### 8.2 SMS / WhatsApp
For appointment reminders and high-priority vaccination alerts where email isn't enough.

- [ ] Choose provider: **[Twilio](https://www.twilio.com)** (international + WhatsApp), **[Clickatell](https://www.clickatell.com)** (ZA-focused), or **[Infobip](https://www.infobip.com)**
- [ ] [WhatsApp Business API](https://business.whatsapp.com/products/business-platform) approval (templates need pre-approval)
- [ ] Opt-in capture before sending any SMS/WhatsApp message
- [ ] Stop-word handling (STOP / OPT-OUT / UITSKAKEL)

#### 8.3 Push Notifications (Mobile)
For the Expo app.

- [ ] Configure [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/) (uses [APNs](https://developer.apple.com/documentation/usernotifications) + [FCM](https://firebase.google.com/docs/cloud-messaging) under the hood)
- [ ] Token storage on `User` entity, refresh on app launch
- [ ] Notification preferences UI (which categories the user wants)
- [ ] Quiet hours (no 3am vaccination reminders)

---

> Source: [Phase 8: Email, SMS & Notifications](../GO_LIVE.md#phase-8-email-sms--notifications)

### Phase 9: CI/CD & Release Engineering

**Roles:** `DEV 100%` *(end-to-end engineering; nothing here is delegable)*

The current Moon `deploy-test` / `deploy-prod` tasks are git-merge wrappers, which is fine for solo work but won't scale and won't gate on tests. **Two pipelines need to coexist cleanly: the infrastructure pipeline (Phase 1.4) and the application pipeline (this phase).** The boundary matters: the infra pipeline owns the *shape* of a Cloud Run service; the app pipeline owns the *image tag* deployed to it. Mixing them produces deadlocks where a code deploy waits on infra reviewers and vice versa.

#### 9.1 Continuous Integration (Application Code)
Every PR must prove it doesn't break things before it merges.

- [x] GitHub Actions workflow on every PR running: `moon run :lint`, `moon run :test`, type-check, security audit
- [x] Required checks: API Jest, Web build, Mobile [EAS Build](https://docs.expo.dev/build/introduction/) (preview), Cypress E2E (smoke), Postman contract suite
- [x] Block merges to `main` and `test` without passing checks + 1 review (review rule + branch protection both managed via Terraform, see [§1.4](#14-infrastructure-as-code-terraform--github-actions))
- [x] Container images for API + web built once on merge, tagged with the Git SHA, pushed to **Artifact Registry** in `africa-south1`
- [x] SBOM generation ([`syft`](https://github.com/anchore/syft)) + image signing ([`cosign`](https://github.com/sigstore/cosign)), required for production deploys
- [x] Vulnerability scan on built images ([`trivy`](https://trivy.dev) / Artifact Registry's built-in scanning), block on critical CVEs

#### 9.2 Continuous Deployment (Application Code)
Getting code into production reliably. The deploy step is just `gcloud run deploy --image=...` (or a thin TF stanza using `google_cloud_run_v2_service` with the new image tag), it does **not** re-plan the whole infra stack.

- [x] `dev` branch → auto-deploy to dev environment on every push
- [x] `test` branch → auto-deploy to staging
- [x] `main` branch → auto-deploy to production with manual approval gate (GitHub Environments + required reviewers)
- [x] App workflow authenticates to GCP via the same Workload Identity Federation as the infra workflow, but with a **separate, scoped** deployer SA (`app-deployer-prod@…`) that only has `roles/run.developer` on the relevant Cloud Run service, not org-wide infra rights
- [x] Database migrations run automatically pre-deploy with rollback safety (TypeORM `migration:run` step before traffic flip)
- [x] Blue/green or canary rollout strategy on Cloud Run (10% → 50% → 100% via [tagged revisions](https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration))
- [x] Automated rollback on error-rate spike (Cloud Monitoring alert → Cloud Run revision rollback action)

#### 9.3 Coordinating Infra and App Pipelines
The two pipelines should compose, not conflict.

- [x] Document the contract: **infra pipeline owns** the Cloud Run service resource, env vars, secret bindings, scaling config, IAM, and networking; **app pipeline owns** the deployed image tag and the migration step
- [x] In Terraform, set `lifecycle { ignore_changes = [template[0].containers[0].image] }` on the `google_cloud_run_v2_service` resource so an infra `terraform apply` doesn't roll back a fresh app deploy
- [x] If an infra change *also* requires a code change (e.g. new env var the app reads), land the infra PR first, then the app PR, never the reverse
- [x] Both pipelines post to Slack `#deploys` so we can see ordering at a glance

#### 9.4 Environment Parity
The "works on my machine" prevention layer.

- [x] Three environments: `dev`, `staging` (test), `prod`
- [x] Each environment has its own Cloud SQL DB, Stripe keys (test in dev/staging, live in prod), Sentry project, and **its own GCP project** (project-level isolation > namespace-level)
- [x] Synthetic data only in dev/staging, no production data ever flows backwards (enforce via VPC Service Controls, see [§1.2](#12-gcp-foundation-recommended-path))
- [x] Feature flags via **[GrowthBook](https://www.growthbook.io)** / **[Flagsmith](https://www.flagsmith.com)** / **[PostHog](https://posthog.com)** for risky launches (provider managed via Terraform)

---

> Source: [Phase 9: CI/CD & Release Engineering](../GO_LIVE.md#phase-9-cicd--release-engineering)

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

**Roles:** `OPS 60%` · `DEV 40%` *(`OPS` provisions the Slack workspace, channels, SSO, vendor accounts, DMARC, email aliases; `DEV` wires the technical webhook integrations)*

We already use Google Workspace + GitHub. The pain point is WhatsApp as the single firehose.

#### 11.1 Should We Use Slack?: Recommendation
**Yes, set up [Slack](https://slack.com) now, even with a one-person team today.** Here's the plain-language reason: WhatsApp's single-thread model conflates everything into one stream. As soon as we add a clinician advisor, a contracted designer, or a freelance lawyer, the signal-to-noise ratio collapses. Slack lets us separate conversations into focused channels (`#alerts-prod`, `#sales-leads`, `#legal`, `#release-notes`) and, more importantly, gives us a webhook target for every external system (GitHub, Sentry, Stripe, GCP alerts, BetterStack uptime, Cloud Build). That alone is worth the setup, because right now we have nowhere good to send those alerts. The Slack free tier is sufficient for solo work; upgrade to **[Pro (~$8/user/mo)](https://slack.com/pricing)** when we need full message history.

The realistic alternative is **[Discord](https://discord.com)** (free unlimited history, good for community work later) or **[Microsoft Teams](https://www.microsoft.com/microsoft-teams)** (already-paid if we were on Microsoft 365, we're not, we're on Google Workspace). Slack is the standard answer for engineering-led B2B SaaS in 2026.

- [ ] Create Slack workspace `raisingatlantic.slack.com` tied to Google Workspace SSO
- [ ] Channel layout:
  - `#general`: announcements
  - `#dev`: engineering discussion
  - `#alerts-prod`: Sentry, Cloud Monitoring, uptime checks (high-signal only)
  - `#alerts-dev`: non-prod noise (low-signal, no notifications)
  - `#deploys`: CI/CD pipeline events
  - `#sales-leads`: `/v1/leads` webhook
  - `#stripe`: payment events (charges, failures, churn)
  - `#legal-compliance`: POPIA, Information Regulator, lawyer threads
  - `#clinician-feedback`: direct line from advisory clinicians
  - `#random`: non-work
- [ ] Slack integrations:
  - [ ] [GitHub for Slack](https://slack.github.com) (PR notifications, deploy events)
  - [ ] [Sentry for Slack](https://docs.sentry.io/organization/integrations/notification-incidents/slack/) (error spikes)
  - [ ] [Stripe for Slack](https://stripe.com/partners/slack) (payment events)
  - [ ] GCP Cloud Monitoring (alerts via [webhook → Slack](https://cloud.google.com/monitoring/support/notification-options#webhooks))
  - [ ] BetterStack / Statuspage (uptime)
  - [ ] [Linear](https://linear.app) or [Notion](https://www.notion.so) (task tracking)
  - [ ] Calendar bot (daily standup nudge, keeps habit)
- [ ] Set up `@raisingatlantic-bot` for slash commands (e.g. `/deploy prod`, `/incident open`)
- [ ] Document channel-purpose rules in `#general` topic

#### 11.2 Other Workspace Tooling
The supporting tools around Slack.

- [ ] **Linear** or **Notion** for issue tracking, recommendation: Linear (faster, opinionated, cheaper than [Jira](https://www.atlassian.com/software/jira))
- [ ] **Notion** for the company wiki + SOPs + runbooks
- [ ] **[1Password Business](https://1password.com/business)** (or [Bitwarden](https://bitwarden.com)) for shared secrets, never share via Slack/email
- [ ] **[Calendly](https://calendly.com)** linked to Google Calendar for clinician advisor calls
- [ ] **[Loom](https://www.loom.com)** for async video walkthroughs (saves a lot of explaining)
- [ ] **[DocSend](https://www.docsend.com)** or **[PandaDoc](https://www.pandadoc.com)** for sending NDAs and contracts to advisors / first practices

#### 11.3 Domain & Email Hygiene
Things that should "just work" but bite if neglected.

- [ ] Configure [DMARC](https://dmarc.org) on `raisingatlantic.com` (start at `p=none`, monitor reports for 30 days, then move to `quarantine` then `reject`)
- [ ] Distinct email aliases: `support@`, `security@`, `privacy@`, `legal@`, `billing@`, `noreply@`: all routed appropriately
- [ ] [`security.txt`](https://securitytxt.org) published at `https://raisingatlantic.com/.well-known/security.txt` with vulnerability-disclosure contact
- [ ] Domain auto-renew enabled with backup payment method

---

> Source: [Phase 11: Workspace & Communications](../GO_LIVE.md#phase-11-workspace--communications)

### Phase 12: Pre-Launch Testing

**Roles:** `DEV 50%` · `CLINICAL 25%` · `PRODUCT 25%` *(`DEV` writes automation; `CLINICAL` is the registered paediatrician validating EPI / milestones / growth charts; `PRODUCT` recruits and manages closed-beta practices)*

The final shake-out before real parents and clinicians.

#### 12.1 Automated Coverage
- [/] Unit test coverage > 70% on API business logic (verifications, EPI scheduling, growth percentile calc) — baseline 66.55% lines / 53.70% functions / 46.25% branches (PR #7, 2026-05-24); floor enforced in CI at lines/statements 65, functions 50, branches 45; gap to 70% closes once growth-percentile + EPI-scheduling specs are added
- [x] Cypress smoke suite on every prod deploy
- [x] Postman contract tests run nightly against staging
- [ ] Mobile E2E ([Detox](https://wix.github.io/Detox/) or [Maestro](https://maestro.mobile.dev)) on critical flows: signup, add child, log growth

#### 12.2 Manual / Exploratory
- [ ] Internal alpha, the team + 2-3 friendly testers for 2 weeks
- [ ] Clinical accuracy review by a registered paediatrician (EPI schedule, milestone wording, growth chart correctness)
- [ ] Accessibility audit ([axe-core](https://github.com/dequelabs/axe-core) + manual keyboard nav + screen reader on dashboard)
- [ ] Multi-language QA (i18n is wired, verify Afrikaans + Zulu translations are actually correct)
- [ ] Mobile device matrix, at minimum: iPhone 13, Pixel 7, mid-range Android (Samsung A-series)

#### 12.3 Performance & Load
- [x] [Lighthouse](https://developer.chrome.com/docs/lighthouse) score > 90 on landing page
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
- [x] [Open Graph](https://ogp.me) + [Twitter card](https://developer.x.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) metadata on every public route
- [x] Sitemap + robots.txt + [Google Search Console](https://search.google.com/search-console) verification
- [x] Analytics: **[Plausible](https://plausible.io)** or **PostHog** (POPIA-friendlier than [GA4](https://marketingplatform.google.com/about/analytics/)), avoid GA4 unless we have a clean DPA story
- [ ] Launch announcement channels: [LinkedIn](https://www.linkedin.com), paediatric-association mailing lists, parenting groups
- [ ] Press kit (logo, screenshots, founder bio, one-pager) hosted on the marketing site
- [ ] Pricing-page CTA → Stripe Checkout (live)
- [ ] Demo booking flow via Calendly for B2B (practice / tenant) sales

---

> Source: [Phase 13: Launch & Marketing](../GO_LIVE.md#phase-13-launch--marketing)

### Phase 14: Post-Launch Operations

**Roles:** `SUPPORT 30%` · `OPS 25%` · `FINANCE 25%` · `DEV 20%` *(stakeholder-heavy, `SUPPORT` runs the helpdesk + FAQ; `OPS` runs weekly metrics review and quarterly drills; `FINANCE` owns Xero, VAT, PAYE, R&D incentive; `DEV` only handles engineering follow-ups)*

What "running" the business actually looks like once real users are in.

#### 14.1 Support
- [ ] Inbound support inbox (`support@raisingatlantic.com`) routed to a helpdesk ([Help Scout](https://www.helpscout.com), [Zendesk](https://www.zendesk.com), or [Plain](https://www.plain.com))
- [ ] In-app help widget ([Intercom](https://www.intercom.com) / [Crisp](https://crisp.chat) / Plain), but only if budget allows; email is fine to start
- [ ] Public FAQ + troubleshooting docs
- [ ] SLA targets (e.g. P0 response < 2h, P1 < 24h, P2 < 5 business days)

#### 14.2 Operational Cadence
- [ ] Weekly metrics review (signups, MRR, error rate, NPS)
- [ ] Monthly security review (access audit, dependency upgrades, log review)
- [ ] Quarterly DR drill (database restore + failover)
- [ ] Annual penetration test
- [ ] Annual POPIA review (Information Regulator updates, retention purges)

#### 14.3 Financial Operations
- [ ] Bookkeeping, **[Xero](https://www.xero.com)** or **[QuickBooks Online](https://quickbooks.intuit.com)** with Stripe integration
- [ ] South African company tax registration (Income Tax + VAT + PAYE if/when we hire)
- [ ] [R&D tax incentive (Section 11D)](https://www.dst.gov.za/index.php/programmes/r-d-tax-incentive), speak to a SA tax accountant if applicable
- [ ] Founder personal liability ringfencing, confirm Pty Ltd structure, separate accounts, board minutes

---

> Source: [Phase 14: Post-Launch Operations](../GO_LIVE.md#phase-14-post-launch-operations)

### Phase 15: Mobile Feature Parity

**Roles:** `DEV 80%` · `PRODUCT 10%` · `DESIGN 10%` *(`DEV` builds the screens, hooks, and integrations; `PRODUCT` signs off on which flows are mobile-essential vs web-only; `DESIGN` adapts existing web patterns to React Native primitives)*

The Expo app is fully scaffolded but **17 of 18 screens still render `ComingSoon` or placeholder cards**. Auth is fixture-only (`signInAs(role)`). [Phase 10: Mobile App Release](#phase-10-mobile-app-release) submits the binary; this phase makes sure there is a real product behind the icon. Admin tooling stays web-only by design (see §15.7 in [GO_LIVE.md](../GO_LIVE.md#157-explicitly-out-of-scope-web-only)).

#### 15.1 Starting State

| Layer | Status | Notes |
| --- | --- | --- |
| Routing, theme, Axios, React Query | ✅ | Scaffold is solid |
| Auth context | ⚠️ Fixture only | `signInAs(role)` loads hard-coded user |
| Token storage | ⚠️ `AsyncStorage` | Must move to `expo-secure-store` |
| Domain hooks (`children`, `reports`, …) | ❌ | None ported from web |
| Parent screens (5 of 6) | ❌ | `ComingSoon` placeholder |
| Clinician screens (4 of 5) | ❌ | `ComingSoon` placeholder |
| Push notifications, biometrics, offline cache | ❌ | Not yet integrated |

#### 15.2 Mobile Auth & Session
- [ ] Replace fixture `signInAs` with real `POST /v1/auth/login` (mirror web client)
- [ ] Move JWT to **[expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)** — non-negotiable under POPIA for special personal info
- [ ] Biometric unlock via **[expo-local-authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)**; fall back to password
- [ ] Refresh-token rotation parity with web ([§2](#phase-2-authentication--identity))
- [ ] "Sign out everywhere" surfaced from device-list endpoint ([§5.4](#54-operational-security))
- [ ] Force-upgrade gate on deprecated client version, blocking "update required" screen with store deep link

#### 15.3 Parent Core Flows
- [ ] **Children** (`(parent)/children.tsx`): list, add, edit, soft-delete (archive-before-erase)
- [ ] **Growth records**: log height/weight, WHO percentile chart, scrollable history
- [ ] **Milestones**: browse catalogue by age band, log with optional photo + note
- [ ] **Vaccinations**: EPI-SA schedule per child, mark dose administered, due / overdue / upcoming
- [ ] **Triage tools**: fever guide, head injury, dose calculator, home care — **offline-first static content**
- [ ] **Directory**: read-only browse of clinicians + practices (`usePublicClinicians` / `usePublicPractices`)
- [ ] **Messages**: read-only notification inbox backed by §15.6 push history

#### 15.4 Clinician Core Flows
- [ ] **Patients** (`(clinician)/patients.tsx`): tenant + practice-scoped list, search, open summary
- [ ] **Patient summary**: read-only growth + milestone + vaccination history (mirrors parent records views, no mutation)
- [ ] **Verifications**: list `PENDING_ASSESSMENT`, approve / reject with note via `useDecideRecordVerification`
- [ ] **Schedule**: today's appointments, read-only; push reminders depend on [§8.3](#83-push-notifications-mobile)
- [ ] Tenant-scoping verified end-to-end — cross-tenant data access is a critical security boundary

#### 15.5 Shared Data Layer
- [ ] Mirror domain hooks from web (`children`, `reports`, `verifications`, `directory`, `master-data`) into `src/apps/mobile/lib/api/hooks/`
- [ ] Share query-key conventions across web + mobile
- [ ] React Query persistence via [`@tanstack/react-query-persist-client`](https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient) + AsyncStorage for offline reads
- [ ] Optimistic mutations with rollback for log-growth / log-vaccination (flaky-network resilience)
- [ ] Global offline banner + per-screen empty-states distinguish "no data" from "no network"
- [ ] Error boundary parity with web (`FeatureErrorBoundary`, `RouteError`)
- [ ] EAS-build env flag equivalent to `NEXT_PUBLIC_USE_API` for demo / store-review builds; production defaults to live API

#### 15.6 Mobile-First Capabilities
- [ ] **[Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)** end-to-end (depends on [§8.3](#83-push-notifications-mobile)): EPI due, record verification, appointment reminder — **quiet hours respected**
- [ ] Deep linking from notifications into child / record (`expo-router` config + APNs / FCM payload schema documented)
- [ ] **Camera** (`expo-camera`): photograph vaccination card, attach to record. GCS signed-URL upload, no PII in filename / metadata
- [ ] **Document scan**: HPCSA / SANC card capture for clinician verification ([§2.3](#23-clinician-verification-workflow)) — on-device until explicit submit
- [ ] **App-state lock**: re-prompt biometric on background-return after N minutes (POPIA reasonableness, configurable per role)
- [ ] **Sentry-mobile** with PII scrubbing on breadcrumbs ([§7.3](#73-error-tracking))

#### 15.7 Explicitly Out of Scope (web-only)
- ❌ Admin console: user management, system logs, system settings, tenant management — **admin route group stays scaffolded but is not fleshed out**
- ❌ Blog editor (SUPER_ADMIN content workflow)
- ❌ Stripe Customer Portal billing UI — deep-link to web `/dashboard/account/billing`
- ❌ Bulk CSV export / DSAR file download — handled via the web flow ([§4.2](#42-consent--data-subject-rights))
- ❌ Multi-pane clinician verification with attached evidence — desktop only; mobile is approve / reject only

#### 15.8 Definition of Done
- [ ] No `ComingSoon` in `(parent)` or `(clinician)` route groups
- [ ] TestFlight + Internal Track builds demoable end-to-end on parent + clinician primary flows
- [ ] Detox / Maestro E2E ([§12.1](#121-automated-coverage)) covers: signup → add child → log growth → log vaccination → push reminder → clinician approval
- [ ] Production builds use the real `/v1/` API by default; no fixture data path active
- [ ] Sentry crash-free sessions > 99% on internal testing for 7 days
- [ ] Tenant boundary verified manually + via Postman (clinician cannot see other-tenant patients)
- [ ] Phase 10 (store submission) can proceed honestly: every Apple / Google data-safety form question has a truthful answer because the features actually exist

---

> **End of phase walkthrough.** For the consolidated launch-day checklist, jump back to the [TL;DR: Phased Action Plan](#tldr-phased-action-plan) at the top of this document.

> Source: [Phase 15: Mobile Feature Parity](../GO_LIVE.md#phase-15-mobile-feature-parity)
