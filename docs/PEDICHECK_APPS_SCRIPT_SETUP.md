# PediCheck — Google Apps Script backend (no GCP)

> 🧭 **Non-technical overview** (what the sheet is, how to approve feature requests):
> [`src/apps/pedicheck/docs/HOW_THE_GOOGLE_SHEET_WORKS.md`](../src/apps/pedicheck/docs/HOW_THE_GOOGLE_SHEET_WORKS.md). This doc is the technical setup.

This is the **fastest, no-GCP** way to make the PediCheck lead + feature-request
forms work in production on Vercel. It uses a **Google Apps Script web app bound
to your Sheet**, which runs as *your* Google account (the sheet owner) — no GCP
project, no service-account key.

```
Browser ──▶ pedicheck /api/* route handlers (Vercel, server-side)
                         │  POST { token, action, payload }
                         ▼
            Apps Script web app  ──▶  PediCheck Google Sheet (Leads + Features)
```

The route handlers hold the script URL + token as **server-side** env vars, so
they never reach the browser, and there is no CORS to fight.

> **Scope:** pre-launch marketing data only — **never** clinical/child data.
> Read the POPIA §72 note at the bottom before collecting real PII.

---

## 1. Install the Apps Script

1. Open the PediCheck sheet → **Extensions → Apps Script**.
2. Delete the contents of the default `Code.gs`, then paste in the full contents
   of [`src/apps/pedicheck/apps-script/Code.gs`](../src/apps/pedicheck/apps-script/Code.gs).
3. **Save** (💾).

## 2. Run one-time setup

1. In the Apps Script editor, pick the **`setupSheets`** function in the toolbar
   dropdown → click **Run**.
2. Authorize when prompted (it's your own account / your own sheet). You may see
   an "unverified app" screen — choose **Advanced → Go to … (unsafe)**; it's your
   own script.
3. Open **Execution log** (View → Logs, or the bottom panel). Copy the line:
   ```
   APPS_SCRIPT_TOKEN = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
   `setupSheets` also wrote the header rows to **Leads** and **Features** and added
   the `PENDING / APPROVED / REJECTED` dropdown to the **Features** status column (G).

## 3. Deploy as a Web App

1. **Deploy → New deployment** → gear icon → **Web app**.
2. Settings:
   - **Description:** `pedicheck`
   - **Execute as:** **Me** (your account)
   - **Who has access:** **Anyone**  ← required so the route handler can reach it; the token gates actual use.
3. **Deploy** → authorize if asked → **copy the Web app URL** (ends with `/exec`).
   That is your `APPS_SCRIPT_URL`.

> 🔁 **Updating the script later:** editing `Code.gs` does **not** change the live
> `/exec` until you redeploy. Use **Deploy → Manage deployments → ✏️ Edit →
> Version: New version → Deploy**. The `/exec` URL stays the same.

## 4. Wire the env vars

**Local** — put both values in [`src/apps/pedicheck/.env.local`](../src/apps/pedicheck/.env.local):

```sh
APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfyc.../exec
APPS_SCRIPT_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Vercel** — Project → **Settings → Environment Variables**, add the same two
keys for **Production** and **Preview** (leave them out of any client bundle —
they are server-only). Redeploy for them to take effect.

## 5. Test locally

```sh
moon run pedicheck:dev-web   # http://localhost:9003
```

1. **Lead:** submit the waitlist form on `/` → new row in **Leads** (`type=waitlist`).
2. **Feature (pending):** submit on `/features` → new **Features** row, status
   `PENDING`; it does **not** appear on the board.
3. **Approve:** set that row's status (col G) to `APPROVED` → reload `/features`
   → it appears (the board reads live, no cache).
4. **Reject:** set another row to `REJECTED` → stays hidden.
5. **Vote:** up/down on the board → columns `H`/`I` increment in the sheet.

Sanity check the deployment directly: open the `/exec` URL in a browser — it
should return `{"ok":true,"data":{"service":"pedicheck","status":"up"}}`.

---

## How approval works

The status column **G** on the **Features** tab is the entire moderation surface:

- New submissions land as **`PENDING`** and are never shown publicly.
- Set a row to **`APPROVED`** to make it appear on `/features` (case/space tolerant).
- **`REJECTED`** stays hidden — your "don't approve this" marker.

Only approved rows leave the script, and email/consent/status are stripped before
they reach the browser.

---

## Security notes

- The **token** is the access control. If it leaks, rotate it: delete the
  `SHARED_TOKEN` script property (Project Settings → Script Properties) and run
  `setupSheets()` again, then update `.env.local` + Vercel.
- The `/exec` URL is "Anyone"-accessible by design (Apps Script web apps are), but
  every action requires the matching token, so a bare URL hit just returns
  `unauthorized`.

## POPIA §72 — read before collecting real PII

Google Sheets stores PII (email, WhatsApp number) **outside South Africa**.
[CLAUDE.md](../CLAUDE.md) requires every third-party integration to be assessed
against **POPIA Section 72** (cross-border transfer). Both forms capture explicit
`consent`, but consent alone does not satisfy the cross-border-location rule.
**Get sign-off (Google SCCs / adequacy assessment) before pointing production at a
real sheet.** Local/dev testing with throwaway data is fine now.

---

## Switching to the NestJS backend later

The sheet's column layout is identical to the NestJS Sheets design, so you can
move to the API-routed path (Cloud Run + ADC) with **no data migration** — just
point `NEXT_PUBLIC_API_URL` at the deployed API. See
[PEDICHECK_SHEETS_SETUP.md](PEDICHECK_SHEETS_SETUP.md) for that path.
