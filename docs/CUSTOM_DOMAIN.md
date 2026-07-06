# Custom Domain Setup on Vercel

> Quick checklist for pointing a custom domain to your Vercel deployment.
> Covers **domains.co.za**, **GoDaddy**, **Namecheap**, **Spaceship**, **Squarespace**, and any other DNS provider.

---

## Prerequisites

- [ ] Vercel account with the project already deployed
- [ ] Domain purchased from your DNS provider
- [ ] Access to your DNS provider's dashboard

---

## Step 1 — Add the Domain in Vercel

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. In the left sidebar, click **Domains** (not inside Settings — it's a top-level menu item).
3. You'll see a search bar at the top that says **"Search any domain"**.
4. **Type your custom domain** (e.g. `pedicheck.co.za`) into that search bar and press **Enter**.
   - Alternatively, click the **"Add Existing"** button on the right.
5. Vercel will prompt you to choose a configuration:
   - **Recommended**: Add `example.com` and redirect `www` → apex (or vice-versa).
6. After adding, Vercel shows the **DNS records** you need to create. **Keep this page open** — you'll need the values in Step 2.

### ✅ Our Exact Domains & Records (from Vercel)

Vercel has assigned us the following. **Use these exact values at your DNS provider:**

#### Domain 1 — `pedi-check.com`

| Type      | Name / Host | Value                                      | Notes                          |
|-----------|-------------|--------------------------------------------|---------------------------------|
| **A**     | `@`         | `76.76.21.21`                              | Apex → 308 redirects to `www`  |
| **CNAME** | `www`       | `b13ba0b9335e452c.vercel-dns-017.com`      | Primary (Production)           |

#### Domain 2 — `pedicheck.co.za`

| Type      | Name / Host | Value                                      | Notes                          |
|-----------|-------------|--------------------------------------------|---------------------------------|
| **A**     | `@`         | `76.76.21.21`                              | Apex → 308 redirects to `www`  |
| **CNAME** | `www`       | `b13ba0b9335e452c.vercel-dns-017.com`      | Primary (Production)           |

> [!IMPORTANT]
> Vercel has moved to **new DNS targets** (`vercel-dns-017.com`) as part of an IP range expansion.
> The old values (`cname.vercel-dns.com` / `76.76.21.21`) still work, but Vercel recommends the new ones above.

---

## Step 2 — Configure DNS Records at Your Provider

Pick your provider below and follow the steps.

### Option A — Namecheap

1. Log in → **Domain List** → click **Manage** next to your domain.
2. Go to the **Advanced DNS** tab.
3. Delete any existing `A` or `CNAME` records for `@` and `www` that conflict.
4. Add the records:

   | Type    | Host  | Value                                     | TTL       |
   |---------|-------|-------------------------------------------|-----------|
   | A       | `@`   | `76.76.21.21`                             | Automatic |
   | CNAME   | `www` | `b13ba0b9335e452c.vercel-dns-017.com`     | Automatic |

5. Click the ✔️ checkmark to save each record.

---

### Option B — Squarespace (formerly Google Domains)

1. Log in to [Squarespace Domains](https://domains.squarespace.com/).
2. Select your domain → **DNS** → **DNS Settings**.
3. Click **Add Record** for each:

   | Type    | Host  | Data                                      | TTL     |
   |---------|-------|-------------------------------------------|---------|
   | A       | `@`   | `76.76.21.21`                             | 1 hour  |
   | CNAME   | `www` | `b13ba0b9335e452c.vercel-dns-017.com`     | 1 hour  |

4. Save.

---

### Option C — GoDaddy

1. Log in → **My Products** → click **DNS** next to your domain.
2. Under **Records**, edit or add:

   | Type    | Name  | Value                                     | TTL     |
   |---------|-------|-------------------------------------------|---------|
   | A       | `@`   | `76.76.21.21`                             | 1 Hour  |
   | CNAME   | `www` | `b13ba0b9335e452c.vercel-dns-017.com`     | 1 Hour  |

3. Click **Save**.

> [!NOTE]
> GoDaddy sometimes has a "parking" A record pointing to their own IP. **Delete it** before adding Vercel's A record.

---

### Option D — Spaceship.com

1. Log in to [Spaceship](https://www.spaceship.com/) → go to **Domains**.
2. Click on your domain → **DNS Records** (or **Manage DNS**).
3. Remove any existing `A` or `CNAME` records for `@` and `www` that conflict.
4. Add the records:

   | Type    | Host  | Value                                     | TTL       |
   |---------|-------|-------------------------------------------|-----------|
   | A       | `@`   | `76.76.21.21`                             | Automatic |
   | CNAME   | `www` | `b13ba0b9335e452c.vercel-dns-017.com`     | Automatic |

5. Click **Save** / **Add Record**.

> [!NOTE]
> Spaceship uses a clean, minimal UI. If you don't see a DNS section, make sure the domain's nameservers are set to **Spaceship's default nameservers** (not forwarded to another provider).

---

### Option E — domains.co.za

1. Log in to [domains.co.za](https://www.domains.co.za/) → **My Domains**.
2. Click on your domain → **DNS Management** (or **Manage DNS Records**).
3. Delete any existing `A` or `CNAME` records for `@` and `www` that conflict.
4. Add the records:

   | Type    | Host  | Value                                     | TTL       |
   |---------|-------|-------------------------------------------|-----------|
   | A       | `@`   | `76.76.21.21`                             | 14400     |
   | CNAME   | `www` | `b13ba0b9335e452c.vercel-dns-017.com`     | 14400     |

5. Click **Save Changes**.

> [!IMPORTANT]
> On domains.co.za, the **Host** field for the apex record might need to be left **blank** or set to your domain name (e.g. `example.co.za`) instead of `@`. Check how other existing records are formatted and match that pattern.

---

### Option F — Any Other Provider

The process is the same everywhere:

1. Find the **DNS Management** / **DNS Records** / **Zone Editor** section.
2. Remove any conflicting `A` or `CNAME` records for `@` and `www`.
3. Add an **A record** for `@` → `76.76.21.21`.
4. Add a **CNAME record** for `www` → `b13ba0b9335e452c.vercel-dns-017.com`.
5. Save and wait for propagation.

---

## Step 3 — Verify in Vercel

1. Go back to **Vercel → Domains** (left sidebar).
2. Your domain should show a status. It can take **a few minutes to 48 hours** for DNS to propagate, but usually it's **under 10 minutes**.
3. Once verified, Vercel will show a ✅ **Valid Configuration** next to the domain (like `pedicheck.vercel.app` already shows).

> [!TIP]
> You can check propagation status at [dnschecker.org](https://dnschecker.org/) by looking up your domain's A and CNAME records.

---

## Step 4 — SSL Certificate (Automatic)

- Vercel **automatically provisions a free SSL certificate** (Let's Encrypt) once DNS is verified.
- No action needed — HTTPS will just work.
- If it doesn't appear within an hour, click **Refresh** on the domain in Vercel.

---

## Step 5 — Redirects (Already Configured ✅)

Your domains are already set up with **www as primary** and a **308 redirect** from apex:

| Apex (redirects via 308) | Primary (Production)       |
|--------------------------|----------------------------|
| `pedi-check.com`         | → `www.pedi-check.com`     |
| `pedicheck.co.za`        | → `www.pedicheck.co.za`    |

No further action needed — Vercel handles the redirects automatically.

---

## Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| Domain stuck on "Pending" | Double-check DNS records match exactly. Remove conflicting records. Wait up to 48h. |
| SSL not provisioning | Ensure no CAA records block Let's Encrypt. Check with `dig CAA example.com`. |
| "Domain already in use" error | The domain is on another Vercel account. Remove it there first, or contact Vercel support. |
| Site loads but shows wrong project | Make sure the domain is added to the **correct** Vercel project. |

---

## Summary Checklist

### For `pedi-check.com` (Spaceship → Vercel)

- [x] **Vercel** — Add domain in Vercel Dashboard
- [ ] **Spaceship** — Add A record: `@` → `76.76.21.21`
- [ ] **Spaceship** — Add CNAME record: `www` → `b13ba0b9335e452c.vercel-dns-017.com`
- [ ] **Spaceship** — Wait for DNS propagation (check at [dnschecker.org](https://dnschecker.org/))
- [ ] **Vercel** — Verify ✅ Valid Configuration in Vercel
- [ ] **Vercel** — Confirm HTTPS works on `https://www.pedi-check.com`

### For `pedicheck.co.za` (Domains.co.za → Vercel)

- [x] **Vercel** — Add domain in Vercel Dashboard
- [ ] **Domains.co.za** — Add A record: `@` → `76.76.21.21`
- [ ] **Domains.co.za** — Add CNAME record: `www` → `b13ba0b9335e452c.vercel-dns-017.com`
- [ ] **Domains.co.za** — Wait for DNS propagation (check at [dnschecker.org](https://dnschecker.org/))
- [ ] **Vercel** — Verify ✅ Valid Configuration in Vercel
- [ ] **Vercel** — Confirm HTTPS works on `https://www.pedicheck.co.za`

