# PediCheck — Project Spec

> Status: pre-launch waitlist landing page. Product launch September 2026.
> Owner: Bilo (dev) · Atlantic Children's Practice, Cape Town.
> Source of truth: this file. Notion page is a mirror.

---

## What PediCheck is

A paediatric symptom-triage tool for South African parents. Built and clinically reviewed by paediatricians at Atlantic Children's Practice. Designed to answer one question better than Google: *"Should I be worried about this — right now?"*

This document covers only the **pre-launch waitlist landing page** and its lead capture. The actual symptom-checker product is a separate workstream.

## What we're building right now

1. Port the existing static landing page ([`PediCheck Landing.html`](../src/apps/pedicheck/resources/PediCheck%20Landing.html)) into the Next.js 16 app already scaffolded at [`src/apps/pedicheck/`](../src/apps/pedicheck/).
2. Replace the client-side form script with a Next.js API route that writes leads to a Google Sheet via a service account — so the credential never reaches the browser. This matters because the form collects email, WhatsApp number, and a child's age range (POPIA-relevant).
3. Deploy on **Vercel** under a custom domain.
4. Publish this spec into Notion as the team's tracking surface.

## Why these choices

- **Next.js over plain static hosting** — we need a server endpoint for lead capture; everything else stays static and free on Vercel's edge.
- **Vercel over Cloud Run** — PediCheck is a stateless marketing surface. Cloud Run is overkill, and Vercel's preview deploys per PR fit the iteration rate.
- **Google Sheets over a database** — the waitlist is < 200 rows for launch; the team already lives in Google Workspace; a Sheet is the right tool. We migrate to Postgres only if/when the list outgrows it.
- **Service account over Apps Script** — service account keys can be rotated and scoped; Apps Script web-app URLs are shared secrets with no rate-limiting story.

---

## Checklist

### 1. Port landing page to Next.js
- [ ] Copy brand + image assets from `resources/Pedicheck/` → `public/`
- [ ] Paste the source HTML's `<style>` block into `globals.css` (keep Tailwind directives at the top)
- [ ] Convert hero, "you googled it", solution, founders, pricing, and footer sections to JSX in `page.tsx` (Server Component)
- [ ] Extract the waitlist form into a `<WaitlistForm />` Client Component
- [ ] Add Google Fonts links (Fraunces, DM Sans, Nunito) and page metadata in `layout.tsx`
- [ ] `moon run pedicheck:build` produces a clean build

### 2. Lead-capture API (server-side Google Sheets)
- [ ] Create / reuse a Google Cloud project; enable the Google Sheets API
- [ ] Create service account `pedicheck-waitlist@…`; download JSON key
- [ ] Create the waitlist Google Sheet; share with the service account email as **Editor**
- [ ] Implement `src/lib/sheets.ts` (`appendLead`, `countLeads`) using `googleapis`
- [ ] Implement `POST /api/lead` with Zod validation, basic per-IP rate limit, and a honeypot field
- [ ] Wire the form to `/api/lead`; show confirmation state with the returned waitlist position number
- [ ] Verify server logs contain **no email / no WhatsApp number** — only request IDs and status codes

### 3. Vercel project + custom domain
- [ ] Create a Vercel project linked to `raisingatlantic-mono`; set Root Directory to `src/apps/pedicheck`
- [ ] Install Command `npm install --legacy-peer-deps`; Build `next build`; Framework Next.js
- [ ] Add env vars on Production + Preview: `GOOGLE_SERVICE_ACCOUNT_KEY` (base64), `GOOGLE_SHEET_ID`, `WAITLIST_SHEET_NAME`
- [ ] First deploy from `feat/pedicheck-init`; confirm the preview URL renders + form writes to the Sheet
- [ ] **Pick a domain** — open question. Suggestions, in order of speed-to-ship:
  - `pedicheck.raisingatlantic.com` — subdomain on the existing `raisingatlantic.com` Workspace DNS. Single CNAME, ships today.
  - `pedicheck.com` — standalone consumer-grade brand. Register (or claim if already owned) and point at Vercel via A/ALIAS + `www` CNAME.
  - Both — `pedicheck.com` canonical, `pedicheck.raisingatlantic.com` 301s to it.
- [ ] Add the chosen domain in Vercel; complete DNS records; HTTPS cert issued
- [ ] Set `metadataBase` in `layout.tsx` to the canonical domain

### 4. Compliance & polish
- [ ] Wire footer privacy / terms / contact links to real pages (stubs fine — `/privacy`, `/terms`, `mailto:hello@…`)
- [ ] Short privacy notice below the form, referencing POPIA + how to request deletion
- [ ] Host the SA Emergency Numbers card download (Vercel static asset under `public/downloads/` or a Drive link)
- [ ] Add Plausible or GA4 (cookie-free preferred)
- [ ] Lighthouse ≥ 95 across Performance / Accessibility / SEO on mobile

### 5. Publish the spec
- [ ] Share the Notion PediCheck page with the Claude integration (currently 404s for the connector)
- [ ] Mirror this file's content into the Notion page
- [ ] Link this file from `docs/GO_LIVE/DEV.md` as a side-deliverable

---

## Files touched

```
src/apps/pedicheck/
  src/app/page.tsx                     # ported landing markup (Server Component)
  src/app/layout.tsx                   # fonts + metadata + canonical domain
  src/app/globals.css                  # source-HTML styles + Tailwind directives
  src/app/api/lead/route.ts            # POST /api/lead
  src/components/WaitlistForm.tsx      # 'use client' — form + confirmation
  src/lib/sheets.ts                    # googleapis Sheets wrapper
  public/brand/…                       # mark-color.svg + logotypes
  public/images/…                      # hero phone + section imagery
  .env.example                         # documents the three Sheets env vars (no values)
  vercel.json                          # install/build command overrides
  next.config.ts                       # drop output: 'standalone' (Vercel doesn't need it)
  moon.yaml                            # add deploy task
docs/PEDICHECK_SPEC.md                 # this file
```

## Environment variables (Vercel + local `.env.local`)

| Name | What | Notes |
| --- | --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Base64-encoded service account JSON | Never log; never expose to the browser |
| `GOOGLE_SHEET_ID` | Spreadsheet ID from the Sheet URL | One per environment (dev / prod) |
| `WAITLIST_SHEET_NAME` | Tab name within the Sheet | e.g. `Founding200` |

## Out of scope

- The actual symptom-checker product / decision pathways (separate workstream, paediatrician sign-off required)
- WhatsApp Business API for follow-ups (manual until launch)
- Field-level encryption / KMS (overkill for waitlist data)
- Integration with the main NestJS API (PediCheck stays standalone until launch)

## Verification

```sh
moon run pedicheck:install
moon run pedicheck:dev          # http://localhost:9003

moon run pedicheck:typecheck
moon run pedicheck:lint
moon run pedicheck:build
```

Then submit a test waitlist entry locally → row appears in the Sheet, API responds with `{ ok: true, position: N }`, server logs contain no PII.
