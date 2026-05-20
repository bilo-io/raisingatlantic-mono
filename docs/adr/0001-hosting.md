# ADR 0001: Hosting — GCP `africa-south1` over Vercel

**Status:** Accepted  
**Date:** 2026-05-19  
**Author:** Bilo Lwabona

---

## Context

Raising Atlantic processes children's health records (EPI vaccination data, growth measurements, milestone tracking, HPCSA-verified clinician identities). Under POPIA Section 72, personal information may only be transferred outside South Africa if the recipient country offers adequate protection or a DPA is in place.

The product was prototyped on **Vercel** (web) and **Neon** (Postgres). Both services host data in `eu-central-1` (Vercel Edge) and `us-east-2` / `eu-central-1` (Neon) — outside South Africa. They require cross-border transfer paperwork and do not provide a `africa-south1` option.

Competing options evaluated:

| Option | Data residency | POPIA position | Ops burden | Cost (est. 12-month) |
|---|---|---|---|---|
| **Vercel + Neon** (current) | EU / US | Cross-border transfer + DPA required for every processor | Low | ~$150/mo at low traffic |
| **GCP `africa-south1`** | Johannesburg | Same-country residency, no cross-border transfer paperwork | Medium | ~$120–200/mo depending on Cloud SQL tier |
| **AWS `af-south-1`** | Cape Town | Same-country residency | High (rebuild IaC) | ~$130/mo |

---

## Decision

Use **Google Cloud Platform with `africa-south1` (Johannesburg) as the default region** for all production workloads.

Keep Vercel only for **marketing preview deploys** (`marketing.raisingatlantic.com`) which do not process user health data.

### Rationale

1. **POPIA data residency** — `africa-south1` is GCP's Johannesburg region. Hosting here eliminates the Section 72 cross-border transfer concern for the data-heavy services (Cloud SQL, Cloud Run, Secret Manager).

2. **GCP ecosystem fit** — Firebase Auth, Genkit AI, Cloud Armor, Cloud SQL, and OpenTelemetry all have first-class GCP integrations. Using one cloud reduces cognitive load and support surface.

3. **Cost parity** — GCP's sustained-use discounts and Committed Use contracts bring the estimated 12-month cost in line with Vercel+Neon, especially once traffic grows.

4. **IaC-first** — Cloud Run + Terraform is a mature, well-documented IaC target. Vercel's Terraform provider is community-supported and less capable for the NestJS API workload.

### What changes

- **Database**: Migrate from Neon to Cloud SQL Postgres 15 in `africa-south1`. Run a `pg_dump | pg_restore` rehearsal in staging before cutting over.
- **API**: Deploy as a Cloud Run service (`ra-api-prod`) behind an HTTPS Load Balancer with Cloud Armor.
- **Web**: Deploy as a Cloud Run service (Next.js standalone build). Vercel remains the deploy target until the Cloud Run web service is validated.
- **Workers**: Background jobs (vaccination reminders, EPI recalculation) move to Cloud Run Jobs + Cloud Scheduler.
- **DNS**: Cloud DNS with DNSSEC. Cloudflare kept as optional WAF + DDoS layer in front.

### What stays the same

- Vercel for marketing-only routes (blog, landing page) — no user health data.
- Neon during transition period (development environment only, until Cloud SQL is live in staging).

---

## Consequences

- **Positive**: POPIA cross-border transfer paperwork for the database processor is eliminated. `africa-south1` latency for ZA users is materially better than `eu-central-1`.
- **Positive**: Full IaC via Terraform (see ADR 0001-hosting and `infra/`). Every prod resource is version-controlled.
- **Negative**: Higher initial ops burden than Vercel. Resolved by the `infra/` IaC skeleton in this PR.
- **Negative**: Neon migration requires a one-time `pg_dump | pg_restore` rehearsal and a short maintenance window. Planned before open beta.

---

## Review triggers

Revisit this decision if:
- `africa-south1` Cloud SQL suffers repeated zonal outages.
- Vercel releases a Johannesburg edge node with POPIA-adequate data residency commitments.
- Team grows past 5 engineers and GCP ops burden becomes a drag.
