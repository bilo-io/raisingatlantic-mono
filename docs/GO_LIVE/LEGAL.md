# Raising Atlantic Go-Live: `LEGAL` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `LEGAL` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** External attorney engagement: ToS, Privacy Policy, DPAs, contract review, advisory sign-off.

**Phase involvement:**

- [Phase 4: POPIA Compliance](#phase-4-popia-compliance): `LEGAL 30%`
- [Phase 6: Legal Documents](#phase-6-legal-documents): `LEGAL 70%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `LEGAL` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `LEGAL` are marked N/A.

### 🔴 Required (non-negotiable) before release

The minimum viable launch list. Skip any of these and we are either non-compliant, insecure, or unable to operate.

**Roles:** `DEV 45%` · `COMPLIANCE 15%` · `LEGAL 12%` · `PRODUCT 10%` · `OPS 10%` · `FINANCE 5%` · `CLINICAL 3%` *(over half of this tier is non-engineering, Information Officer, DPAs, lawyer-reviewed legal docs, Stripe KYC, beta recruitment)*

**`LEGAL`: attorney sign-off**

- [ ] **Privacy Policy + ToS + Disclaimer** lawyer-reviewed by a SA POPIA specialist ([§6.1](#61-public-facing-documents), [§6.4](#64-professional-review))

### 🟠 Follow-up Tier 1 (release week + first month)

N/A

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

N/A

### 🟢 Follow-up Tier 3 (first quarter post-launch)

N/A

### 🔵 Future work (likely outside this document's scope)

On the radar but not load-bearing for the SA launch. Re-evaluate at the 6-month mark; some of these may belong in their own RFCs rather than this checklist.

**Roles:** `PRODUCT 30%` · `DEV 30%` · `COMPLIANCE 15%` · `LEGAL 10%` · `FINANCE 5%` · `CLINICAL 5%` · `MARKETING 5%` *(mostly strategic decisions, African expansion, SOC 2 / HIPAA scoping, advisory-board recruitment, R&D incentive, `DEV` only does the engineering follow-through)*

**`LEGAL` + `PRODUCT` + `DEV`: B2B contracting**

- [ ] **B2B self-serve Master Services Agreement portal** for new tenants ([§6.2](#62-role-specific-agreements))

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `LEGAL` share are marked N/A with a back-link.

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

N/A. See [Phase 10: Mobile App Release](../GO_LIVE.md#phase-10-mobile-app-release) in the source document for context.

### Phase 11: Workspace & Communications

N/A. See [Phase 11: Workspace & Communications](../GO_LIVE.md#phase-11-workspace--communications) in the source document for context.

### Phase 12: Pre-Launch Testing

N/A. See [Phase 12: Pre-Launch Testing](../GO_LIVE.md#phase-12-pre-launch-testing) in the source document for context.

### Phase 13: Launch & Marketing

N/A. See [Phase 13: Launch & Marketing](../GO_LIVE.md#phase-13-launch--marketing) in the source document for context.

### Phase 14: Post-Launch Operations

N/A. See [Phase 14: Post-Launch Operations](../GO_LIVE.md#phase-14-post-launch-operations) in the source document for context.
