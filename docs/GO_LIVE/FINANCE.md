# Raising Atlantic Go-Live: `FINANCE` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `FINANCE` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** Bookkeeping, KYC, VAT, SARS, banking, Section 11D R&D incentive, founder-liability ringfencing.

**Phase involvement:**

- [Phase 3: Payments](#phase-3-payments): `FINANCE 25%`
- [Phase 14: Post-Launch Operations](#phase-14-post-launch-operations): `FINANCE 25%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `FINANCE` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `FINANCE` are marked N/A.

### 🔴 Required (non-negotiable) before release

The minimum viable launch list. Skip any of these and we are either non-compliant, insecure, or unable to operate.

**Roles:** `DEV 45%` · `COMPLIANCE 15%` · `LEGAL 12%` · `PRODUCT 10%` · `OPS 10%` · `FINANCE 5%` · `CLINICAL 3%` *(over half of this tier is non-engineering, Information Officer, DPAs, lawyer-reviewed legal docs, Stripe KYC, beta recruitment)*

**`PRODUCT` + `FINANCE`: payments enablement**

- [ ] **Stripe live** with at least one paying tier wired end-to-end (KYC, SARS VAT, CIPC docs, pricing tiers) ([§3.2](#32-stripe-setup)–[§3.5](#35-compliance))

### 🟠 Follow-up Tier 1 (release week + first month)

Not strictly blocking, but embarrassing or risky if they slip past week 4 of being live.

**Roles:** `DEV 50%` · `OPS 15%` · `MARKETING 10%` · `DESIGN 10%` · `PRODUCT 5%` · `FINANCE 5%` · `SUPPORT 5%` *(branded emails, Slack workspace, helpdesk inbox, mobile-store listings, Xero setup all need stakeholder hands)*

**`FINANCE`: books on rails**

- [ ] **Bookkeeping wired**: Xero / QuickBooks Online + Stripe integration ([§14.3](#143-financial-operations))

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

N/A

### 🟢 Follow-up Tier 3 (first quarter post-launch)

N/A

### 🔵 Future work (likely outside this document's scope)

On the radar but not load-bearing for the SA launch. Re-evaluate at the 6-month mark; some of these may belong in their own RFCs rather than this checklist.

**Roles:** `PRODUCT 30%` · `DEV 30%` · `COMPLIANCE 15%` · `LEGAL 10%` · `FINANCE 5%` · `CLINICAL 5%` · `MARKETING 5%` *(mostly strategic decisions, African expansion, SOC 2 / HIPAA scoping, advisory-board recruitment, R&D incentive, `DEV` only does the engineering follow-through)*

**`FINANCE`: tax incentives**

- [ ] **R&D Tax Incentive (Section 11D)** application once spend justifies audit cost ([§14.3](#143-financial-operations))

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `FINANCE` share are marked N/A with a back-link.

### Phase 0: Minimum Viable Product

N/A. See [Phase 0: Minimum Viable Product](../GO_LIVE.md#phase-0-minimum-viable-product) in the source document for context.

### Phase 1: Infrastructure & Hosting Decision

N/A. See [Phase 1: Infrastructure & Hosting Decision](../GO_LIVE.md#phase-1-infrastructure--hosting-decision) in the source document for context.

### Phase 2: Authentication & Identity

N/A. See [Phase 2: Authentication & Identity](../GO_LIVE.md#phase-2-authentication--identity) in the source document for context.

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
