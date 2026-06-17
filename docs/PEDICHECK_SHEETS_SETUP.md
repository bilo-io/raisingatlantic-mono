# PediCheck — Google Sheets setup (lead capture + feature requests)

> 🧭 **Non-technical overview** (what the sheet is, how to approve feature requests):
> [`src/apps/pedicheck/docs/HOW_THE_GOOGLE_SHEET_WORKS.md`](../src/apps/pedicheck/docs/HOW_THE_GOOGLE_SHEET_WORKS.md). This doc is the technical setup.

The PediCheck landing site stores two kinds of pre-launch marketing data in **one
Google Sheet document, in two tabs**:

| Tab | Written by | Read by |
| --- | --- | --- |
| `Leads` | waitlist form → `POST /v1/leads` | nobody (you read it in the sheet) |
| `FeatureRequests` | suggest form → `POST /v1/feature-requests` | `GET /v1/feature-requests` (APPROVED only) |

> **Scope:** pre-launch marketing data only — **never** clinical/child data. That
> always lives in Postgres. See the POPIA note at the bottom before pointing
> production at a real sheet.

The code is already implemented. This doc is the one-time operational wiring.

---

## 1. Create the spreadsheet and two tabs

1. Create a new Google Sheet (one document).
2. Rename/create two tabs named **exactly** `Leads` and `FeatureRequests`.
   (New sheets open with a tab called `Sheet1` — rename it.) If you prefer
   different names, set `GOOGLE_SHEETS_LEADS_TAB` / `GOOGLE_SHEETS_FEATURE_TAB`
   to match.
3. Copy the spreadsheet **ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`<THIS_IS_THE_ID>`**`/edit`

Header rows are written for you by the seed script in step 5 (or paste them
manually):

- **Leads (A–J):** `id, createdAt, type, name, email, phone, subject, message, consent, ip`
- **FeatureRequests (A–I):** `id, createdAt, title, description, email, consent, status, upvotes, downvotes`

> ⚠️ A header row in **row 1 is mandatory** on `FeatureRequests` — the API drops
> row 1 on read and offsets vote writes by it. The seed script enforces this.

### Approval control (the status column)

On the `FeatureRequests` tab, add **Data → Data validation** on column **G
(status)** → dropdown with: `PENDING`, `APPROVED`, `REJECTED`.

- New submissions land as **`PENDING`** and are **not** shown publicly.
- Set a row to **`APPROVED`** to make it appear on `/features` (case/space tolerant).
- **`REJECTED`** stays hidden too — it's just your "don't approve this" marker.

This in-sheet edit **is** the moderation mechanism — no admin UI needed.

---

## 2. Enable the Google Sheets API

```sh
gcloud services enable sheets.googleapis.com --project <YOUR_GCP_PROJECT>
```

---

## 3. Authentication

The API authenticates with **Application Default Credentials (ADC)** — no key
file is committed or mounted (repo's WIF-only rule).

### Local development (scoped ADC)

User ADC must carry the spreadsheets scope explicitly, or Sheets calls return 403:

```sh
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/cloud-platform
```

Then **share the spreadsheet** with your own Google account as **Editor** (you
already have access if you created it).

### Production (Cloud Run runtime service account)

- Share the spreadsheet as **Editor** with the Cloud Run runtime
  **service-account email** (we append + update, so Viewer is not enough).
- Store the spreadsheet ID in **Secret Manager** and mount it into Cloud Run as
  `GOOGLE_SHEETS_SPREADSHEET_ID`. ADC picks up the runtime SA automatically.

---

## 4. Environment variables

**API** (`src/apps/api/.env`):

```sh
GOOGLE_SHEETS_SPREADSHEET_ID=<the id from step 1>
# Optional — only if your tabs aren't named Leads / FeatureRequests:
# GOOGLE_SHEETS_LEADS_TAB=Leads
# GOOGLE_SHEETS_FEATURE_TAB=FeatureRequests
```

**PediCheck web** (`src/apps/pedicheck/.env.local`):

```sh
# Default already points at the local API; set in Vercel for prod.
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
```

---

## 5. Seed + smoke test

Proves auth + tab structure + append + read **without** needing Postgres:

```sh
moon run api:seed-sheets        # or, from src/apps/api: npm run seed:sheets
```

Expected: header rows ensured on both tabs, one `SEED TEST` row appended to
each, row counts printed, and a test feature `id`. In the sheet, set that test
feature row's status to `APPROVED` and confirm `GET /v1/feature-requests`
returns it (allow ≤30s for the read cache). Delete the two `SEED TEST` rows when
done.

---

## 6. Full click-through

```sh
moon run api:db-start       # API needs Postgres to BOOT (these features use Sheets, not the DB)
moon run api:dev            # http://localhost:3000
moon run pedicheck:dev-web  # http://localhost:9003
```

1. **Lead:** submit the waitlist form on `/` → new row in `Leads` (`type=waitlist`, `consent=true`).
2. **Feature (pending):** submit on `/features` → new `FeatureRequests` row, status `PENDING`; it does **not** show on the board yet.
3. **Approve:** set that row's status to `APPROVED` → reload `/features` → it appears (≤30s cache).
4. **Reject:** set another row to `REJECTED` → stays hidden.
5. **Vote:** up/down on the board → columns `H`/`I` increment in the sheet; the same browser can't double-vote.

---

## POPIA Section 72 — read before prod

Google Sheets stores PII (email, WhatsApp number) **outside South Africa**.
[CLAUDE.md](../CLAUDE.md) requires every third-party integration to be assessed
against **POPIA Section 72** (cross-border transfer). Both forms capture explicit
`consent`, but consent alone does not satisfy the cross-border-location rule.
**Get sign-off (Google SCCs / adequacy assessment) before pointing a production
environment at a real sheet.** Local/dev testing with throwaway data is fine now.
