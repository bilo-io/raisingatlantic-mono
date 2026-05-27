# GCP Setup Guide — Raising Atlantic

A practical walkthrough from a fresh Google account to a fully working three-environment GCP setup with GitHub Actions auto-deploys.

**What you already have in this repo:**
- Terraform modules ([infra/modules/](../infra/modules/)) — Cloud Run, Cloud SQL, Secret Manager, Workload Identity Federation
- Three environment configs ([infra/envs/dev|staging|prod/](../infra/envs/)) with resources commented out, ready to enable
- A bootstrap module ([infra/bootstrap/](../infra/bootstrap/)) that creates the Terraform state bucket, WIF pool, and deployer service accounts
- GitHub Actions workflows ([.github/workflows/](../.github/workflows/)) — `terraform-plan`, `terraform-apply`, `terraform-drift`, `cd-app`
- A detailed step-by-step checklist in [TODO_GCP.md](../TODO_GCP.md) — use it as the tickable companion to this guide

**Region throughout:** `africa-south1` (POPIA Section 72 — no offshoring).

---

## Cost approach across the three environments

The Terraform shape is identical across `dev`, `staging`, and `prod`. What differs is sizing. Dev is intentionally as small as Terraform will let it go.

| Resource | dev | staging | prod |
|---|---|---|---|
| Cloud SQL tier | `db-f1-micro` | `db-g1-small` | `db-custom-2-7680` |
| Cloud SQL HA | **ZONAL** (single zone) | REGIONAL (HA) | REGIONAL (HA) |
| Cloud SQL PITR | off | on | on |
| Cloud SQL deletion protection | off | off | **on** |
| Cloud Run min instances | **0** (scale to zero) | 1 | 2 |
| Cloud Run max instances | 3 | 5 | 20 |
| Cloud Run memory | 512Mi | 512Mi | 1Gi |
| Cloud Armor WAF | none | none | enabled |
| BetterStack monitoring | 3 min interval | 1 min | 1 min + PagerDuty |

Dev's biggest cost saver is **scale-to-zero on Cloud Run + zonal Postgres**. Expect roughly **$30–60/mo** for dev once everything's running. Staging adds HA and always-warm instances (~$200–250/mo). Prod is the [PRICE_ESTIMATE.md](PRICE_ESTIMATE.md) Year 1 figure (~$760–1,130/mo).

### The $300 / 90-day free trial

Google gives every new billing account **$300 USD of credit, valid for 90 days**. Practical implications:

- The credit comfortably covers all three environments **standing up** for the trial period.
- Once you upgrade to a paid account (or the 90 days end), billing kicks in. Set the budget alerts in Step 4 below before any of that happens.
- The trial has soft resource quotas (e.g. 24 vCPUs/region). You won't hit them at Tier 1.
- **Sign up for the trial with the account that will own the GCP Organization** — switching ownership later is a hassle.

---

## Step 1 — Google account and Workspace

1. Sign in to https://console.cloud.google.com with the Google account you want to own GCP for Raising Atlantic. This should be a **Workspace account on `raisingatlantic.com`** (e.g. `bilo@raisingatlantic.com`), not a personal `@gmail.com`. Workspace is required to get a GCP Organization tied to your domain.
2. If you don't have Workspace yet: https://workspace.google.com → Start free trial → verify domain ownership for `raisingatlantic.com` (the wizard walks you through DNS TXT records). Pick the cheapest "Business Starter" tier — you can downgrade or cancel later.
3. Once signed in, confirm the org appears in the GCP top-bar org picker. If it doesn't show up after a few minutes, the Workspace account isn't yet linked — wait 15 min and retry, or contact Workspace support.

---

## Step 2 — Activate the free trial and create a billing account

