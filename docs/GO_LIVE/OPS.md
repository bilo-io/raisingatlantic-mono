# Raising Atlantic Go-Live: `OPS` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `OPS` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** Workspace admin, account provisioning, vendor procurement, pen-test / audit scheduling, on-call cadence, access reviews.

**Phase involvement:**

- [Phase 5: Security](#phase-5-security): `OPS 20%`
- [Phase 7: Observability & Monitoring](#phase-7-observability--monitoring): `OPS 20%`
- [Phase 11: Workspace & Communications](#phase-11-workspace--communications): `OPS 60%`
- [Phase 14: Post-Launch Operations](#phase-14-post-launch-operations): `OPS 25%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `OPS` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `OPS` are marked N/A.

### 🔴 Required (non-negotiable) before release

The minimum viable launch list. Skip any of these and we are either non-compliant, insecure, or unable to operate.

**Roles:** `DEV 45%` · `COMPLIANCE 15%` · `LEGAL 12%` · `PRODUCT 10%` · `OPS 10%` · `FINANCE 5%` · `CLINICAL 3%` *(over half of this tier is non-engineering, Information Officer, DPAs, lawyer-reviewed legal docs, Stripe KYC, beta recruitment)*

**`OPS`: workspace, vendor & access hygiene**

- [ ] **Mandatory 2FA** on GitHub, GCP, Stripe, Neon, Google Workspace, domain registrar ([§5.4](#54-operational-security))
- [ ] **Penetration test** vendor procured; P0/P1 findings remediated ([§5.4](#54-operational-security))
- [ ] **DMARC enforced** + `security.txt` published ([§5.1](#51-application-security), [§11.3](#113-domain--email-hygiene))

### 🟠 Follow-up Tier 1 (release week + first month)

Not strictly blocking, but embarrassing or risky if they slip past week 4 of being live.

**Roles:** `DEV 50%` · `OPS 15%` · `MARKETING 10%` · `DESIGN 10%` · `PRODUCT 5%` · `FINANCE 5%` · `SUPPORT 5%` *(branded emails, Slack workspace, helpdesk inbox, mobile-store listings, Xero setup all need stakeholder hands)*

**`OPS`: workspace bring-up**

- [ ] **Slack workspace operational** with `#alerts-prod`, `#deploys`, `#stripe`, `#sales-leads` integrations live ([§11.1](#111-should-we-use-slack-recommendation))

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

Conversion-uplift and ops-quality work that pays back fast once real users are flowing.

**Roles:** `DEV 50%` · `MARKETING 20%` · `DESIGN 15%` · `PRODUCT 10%` · `OPS 5%` *(press kit, multi-language QA validation, LinkedIn launch, content calendar all sit with stakeholders)*

**`OPS`: knowledge base & ticketing**

- [ ] **Linear + Notion** fully populated; runbooks committed to Notion ([§11.2](#112-other-workspace-tooling))

### 🟢 Follow-up Tier 3 (first quarter post-launch)

Maturity work, the shift from "launched" to "grown-up".

**Roles:** `DEV 55%` · `OPS 25%` · `COMPLIANCE 10%` · `PRODUCT 10%` *(quarterly DR drills, access reviews, annual POPIA review, YubiKey rollout, GA-readiness sign-off live with stakeholders)*

**`OPS`: operational cadence & access**

- [ ] **Quarterly DR drill** + quarterly access review established as routine ([§14.2](#142-operational-cadence))
- [ ] **Bug bounty (private)** on [HackerOne](https://www.hackerone.com) or [Bugcrowd](https://www.bugcrowd.com) ([§5.4](#54-operational-security))
- [ ] **Hardware security keys ([YubiKey](https://www.yubico.com))** rolled out to all admins beyond `SUPER_ADMIN` ([§5.4](#54-operational-security))

### 🔵 Future work (likely outside this document's scope)

N/A

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `OPS` share are marked N/A with a back-link.

### Phase 0: Minimum Viable Product

N/A. See [Phase 0: Minimum Viable Product](../GO_LIVE.md#phase-0-minimum-viable-product) in the source document for context.

### Phase 1: Infrastructure & Hosting Decision

N/A. See [Phase 1: Infrastructure & Hosting Decision](../GO_LIVE.md#phase-1-infrastructure--hosting-decision) in the source document for context.

### Phase 2: Authentication & Identity

N/A. See [Phase 2: Authentication & Identity](../GO_LIVE.md#phase-2-authentication--identity) in the source document for context.

### Phase 3: Payments

N/A. See [Phase 3: Payments](../GO_LIVE.md#phase-3-payments) in the source document for context.

### Phase 4: POPIA Compliance

N/A. See [Phase 4: POPIA Compliance](../GO_LIVE.md#phase-4-popia-compliance) in the source document for context.

### Phase 5: Security

**Roles:** `DEV 80%` · `OPS 20%` *(`DEV` does the technical hardening; `OPS` procures the pen-test vendor and runs quarterly access reviews)*

The "make sure we don't end up on the front page of [News24](https://www.news24.com)" layer. Healthcare data is a high-value target.

#### 5.1 Application Security
What lives in code.

- [ ] [OWASP Top 10](https://owasp.org/www-project-top-ten/) audit (consider `/security-review` skill on every PR touching auth/data)
- [ ] [Helmet](https://helmetjs.github.io) middleware on the NestJS API (CSP, HSTS, X-Frame-Options)
- [ ] Strict CORS allowlist (no wildcard in prod)
- [ ] Input validation via [`class-validator`](https://github.com/typestack/class-validator) on every DTO (mostly done, audit the gaps)
- [ ] Output encoding / no raw `dangerouslySetInnerHTML` on user content
- [ ] Rate limiting per-IP + per-user via `@nestjs/throttler` (already installed, tune limits)
- [ ] Dependency scanning: [GitHub Dependabot](https://github.com/dependabot) + [`bun audit`](https://bun.sh/docs/cli/audit) in CI
- [ ] Secret scanning: [GitHub secret-scanning](https://docs.github.com/en/code-security/secret-scanning) + [`trufflehog`](https://github.com/trufflesecurity/trufflehog) in pre-commit
- [ ] No secrets in `.env.example` or in git history (run [`git-filter-repo`](https://github.com/newren/git-filter-repo) if any leaked)

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

N/A. See [Phase 6: Legal Documents](../GO_LIVE.md#phase-6-legal-documents) in the source document for context.

### Phase 7: Observability & Monitoring

**Roles:** `DEV 80%` · `OPS 20%` *(`DEV` wires Sentry / OTel / dashboards; `OPS` defines the on-call rotation and SLO targets)*

Production systems need eyes on them. The telemetry interfaces exist in `core/telemetry`: the actual dashboards, alerts, and runbooks do not.

#### 7.1 Logging
The boring layer that saves us at 2am.

- [ ] Structured JSON logging on the NestJS API ([Pino](https://getpino.io) or [Winston](https://github.com/winstonjs/winston)) shipped to Cloud Logging
- [ ] Request correlation IDs propagated through every layer
- [ ] PII redaction filter (no emails, names, IDs in logs)
- [ ] Log retention: 30 days hot, 1 year cold (GCS bucket)

#### 7.2 Metrics & Tracing
Knowing the system is healthy without grepping logs.

- [ ] OpenTelemetry SDK wired through `core/telemetry` (interfaces already exist, concrete impls need finishing)
- [ ] [Cloud Trace](https://cloud.google.com/trace) for distributed traces across web → API → DB
- [ ] Cloud Monitoring dashboards for: API p50/p95/p99 latency, error rate, DB connection pool, queue depth
- [ ] Custom business metrics: signups/day, verifications pending, vaccinations due

#### 7.3 Error Tracking
Knowing when things break before users tell us.

- [ ] **[Sentry](https://sentry.io)** for both web (Next.js) and API (NestJS) and mobile (Expo)
- [ ] Source maps uploaded on deploy
- [ ] Release tagging tied to Git SHA
- [ ] Alert routing: Slack `#alerts-prod` for critical, email digest for low-severity

#### 7.4 Uptime & SLOs
External-perspective monitoring.

- [ ] Synthetic uptime checks every 60s (Cloud Monitoring or [BetterStack](https://betterstack.com))
- [ ] Public status page (`status.raisingatlantic.com`) via BetterStack / [Statuspage](https://www.atlassian.com/software/statuspage) / [Instatus](https://instatus.com)
- [ ] Define SLOs (e.g. 99.5% monthly availability, p95 latency < 500ms) and error budgets
- [ ] On-call rotation, even with a single on-call engineer, define who gets paged and how ([PagerDuty](https://www.pagerduty.com) / [OpsGenie](https://www.atlassian.com/software/opsgenie) / BetterStack)

---

> Source: [Phase 7: Observability & Monitoring](../GO_LIVE.md#phase-7-observability--monitoring)

### Phase 8: Email, SMS & Notifications

N/A. See [Phase 8: Email, SMS & Notifications](../GO_LIVE.md#phase-8-email-sms--notifications) in the source document for context.

### Phase 9: CI/CD & Release Engineering

N/A. See [Phase 9: CI/CD & Release Engineering](../GO_LIVE.md#phase-9-cicd--release-engineering) in the source document for context.

### Phase 10: Mobile App Release

N/A. See [Phase 10: Mobile App Release](../GO_LIVE.md#phase-10-mobile-app-release) in the source document for context.

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

N/A. See [Phase 12: Pre-Launch Testing](../GO_LIVE.md#phase-12-pre-launch-testing) in the source document for context.

### Phase 13: Launch & Marketing

N/A. See [Phase 13: Launch & Marketing](../GO_LIVE.md#phase-13-launch--marketing) in the source document for context.

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

> **End of phase walkthrough.** For the consolidated launch-day checklist, jump back to the [TL;DR: Phased Action Plan](#tldr-phased-action-plan) at the top of this document.

> Source: [Phase 14: Post-Launch Operations](../GO_LIVE.md#phase-14-post-launch-operations)
