# Raising Atlantic Go-Live: `CLINICAL` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `CLINICAL` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** Paediatric advisor: EPI-SA schedule accuracy, milestone wording, growth-chart correctness.

**Phase involvement:**

- [Phase 12: Pre-Launch Testing](#phase-12-pre-launch-testing): `CLINICAL 25%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `CLINICAL` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `CLINICAL` are marked N/A.

### 🔴 Required (non-negotiable) before release

The minimum viable launch list. Skip any of these and we are either non-compliant, insecure, or unable to operate.

**Roles:** `DEV 45%` · `COMPLIANCE 15%` · `LEGAL 12%` · `PRODUCT 10%` · `OPS 10%` · `FINANCE 5%` · `CLINICAL 3%` *(over half of this tier is non-engineering, Information Officer, DPAs, lawyer-reviewed legal docs, Stripe KYC, beta recruitment)*

**`CLINICAL` + `PRODUCT`: beta validation**

- [ ] **Closed beta with ≥1 real practice for ≥30 days**, zero P0 bugs in last 14 days ([§12.4](#124-closed-beta))

### 🟠 Follow-up Tier 1 (release week + first month)

N/A

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

Conversion-uplift and ops-quality work that pays back fast once real users are flowing.

**Roles:** `DEV 50%` · `MARKETING 20%` · `DESIGN 15%` · `PRODUCT 10%` · `OPS 5%` *(press kit, multi-language QA validation, LinkedIn launch, content calendar all sit with stakeholders)*

**`CLINICAL` + `DEV`: localisation QA**

- [ ] **Multi-language QA**: Afrikaans + Zulu translations validated by native speakers ([§12.2](#122-manual--exploratory))

### 🟢 Follow-up Tier 3 (first quarter post-launch)

N/A

### 🔵 Future work (likely outside this document's scope)

On the radar but not load-bearing for the SA launch. Re-evaluate at the 6-month mark; some of these may belong in their own RFCs rather than this checklist.

**Roles:** `PRODUCT 30%` · `DEV 30%` · `COMPLIANCE 15%` · `LEGAL 10%` · `FINANCE 5%` · `CLINICAL 5%` · `MARKETING 5%` *(mostly strategic decisions, African expansion, SOC 2 / HIPAA scoping, advisory-board recruitment, R&D incentive, `DEV` only does the engineering follow-through)*

**`CLINICAL` + `DEV`: clinical maturation**

- [ ] **Genkit AI clinical-summary maturation** beyond the current placeholder ([§4.3](#43-cross-border-transfers))

**`CLINICAL` + `PRODUCT`: clinical governance**

- [ ] **External clinical advisory board** of registered paediatricians beyond the launch reviewer ([§12.2](#122-manual--exploratory))

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `CLINICAL` share are marked N/A with a back-link.

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

N/A. See [Phase 13: Launch & Marketing](../GO_LIVE.md#phase-13-launch--marketing) in the source document for context.

### Phase 14: Post-Launch Operations

N/A. See [Phase 14: Post-Launch Operations](../GO_LIVE.md#phase-14-post-launch-operations) in the source document for context.
