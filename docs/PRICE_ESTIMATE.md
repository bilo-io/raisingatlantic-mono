# GCP Cost Estimate — Raising Atlantic

**Last updated:** 2026-05-26
**Region:** `africa-south1` (Johannesburg) — POPIA Section 72 requires in-region hosting
**Architecture target:** Full GCP (no Vercel, no App Engine). Cloud Run for both API and Web, HA Cloud SQL from day one.

---

## Architectural decision — Cloud Run, not App Engine

For Next.js 16 with App Router + server actions + Stripe checkout, **Cloud Run is the right home for the web app**. The Terraform already deploys web to Cloud Run ([infra/envs/prod/main.tf:99-115](../infra/envs/prod/main.tf#L99-L115)) — this confirms the choice.

### Why Cloud Run over App Engine for Next.js

| Concern | Cloud Run | App Engine Standard | App Engine Flexible |
|---|---|---|---|
| Modern Node.js (22+) + Next.js 16 | Any container | Constrained runtimes | Heavier |
| Server actions / RSC | Native | Quirky | Works |
| Streaming SSR (HTTP/2) | Native | Limited | Yes |
| Stripe Checkout init via Route Handler | Just an HTTP endpoint | Yes | Yes |
| Cold-start mitigation (`min_instances`) | Cheap and granular | Yes | min=1 forced and pricier |
| Scale to thousands of concurrent | Per-instance concurrency model | One-request-per-instance default | Slower scale |
| Cost predictability | Strong | Mixed | Premium pricing |
| Ops parity with NestJS API | Same shape | Different beast | Different beast |

Google has been steering workloads off App Engine for years. **Cloud Run is the modern target for any container workload on GCP.**

### Payment flow split

- **Web (Cloud Run):** `app/api/checkout/session/route.ts` creates Stripe Checkout Sessions server-side. Just a Next.js Route Handler — Cloud Run treats it as any HTTP endpoint.
- **API (Cloud Run):** Webhook signature verification at `/v1/webhooks/stripe`, per [infra/envs/prod/main.tf:264](../infra/envs/prod/main.tf#L264). Belongs in NestJS where idempotency, role checks, and POPIA audit logging already live.

### One Cloud Run caveat — ISR

Next.js ISR's on-disk cache doesn't persist across instances. Three options when it becomes relevant:

1. Custom cache handler backed by GCS (Next.js supports this natively).
2. Memorystore (Redis) cache handler — adds ~$50/mo at small tier.
3. Accept per-instance ISR — fine while almost everything is per-user dynamic (parent dashboards, clinician views, verification queues).

**Launch decision:** option 3. Revisit at Year 2 if public marketing pages with ISR are added.

---

## Three-year cost projection

All figures USD/month, africa-south1 region. HA Cloud SQL throughout (no zonal-then-flip — POPIA reviewers will expect HA from day one of holding real records).

### Year 1 — Launch (5k–20k MAU, ~100–300 concurrent peak)

| Item | Spec | Est. |
|---|---|---|
| **Cloud SQL Postgres** | db-custom-2-7680 (2 vCPU / 7.5GB) **HA REGIONAL**, 50GB SSD, PITR 7d, daily backups | **$300–360** |
| Cloud Run API | min 2 / max 20, 1 vCPU / 1Gi, CPU always-allocated | $170–230 |
| Cloud Run Web (Next.js SSR) | min 2 / max 20, 1 vCPU / 1Gi | $170–230 |
| HTTPS Load Balancer (global) | 1 forwarding rule, two backend services | $20–30 |
| Cloud Armor | OWASP CRS policy, low request volume | $10–20 |
| Cloud NAT | 1 gateway, low data | $35–45 |
| Cloud Storage | 50–200 GB standard (child profile photos, clinician docs) | $5–25 |
| Cloud KMS | 5–10 keys for field-level encryption (HPCSA, conditions) | $5–15 |
| Secret Manager | ~15 secrets, light access | $3–8 |
| Artifact Registry | 10–20 GB images (API + Web + base layers) | $5–15 |
| Cloud Logging + Monitoring | 100–300 GB/mo logs, ~50 dashboards | $25–100 |
| Cloud Build | CI builds (free tier covers ~60% at this scale) | $5–25 |
| Egress (internet) | 50–200 GB/mo | $10–25 |
| **Year 1 subtotal** | | **~$760–1,130 / mo** |

### Year 2 — Growth (50k–150k MAU, real upload volume)

| Item | Spec | Est. |
|---|---|---|
| **Cloud SQL Postgres** | db-custom-4-16384 HA + 1 read replica (zonal), 500 GB SSD | **$950–1,200** |
| Cloud Run API | min 3 / max 50, real concurrency, ~$300 baseline + traffic | $400–650 |
| Cloud Run Web | min 3 / max 50 | $350–550 |
| **Cloud CDN** | Cache origin pulls + edge egress (start using this here) | $80–150 |
| Cloud Storage | 1–3 TB media | $20–60 |
| Egress (origin to internet, before CDN tuning) | 500 GB – 1 TB/mo | $60–120 |
| LB + Cloud Armor + NAT | Scaling with traffic | $100–180 |
| KMS ops | Per-request field encryption at real volume | $30–80 |
| **Cloud Logging + Monitoring** | 1–2 TB/mo — **biggest variable, sample aggressively** | $300–800 |
| Memorystore (Redis) | 1 GB basic tier — session cache + ISR | $50–80 |
| Secret Manager + Artifact Registry | Minor growth | $15–30 |
| Cloud Build | More frequent deploys | $20–60 |
| **Year 2 subtotal** | | **~$2,400–3,950 / mo** |

### Year 3 — Scale (500k–1M+ MAU)

| Item | Spec | Est. |
|---|---|---|
| **Cloud SQL Postgres** | db-custom-8-32768 HA + 2 read replicas, 2 TB SSD | **$2,700–3,200** |
| Cloud Run API | High concurrency, ~$1,000 baseline + traffic | $1,500–3,000 |
| Cloud Run Web | Same shape | $1,000–2,500 |
| Cloud Storage | 10–30 TB media | $200–600 |
| **Cloud CDN + egress** | Heaviest variable — mobile clients pulling images on cellular | $1,000–4,000 |
| Cloud Logging + Monitoring | 3–5 TB/mo (sampled) | $1,500–2,500 |
| KMS | Field decrypt on every record read | $200–500 |
| LB + Cloud Armor | Higher rule count, ~10M req/day | $300–800 |
| Memorystore (Redis) | 5 GB standard tier HA | $150–250 |
| Cloud Build + Artifact Registry | Larger images, more deploys | $80–200 |
| **Year 3 subtotal** | | **~$8,600–17,500 / mo** |

---

## Third-party SaaS (separate bill, all 3 tiers)

These are the providers declared in [infra/envs/prod/main.tf](../infra/envs/prod/main.tf) but billed outside GCP.

| Service | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Stripe | 2.9% + R2/txn | (transactional) | (transactional) |
| Sentry | ~$26/mo team | ~$80/mo business | ~$200+/mo |
| BetterStack | ~$25/mo | ~$75/mo | ~$150/mo |
| PagerDuty | ~$21/user × 2–3 | ~$21/user × 4–6 | ~$41/user × 6–10 |
| SendGrid | ~$20/mo | ~$90/mo (Pro) | ~$300/mo |
| Cloudflare | Free–$20 | $20–200 | $200–500 |
| **3rd party subtotal** | **~$110–200** | **~$400–700** | **~$1,200–2,500** |

---

## All-in totals (GCP + 3rd party)

| Tier | Range | Midpoint |
|---|---|---|
| **Year 1 — Launch** | $870–1,330/mo | **~$1,100/mo** |
| **Year 2 — Growth** | $2,800–4,650/mo | **~$3,700/mo** |
| **Year 3 — Scale** | $9,800–20,000/mo | **~$15,000/mo** |

---

## Notes on the regional premium

`africa-south1` carries roughly a **25–30% premium** over `us-central1` on compute (Cloud Run, Cloud SQL, Memorystore) and ~$0.12/GB on egress to the public internet. This premium is baked into every figure above. POPIA Section 72 makes the premium non-negotiable — special personal information (children's health records) cannot leave South Africa without an adequacy decision or SCCs.

---

## Cost-control levers

The three line items that will move the most as the platform scales:

1. **Cloud SQL** — linear with data volume + read load. Vertical scaling without downtime is supported; start small and right-size with metrics.
2. **Cloud Run web** — linear with traffic. Tune `min_instances` and `max_instances` from real percentiles, not guesses.
3. **Cloud Logging** — super-linear if logs are not sampled. By Year 2 a structured log filter dropping 70%+ of INFO-level events before ingestion can save $500–1,500/mo at scale.

### Two specific actions worth taking

- **Around month 3 of stable traffic**, buy a 1-year Committed Use Discount on Cloud Run min-instances and Cloud SQL vCPU. Saves ~25%. Do not commit at launch — wait for real usage data.
- **Cloud CDN from Year 2.** Mobile clients pulling profile photos and clinician documents on cellular is the silent budget killer. CDN typically pays for itself within the first month it is enabled.

---

## Cross-references

- Hosting decisions: [docs/adr/](adr/)
- GCP bootstrap checklist: [TODO_GCP.md](../TODO_GCP.md)
- Go-live phase plan: [docs/GO_LIVE.md](GO_LIVE.md)
- Prod Terraform: [infra/envs/prod/main.tf](../infra/envs/prod/main.tf)