1. In the GCP Console, top-right banner: **"Activate"** the free trial.
   - Enter a credit card (won't be charged unless you upgrade).
   - Address: South Africa.
   - Tax info: VAT number if you have one (not required for the trial).
2. After activation, go to **Billing → Manage billing accounts**. You'll see one billing account created automatically (e.g. "My Billing Account").
3. **Rename** it to something meaningful: "Raising Atlantic — Trial" (you'll create a real one when you upgrade).
4. Copy the **Billing Account ID** (format: `XXXXXX-XXXXXX-XXXXXX`).
5. Update [infra/bootstrap/variables.tf:31](../infra/bootstrap/variables.tf#L31) — replace `REPLACE_WITH_BILLING_ACCOUNT_ID` with this ID.

---

## Step 3 — Create the four projects

You need **four projects**: one bootstrap (shared infra state) and three environments. Create them in the console once; Terraform manages everything inside them after that.

For each project: **IAM & Admin → Manage resources → Create project**, attach to the org `raisingatlantic.com`, attach to the billing account from Step 2.

| Project name | Project ID | Purpose |
|---|---|---|
| Raising Atlantic — Bootstrap | `ra-bootstrap` | TF state bucket, WIF pool, deployer SAs |
| Raising Atlantic — Dev | `ra-dev` | Dev Cloud Run, Cloud SQL, etc. |
| Raising Atlantic — Staging | `ra-staging` | Staging environment |
| Raising Atlantic — Prod | `ra-prod` | Production environment |

> Project IDs are globally unique. If `ra-dev` is taken, try `ra-dev-1` or `raising-atlantic-dev`. Update the matching `terraform.tfvars` in [infra/envs/](../infra/envs/) if you deviate from the defaults.

---

## Step 4 — Budget alerts (do this immediately)

The free trial gives you a soft cap, but once it ends you're on real billing. Set alerts now so nothing surprises you.

**Billing → Budgets & alerts → Create budget.**

| Budget | Amount | Alert thresholds | Notify |
|---|---|---|---|
| Whole-org guardrail | $500 / mo | 50%, 90%, 100% | Your Workspace email |
| Per-project: `ra-prod` | $150 / mo (until you scale) | 50%, 90%, 100% | Your Workspace email |
| Per-project: `ra-staging` | $80 / mo | 50%, 90%, 100% | Your Workspace email |
| Per-project: `ra-dev` | $40 / mo | 50%, 90%, 100% | Your Workspace email |

If a project ever exceeds its budget, you'll get an email. You can also wire budgets to a Pub/Sub topic that disables the project at 100% — overkill for now, but worth knowing.

---

## Step 5 — Install local tools

```sh
# gcloud CLI
brew install --cask google-cloud-sdk

# Terraform via tfenv (pins to .terraform-version in repo)
brew install tfenv
cd infra
tfenv install
tfenv use 1.9.8
terraform version   # confirm: 1.9.8

# Optional but recommended
brew install tfsec checkov infracost
```

Authenticate gcloud:

```sh
gcloud auth login
gcloud auth application-default login   # for Terraform to use
gcloud config set project ra-bootstrap
```

---

## Step 6 — Enable APIs in the bootstrap project

```sh
gcloud config set project ra-bootstrap

gcloud services enable \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com
```

These five are the minimum to let the bootstrap module create the state bucket, the WIF pool, and the deployer service accounts.

---

## Step 7 — Run the bootstrap Terraform

The bootstrap module creates the infrastructure that *everything else* depends on. Run it once, from your laptop, with owner-level credentials.

```sh
cd infra/bootstrap
terraform init
terraform plan
terraform apply
```

Expected output: state bucket `ra-tfstate`, a Workload Identity Federation pool `github-actions`, and six service accounts (`tf-deployer-{dev,staging,prod}` + `app-deployer-{dev,staging,prod}`).

After it applies, capture the outputs you'll paste into GitHub:

```sh
terraform output
```

Note the values of:
- `workload_identity_provider`
- `deployer_sa_dev`, `deployer_sa_staging`, `deployer_sa_prod`
- `tfstate_bucket_name`

> **Why local instead of CI?** Bootstrap is the chicken-and-egg module — it creates the very service accounts CI needs to run. Apply it once locally; after that, the same module is owned by Terraform and can be updated through PRs.

---

## Step 8 — Configure GitHub

### 8a. Secrets

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these from Step 7's `terraform output`:

| Secret | Value source |
|---|---|
| `TF_WORKLOAD_IDENTITY_PROVIDER` | bootstrap output `workload_identity_provider` |
| `TF_SERVICE_ACCOUNT_DEV` | bootstrap output `deployer_sa_dev` |
| `TF_SERVICE_ACCOUNT_STAGING` | bootstrap output `deployer_sa_staging` |
| `TF_SERVICE_ACCOUNT_PROD` | bootstrap output `deployer_sa_prod` |
| `TF_STATE_BUCKET` | bootstrap output `tfstate_bucket_name` |
| `GH_TOKEN_TERRAFORM` | GitHub PAT, `repo` scope only |

For third-party providers (Stripe, Cloudflare, etc.), see the full list in [TODO_GCP.md](../TODO_GCP.md) Phase 6. You can add these incrementally as you uncomment the corresponding Terraform resources — they're not required for the first apply.

### 8b. Environments

**Settings → Environments → New environment**, create three:

| Environment | Protection |
|---|---|
| `dev` | None |
| `staging` | None |
| `production` | **Required reviewers** → add yourself. This is the human gate before prod applies. |

This matches `apply-prod` in [.github/workflows/terraform-apply.yml:127](../.github/workflows/terraform-apply.yml#L127).

---

## Step 9 — Enable APIs in the environment projects

For each of `ra-dev`, `ra-staging`, `ra-prod`:

```sh
gcloud config set project ra-dev   # repeat for ra-staging and ra-prod

gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  logging.googleapis.com monitoring.googleapis.com \
  cloudtrace.googleapis.com clouderrorreporting.googleapis.com \
  compute.googleapis.com servicenetworking.googleapis.com \
  iam.googleapis.com iamcredentials.googleapis.com \
  billingbudgets.googleapis.com
```

Then grant each deployer SA Editor on its env project (broad to start — narrow later):

```sh
# Run once per env
gcloud projects add-iam-policy-binding ra-dev \
  --member="serviceAccount:$(terraform -chdir=infra/bootstrap output -raw deployer_sa_dev)" \
  --role="roles/editor"

gcloud projects add-iam-policy-binding ra-staging \
  --member="serviceAccount:$(terraform -chdir=infra/bootstrap output -raw deployer_sa_staging)" \
  --role="roles/editor"

gcloud projects add-iam-policy-binding ra-prod \
  --member="serviceAccount:$(terraform -chdir=infra/bootstrap output -raw deployer_sa_prod)" \
  --role="roles/editor"
```

> After you've confirmed the pipeline works end-to-end, narrow `roles/editor` down to: `roles/run.developer`, `roles/cloudsql.editor`, `roles/secretmanager.admin`, `roles/iam.serviceAccountUser`. Same uncomment-bindings exist (commented) at the bottom of [infra/bootstrap/main.tf](../infra/bootstrap/main.tf#L156).

---

## Step 10 — First Terraform apply via CI

At this point each env project is empty (no resources) — the resource blocks in `infra/envs/*/main.tf` are still commented out. The first CI run will only verify the pipeline works, applying nothing but the GitHub provider resources (branch protection rules).

1. Push a small change to `dev` (e.g. edit a comment in [infra/envs/dev/main.tf](../infra/envs/dev/main.tf)).
2. Open a PR to `dev`. The `terraform-plan` workflow runs and posts the plan as a PR comment.
3. Merge the PR. `terraform-apply` runs `apply-dev` → `apply-staging` → pauses on `apply-prod` for your approval.
4. Approve in the GitHub Actions UI when you're ready.

If all three apply cleanly, the pipeline is live.

---

## Step 11 — Uncomment resources, environment by environment

This is the slow part. Work top-to-bottom through [infra/envs/dev/main.tf](../infra/envs/dev/main.tf) **one block at a time**, in this order:

1. VPC + subnets + Private Service Connect range
2. Service account `ra-api-runner`
3. Artifact Registry repo `ra-images`
4. Cloud SQL instance (`db-f1-micro`, ZONAL — cheap)
5. Secret Manager resources
6. Cloud Run API service (`min_instances = 0`)
7. Cloud Run Web service (`min_instances = 0`)
8. Sentry, BetterStack, Cloudflare resources as those accounts come online

After each uncomment: push to a feature branch → PR to `dev` → review the plan → merge → confirm apply succeeds → move to the next.

Once `dev` is stable, **mirror the same order in `staging`** ([infra/envs/staging/main.tf](../infra/envs/staging/main.tf)) — keeping `db-g1-small` REGIONAL HA and `min_instances = 1`.

Finally **mirror in `prod`** ([infra/envs/prod/main.tf](../infra/envs/prod/main.tf)) with `db-custom-2-7680` HA, `min_instances = 2`, plus the Cloud Armor WAF block.

---

## How the app deploys (after infra is live)

Two pipelines, decoupled on purpose:

- **Terraform pipeline** ([terraform-apply.yml](../.github/workflows/terraform-apply.yml)) — owns infra. Triggered by changes under `infra/**`.
- **App pipeline** ([cd-app.yml](../.github/workflows/cd-app.yml)) — owns container images. Triggered by changes under `src/**`. Builds the API and Web images, pushes to Artifact Registry, calls `gcloud run deploy` on the corresponding Cloud Run service.

The Cloud Run modules have `lifecycle { ignore_changes = [template[0].containers[0].image] }` ([infra/modules/cloud-run-service/main.tf:58](../infra/modules/cloud-run-service/main.tf#L58)) so the two pipelines don't fight over the image tag.

Branch → environment mapping:
- `dev` → `ra-dev`
- `test` → `ra-staging`
- `main` → `ra-prod` (gated by manual approval)

---

## Verifying it works

After the first end-to-end apply, sanity-check from your laptop:

```sh
# Confirm Cloud SQL instance is up (dev)
gcloud sql instances list --project=ra-dev

# Confirm Cloud Run services
gcloud run services list --project=ra-dev --region=africa-south1

# Hit the API health endpoint
curl https://ra-api-dev-<hash>.africa-south1.run.app/health

# Tail logs
gcloud logging tail "resource.type=cloud_run_revision" --project=ra-dev
```

---

## Common gotchas

- **`Permission denied` on the GCS state bucket** — the deployer SA wasn't granted access. Re-check the IAM binding from Step 9, and confirm `roles/storage.admin` on the bucket (added by [infra/bootstrap/main.tf:50](../infra/bootstrap/main.tf#L50)).
- **`API not enabled` errors during apply** — Step 9 missed a service. Re-run the `gcloud services enable` block for the failing project.
- **Cloud SQL provisioning takes 10–15 minutes** — not stuck, just slow. First apply that touches Cloud SQL will feel long.
- **WIF token rejected** (`Unable to acquire impersonated credentials`) — the branch the workflow is running from doesn't match the `attribute_condition` in [infra/bootstrap/main.tf:85](../infra/bootstrap/main.tf#L85). Only `dev`, `test`, and `main` are allowed.
- **`Quota exceeded` on the free trial** — the trial caps you at 24 vCPUs/region. db-custom-2-7680 HA + a few Cloud Run instances is fine; aggressive scale-up isn't. Upgrade to a paid account when you're ready to load-test.
- **Terraform state lock stuck** after a failed run — `gcloud storage rm gs://<bucket>/<env>/default.tflock` (only if you're sure no apply is running).

---

## Cross-references

- Detailed checklist: [TODO_GCP.md](../TODO_GCP.md)
- Cost projections: [docs/PRICE_ESTIMATE.md](PRICE_ESTIMATE.md)
- Architecture decisions: [docs/adr/](adr/)
- Go-live phases: [docs/GO_LIVE.md](GO_LIVE.md)
- Project context for Claude / new engineers: [CLAUDE.md](../CLAUDE.md)
