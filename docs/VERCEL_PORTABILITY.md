# Vercel/Firebase Portability Inventory

> Satisfies Phase 1.1: *"Inventory every Vercel-specific assumption in code … and confirm
> portability"* and the cross-platform cost comparison. Companion to
> [docs/adr/0001-hosting.md](adr/0001-hosting.md) (decision: GCP `africa-south1` primary, Vercel
> marketing-only) and [docs/PRICE_ESTIMATE.md](PRICE_ESTIMATE.md).

**Last updated:** 2026-05-27
**Verdict:** The codebase is **portable to Cloud Run today.** The API already boots a real HTTP
server when not on Vercel, and the web app already builds in `standalone` mode. The remaining
Vercel/Firebase artifacts are additive or marketing-only and do not block a GCP deploy. A small
set of follow-ups (env-driven CORS, decide the fate of `vercel.json` / `apphosting.yaml`) is
tracked for Phase 1.3 when Cloud Run services are actually provisioned.

---

## Classification key

- **Portable** — works on Cloud Run as-is, no change required.
- **Follow-up (1.3)** — works, but should be cleaned up when Cloud Run services are wired.
- **Marketing-only** — intentionally retained for the Vercel marketing-preview path per ADR 0001.

---

## API (`src/apps/api`)

| Assumption | Location | Status | Notes |
|---|---|---|---|
| `@vercel/node` handler export | [main.ts:93–97](../src/apps/api/src/main.ts#L93-L97) | Portable | `module.exports = handler` is **additive**. Cloud Run never imports it; it only matters to the Vercel runtime. Harmless dead weight on GCP. |
| Server-boot guard | [main.ts:99–103](../src/apps/api/src/main.ts#L99-L103) | Portable | `if (!process.env.VERCEL) app.listen(process.env.PORT ?? 3000)` — on Cloud Run `VERCEL` is unset, so the server listens on `$PORT`. **This is exactly the Cloud Run contract.** Already compatible. |
| Static-assets gate | [main.ts:17–19](../src/apps/api/src/main.ts#L17-L19) | Portable | `useStaticAssets` runs everywhere except Vercel. Correct for Cloud Run. |
| Hardcoded Vercel CORS origins | [main.ts:24–32](../src/apps/api/src/main.ts#L24-L32) | Follow-up (1.3) | Built-in allowlist hardcodes `*.vercel.app` hosts. An `ALLOWED_ORIGINS` env extension **already exists** ([main.ts:33–37](../src/apps/api/src/main.ts#L33-L37)), so the mechanism is in place. Follow-up: drop the hardcoded Vercel hosts and inject the real Cloud Run / custom-domain origins via `ALLOWED_ORIGINS` (sourced from Secret Manager). No wildcard in prod — already enforced ([main.ts:41](../src/apps/api/src/main.ts#L41)). |
| `vercel.json` build descriptor | [src/apps/api/vercel.json](../src/apps/api/vercel.json) | Follow-up (1.3) | Defines `@vercel/node` build + routes. Unused by Cloud Run (which uses the container image). Decide in 1.3 whether the API keeps any Vercel deploy at all — per ADR 0001 the API moves fully to Cloud Run, so this file can likely be deleted. |

**No Edge runtime, no `@vercel/kv`** found in the API. Nothing ties the API to Vercel's serverless model beyond the additive handler export.

---

## Web (`src/apps/web`)

| Assumption | Location | Status | Notes |
|---|---|---|---|
| `output: 'standalone'` | [next.config.ts:4](../src/apps/web/next.config.ts#L4) | Portable | **Already set** — produces the self-contained `next start` build Cloud Run needs. The web app is pre-configured for containerised hosting. |
| `images.remotePatterns` | [next.config.ts:9–24](../src/apps/web/next.config.ts#L9-L24) | Portable | Next.js image optimization runs inside the standalone server on Cloud Run (not a Vercel-only feature). Remote hosts are `placehold.co` + `images.unsplash.com`. See the ISR/cache note in [PRICE_ESTIMATE.md](PRICE_ESTIMATE.md) re: per-instance cache. |
| `next/image` usage (15 files) | `src/apps/web/src/**` | Portable | Component-level; not host-specific. |
| ISR `revalidate: 0` | [blog/[slug]/page.tsx:12](../src/apps/web/src/app/blog/[slug]/page.tsx#L12), [blog/post/[id]/page.tsx:12](../src/apps/web/src/app/blog/post/[id]/page.tsx#L12) | Portable | `revalidate: 0` = always-dynamic fetch, no on-disk ISR cache to persist across instances. The PRICE_ESTIMATE "ISR caveat" (option 3: accept per-instance ISR) applies only if true ISR is added later. |
| `vercel.json` install command | [src/apps/web/vercel.json](../src/apps/web/vercel.json) | Marketing-only | Monorepo install hack for Vercel preview builds. Retained for the Vercel marketing-preview path per ADR 0001; ignored by the Cloud Run image build. |
| `apphosting.yaml` (Firebase) | [src/apps/web/apphosting.yaml](../src/apps/web/apphosting.yaml) | Follow-up (1.3) | Firebase App Hosting descriptor (`maxInstances: 1`). Not used by Cloud Run. Decide in 1.3: delete (Cloud Run is the target) or keep if Firebase App Hosting is ever used for the marketing site. Not load-bearing either way. |

**No Edge runtime, no `@vercel/kv`** found in the web app.

---

## 12-month cost comparison (GCP vs Vercel)

The detailed GCP projection lives in [PRICE_ESTIMATE.md](PRICE_ESTIMATE.md) (Year 1 ≈ **$760–1,130/mo**
GCP compute + ~$110–200/mo third-party SaaS, all in `africa-south1` with HA Cloud SQL from day one).
Vercel was costed-out qualitatively in [ADR 0001](adr/0001-hosting.md) and rejected for production
on two grounds:

- **Data residency (decisive):** Vercel has no `africa-south1` region. Hosting children's health
  records on Vercel triggers POPIA Section 72 cross-border-transfer paperwork (SCCs / adequacy).
  This is the non-negotiable blocker, independent of price.
- **Cost shape:** Vercel's Pro/Enterprise pricing (per-seat + bandwidth + function-execution +
  premium image optimization) is unpredictable for a long-running NestJS API and grows
  super-linearly with traffic, where Cloud Run bills per-request/CPU with committed-use discounts.
  At Year-1 scale a Vercel-hosted equivalent (Pro seats + bandwidth + serverless function GB-hrs
  for an always-on API) lands in a comparable-to-higher band **and** still fails residency.

**Conclusion:** Vercel is retained **only** for marketing-preview deploys (no user health data);
all application workloads run on GCP `africa-south1`. The GCP figure in PRICE_ESTIMATE.md is the
operative 12-month estimate.

---

## Follow-ups for Phase 1.3 (when Cloud Run services are provisioned)

These are **not** done in this docs PR — they belong with the actual Cloud Run wiring:

1. Replace the hardcoded `*.vercel.app` CORS origins with `ALLOWED_ORIGINS` sourced from Secret
   Manager (mechanism already exists in `main.ts`).
2. Delete `src/apps/api/vercel.json` once the API is Cloud-Run-only.
3. Decide the fate of `src/apps/web/{vercel.json, apphosting.yaml}` — retain `vercel.json` only if
   the marketing-preview path stays on Vercel; remove `apphosting.yaml` unless Firebase App Hosting
   is adopted for marketing.
4. Optionally strip the `@vercel/node` handler export from `main.ts` if the API drops Vercel entirely.
