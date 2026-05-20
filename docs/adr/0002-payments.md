# ADR 0002: Payments — Stripe-first, Ozow fast-follow

**Status:** Accepted  
**Date:** 2026-05-19  
**Author:** Bilo Lwabona

---

## Context

Raising Atlantic has three payment buyer segments:

- **Clinicians / Practices (B2B)**: recurring subscription (monthly/annual seat), VAT invoice required, international business cards accepted.
- **Parents (consumer)**: subscription or one-off plan, mix of credit cards and bank accounts, ~40% of SA adults have a bank account but no credit card.
- **Tenants (enterprise)**: custom MSA + invoiced billing, handled outside the payment rails for now.

Providers evaluated:

| Provider | Best for | SA fees | Subscriptions | SA bank support |
|---|---|---|---|---|
| **Stripe** | International cards, polished subscriptions, Stripe Tax, Radar fraud | ~2.9% + R2 local, +1% intl | First-class (Stripe Billing, proration, dunning) | Cards + limited EFT |
| **Paystack** (Stripe-owned) | African-market cards, local UX optics | ~2.9% local | Immature vs Stripe Billing | Cards, bank transfer |
| **Ozow** | SA instant-EFT (pull from any major SA bank), no card required | ~1.5%, capped on large txns | None (single-charge only) | EFT only, no cards |

---

## Decision

### Pre-launch: Stripe only

Stripe covers every paying user on day one (clinicians, practices, early-adopter parents with cards). Stripe Billing handles subscription lifecycle, proration, dunning, and failed-payment retry without custom code. Stripe Tax auto-calculates and remits ZA VAT (15%).

Paystack would duplicate Stripe's card coverage (same Stripe parent since 2020) and require rebuilding the subscription layer from scratch. Ozow has no recurring support. One integration on day one is one integration.

### Fast-follow (30 days after parent paid tier launches): add Ozow

Once we see real card-decline / abandonment data from the parent consumer segment, add Ozow as a second checkout option. Ozow's 1.5% fee beats Stripe on large one-off charges (e.g. annual family plan). The `PaymentProvider` interface in the API is designed to accept a second adapter.

### Defer Paystack indefinitely

No value over Stripe pre-launch. Reconsider only if expanding into Nigeria, Ghana, or Kenya where Paystack has deeper local-payment coverage.

---

## Implementation notes

- Wrap Stripe behind a `PaymentProvider` interface in `src/apps/api/src/payments/` **now**, even with a single Stripe adapter, so Ozow is a new adapter rather than a refactor.
- Stripe products + prices + webhook endpoints are managed via Terraform (`infra/envs/prod/main.tf` — see `stripe_webhook_endpoint` resource, currently commented out until Stripe account is live).
- Use `STRIPE_API_KEY_DEV` / `STRIPE_API_KEY_STAGING` (Stripe test keys) and `STRIPE_API_KEY_PROD` (live key) as separate GitHub Secrets.
- PCI DSS scope: SAQ-A (Stripe Elements / Checkout only; no card data touches our servers).

---

## Consequences

- **Positive**: Single payment integration at launch. Lower incident surface.
- **Positive**: Stripe Tax handles ZAR VAT registration + remittance automatically.
- **Positive**: Stripe Billing dunning and invoice history reduce support burden.
- **Negative**: ~40% of SA adult parents without a Visa/Mastercard can't pay on day one. Resolved post-launch with Ozow.
- **Neutral**: Paystack deferred; no action required unless African expansion begins.

---

## Review triggers

Revisit this decision if:
- Parent conversion data shows > 20% card-decline rate justifying Ozow prioritisation.
- Expansion into Nigeria/Ghana/Kenya is approved (triggers Paystack evaluation).
- Stripe withdraws South Africa support (unlikely given their ZA entity).
