# Raising Atlantic Go-Live: `COMPLIANCE` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `COMPLIANCE` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** POPIA-specific work: Information Officer registration, Record of Processing Activities, breach tabletop drills, sub-processor disclosures.

**Phase involvement:**

- [Phase 4: POPIA Compliance](#phase-4-popia-compliance): `COMPLIANCE 50%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `COMPLIANCE` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `COMPLIANCE` are marked N/A.

### 🔴 Required (non-negotiable) before release

The minimum viable launch list. Skip any of these and we are either non-compliant, insecure, or unable to operate.

**Roles:** `DEV 45%` · `COMPLIANCE 15%` · `LEGAL 12%` · `PRODUCT 10%` · `OPS 10%` · `FINANCE 5%` · `CLINICAL 3%` *(over half of this tier is non-engineering, Information Officer, DPAs, lawyer-reviewed legal docs, Stripe KYC, beta recruitment)*

**`COMPLIANCE`: POPIA accountability**

- [ ] **Information Officer appointed and registered** with the Information Regulator ([§4.1](#41-governance--legal-basis))
- [ ] **DPAs signed** with every live processor (Stripe, Vercel/GCP, Neon, SendGrid, Sentry, etc.) ([§4.3](#43-cross-border-transfers))
- [ ] **Breach-notification runbook** documented and tabletop-tested once ([§4.4](#44-breach-notification))

### 🟠 Follow-up Tier 1 (release week + first month)

N/A

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

N/A

### 🟢 Follow-up Tier 3 (first quarter post-launch)

Maturity work, the shift from "launched" to "grown-up".

**Roles:** `DEV 55%` · `OPS 25%` · `COMPLIANCE 10%` · `PRODUCT 10%` *(quarterly DR drills, access reviews, annual POPIA review, YubiKey rollout, GA-readiness sign-off live with stakeholders)*

**`COMPLIANCE`: annual POPIA hygiene**

- [ ] **Annual POPIA review** scheduled and tracked ([§14.2](#142-operational-cadence))

### 🔵 Future work (likely outside this document's scope)

On the radar but not load-bearing for the SA launch. Re-evaluate at the 6-month mark; some of these may belong in their own RFCs rather than this checklist.

**Roles:** `PRODUCT 30%` · `DEV 30%` · `COMPLIANCE 15%` · `LEGAL 10%` · `FINANCE 5%` · `CLINICAL 5%` · `MARKETING 5%` *(mostly strategic decisions, African expansion, SOC 2 / HIPAA scoping, advisory-board recruitment, R&D incentive, `DEV` only does the engineering follow-through)*

**`COMPLIANCE` + `PRODUCT`: enterprise / international compliance**

- [ ] **SOC 2 Type 1 audit** if pursuing enterprise tenants (medical-aid schemes, hospital groups)
- [ ] **HIPAA / HITRUST readiness** if entering the US market

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `COMPLIANCE` share are marked N/A with a back-link.

### Phase 0: Minimum Viable Product

N/A. See [Phase 0: Minimum Viable Product](../GO_LIVE.md#phase-0-minimum-viable-product) in the source document for context.

### Phase 1: Infrastructure & Hosting Decision

N/A. See [Phase 1: Infrastructure & Hosting Decision](../GO_LIVE.md#phase-1-infrastructure--hosting-decision) in the source document for context.

### Phase 2: Authentication & Identity

N/A. See [Phase 2: Authentication & Identity](../GO_LIVE.md#phase-2-authentication--identity) in the source document for context.

### Phase 3: Payments

N/A. See [Phase 3: Payments](../GO_LIVE.md#phase-3-payments) in the source document for context.

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
- [ ] Self-service Data Subject Access Request (DSAR) endpoint, export all personal data as JSON + PDF
- [ ] Right to erasure ("delete my account"), soft delete with 30-day grace + hard delete after retention expiry
- [ ] Right to rectification, users can correct their own data
- [ ] Data portability, machine-readable export

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

N/A. See [Phase 14: Post-Launch Operations](../GO_LIVE.md#phase-14-post-launch-operations) in the source document for context.
