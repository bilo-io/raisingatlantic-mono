# Raising Atlantic Go-Live: `SUPPORT` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `SUPPORT` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** Inbox triage, FAQ maintenance, SLA response, customer escalations.

**Phase involvement:**

- [Phase 14: Post-Launch Operations](#phase-14-post-launch-operations): `SUPPORT 30%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `SUPPORT` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `SUPPORT` are marked N/A.

### 🔴 Required (non-negotiable) before release

N/A

### 🟠 Follow-up Tier 1 (release week + first month)

Not strictly blocking, but embarrassing or risky if they slip past week 4 of being live.

**Roles:** `DEV 50%` · `OPS 15%` · `MARKETING 10%` · `DESIGN 10%` · `PRODUCT 5%` · `FINANCE 5%` · `SUPPORT 5%` *(branded emails, Slack workspace, helpdesk inbox, mobile-store listings, Xero setup all need stakeholder hands)*

**`SUPPORT`: customer-facing helpdesk**

- [ ] **Public FAQ + `support@raisingatlantic.com` helpdesk** ([§14.1](#141-support))

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

N/A

### 🟢 Follow-up Tier 3 (first quarter post-launch)

N/A

### 🔵 Future work (likely outside this document's scope)

N/A

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `SUPPORT` share are marked N/A with a back-link.

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

N/A. See [Phase 5: Security](../GO_LIVE.md#phase-5-security) in the source document for context.

### Phase 6: Legal Documents

N/A. See [Phase 6: Legal Documents](../GO_LIVE.md#phase-6-legal-documents) in the source document for context.

### Phase 7: Observability & Monitoring

N/A. See [Phase 7: Observability & Monitoring](../GO_LIVE.md#phase-7-observability--monitoring) in the source document for context.

### Phase 8: Email, SMS & Notifications

N/A. See [Phase 8: Email, SMS & Notifications](../GO_LIVE.md#phase-8-email-sms--notifications) in the source document for context.

### Phase 9: CI/CD & Release Engineering

N/A. See [Phase 9: CI/CD & Release Engineering](../GO_LIVE.md#phase-9-cicd--release-engineering) in the source document for context.

### Phase 10: Mobile App Release

N/A. See [Phase 10: Mobile App Release](../GO_LIVE.md#phase-10-mobile-app-release) in the source document for context.

### Phase 11: Workspace & Communications

N/A. See [Phase 11: Workspace & Communications](../GO_LIVE.md#phase-11-workspace--communications) in the source document for context.

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
