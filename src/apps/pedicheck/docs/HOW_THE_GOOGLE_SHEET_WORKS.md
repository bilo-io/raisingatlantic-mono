# How the PediCheck Google Sheet works

*A plain-language guide for the team. No coding needed to use it.*

The PediCheck landing site has two forms:

1. **Join the waitlist** (email sign-ups)
2. **Suggest / vote on a feature** (the feature-request board)

Everything people submit through those forms lands in **one Google Sheet**, in two
separate tabs. That sheet *is* the database for the landing page — there's no
other admin tool to log into.

> 📄 **The sheet:**
> https://docs.google.com/spreadsheets/d/1uG0lQg45lLF52n7NkFEg_og3v9_A52adJqQ9aDpWyt0/edit
>
> *(You need to be shared on it to open it. Ask Bilo for access.)*

---

## The big picture

```
  Someone fills in a form on the website
                  │
                  ▼
        The website passes it to a small
        Google script attached to the sheet
                  │
                  ▼
        A new row appears in the Google Sheet
```

That "small Google script" is the only moving part. It runs under a Google
account that owns the sheet, so there are **no servers, no databases, and no
cloud bill** for any of this — it's just a Google Sheet with a helper attached.

---

## The two tabs

### 1. `Leads` tab — waitlist & contact sign-ups

Every waitlist or contact submission adds one row here. Columns:

| Column | Meaning |
| --- | --- |
| `id` | Unique reference for the row |
| `createdAt` | When it was submitted |
| `type` | `waitlist` or `contact` |
| `name`, `email`, `phone` | What the person entered |
| `subject`, `message` | Optional message text |
| `consent` | `true` only if they ticked the consent box |
| `ip` | Their network address (basic anti-spam record) |

**Nothing is shown back on the website from this tab — it's purely your private
list.** You just read it in the sheet (e.g. to export emails for an announcement).

### 2. `Features` tab — the feature-request board

Every "suggest a feature" submission adds one row here. Columns:

| Column | Meaning |
| --- | --- |
| `id` | Unique reference |
| `createdAt` | When it was submitted |
| `title`, `description` | The idea, as the person wrote it |
| `email`, `consent` | Optional — only if they left their email *and* consented |
| `status` | **`PENDING` / `APPROVED` / `REJECTED`** — see below |
| `upvotes`, `downvotes` | The vote tallies, shown on the board |

---

## The one thing you'll actually *do*: approve feature requests

This is the only hands-on task. **Nothing a visitor suggests appears on the
public board until you approve it.**

In the `Features` tab, look at the **`status` column**. Every new suggestion
starts as **`PENDING`** (hidden). Click the dropdown in that cell and pick:

- **`APPROVED`** → the idea now shows on the public board at `/features`.
- **`REJECTED`** → stays hidden forever (your "no thanks" marker).
- **`PENDING`** → still hidden, waiting for your decision.

That's the entire moderation system. The website re-reads the sheet live, so an
approved idea shows up within a few seconds of you changing the dropdown — no
deploy, no waiting.

> 🔒 **Privacy:** when an idea goes public, only the **title, description, and
> vote counts** leave the sheet. The submitter's **email, consent flag, and
> status are never sent to the website** — they stay private in the sheet.

---

## Voting

When visitors click 👍 / 👎 on the public board, the `upvotes` / `downvotes`
numbers in the sheet go up automatically. A person can't easily double-vote from
the same browser, but it's a soft guard, not a strict security control — treat
the tallies as a directional signal, not a perfect count.

---

## Important rules (please don't break these)

- **Don't rename the tabs.** They must stay named exactly `Leads` and
  `Features`. Renaming breaks the connection to the website.
- **Don't delete or reorder the columns**, and **keep row 1 (the headers)**.
  The script relies on the column order.
- **You can safely:** read rows, change the `status` dropdown, delete spam rows,
  and add filters/sorting.
- **One person edits status at a time** is fine; the sheet handles it.

---

## ⚠️ Privacy / POPIA — important limit

This sheet is for **pre-launch marketing data only** (waitlist emails, feature
ideas). It must **never** hold any clinical or child health data — that always
lives in the secure South African database, never in a spreadsheet.

Google Sheets stores data **outside South Africa**, so under **POPIA Section 72**
(cross-border transfer of personal information) this needs a formal sign-off
before it's used with real production data at scale. The forms already collect
explicit consent, but consent alone isn't enough — **get the POPIA sign-off
before treating this as the permanent home for real personal data.**

---

## For engineers (where the plumbing lives)

This guide is the non-technical view. The technical setup and code:

- **The script:** [`src/apps/pedicheck/apps-script/Code.gs`](../apps-script/Code.gs)
  — bound to the sheet via *Extensions → Apps Script*.
- **Website → script connection:** the Next.js route handlers in
  [`src/apps/pedicheck/src/app/api/`](../src/app/api/) proxy form submissions to
  the script. The script URL + access token live in **server-side env vars**
  (`APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`) — never in the browser, never in git.
- **Full setup / rotation steps:** [`docs/PEDICHECK_APPS_SCRIPT_SETUP.md`](../../../../docs/PEDICHECK_APPS_SCRIPT_SETUP.md).
- **Alternative backend** (NestJS API + Sheets API, not currently wired to the
  live site): [`docs/PEDICHECK_SHEETS_SETUP.md`](../../../../docs/PEDICHECK_SHEETS_SETUP.md).
  The column layout is identical, so the two backends are interchangeable with no
  data migration.
</content>
</invoke>
