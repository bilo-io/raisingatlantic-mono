# TODO_GCP — Bootstrap Checklist

Step-by-step guide to go from zero GCP account to a working Terraform CI pipeline.
Each step is marked with the action type: **[CONSOLE]** (browser), **[CLI]** (terminal), or **[TERRAFORM]** (Terraform command).

Work through these in order. Do not skip steps — later steps depend on earlier ones.

---

## Phase 0: Google Account & Workspace

- [ ] **[CONSOLE]** Create or verify you have a Google Workspace account tied to `raisingatlantic.com`.
  Google Workspace is the prerequisite for creating a GCP Organization.
  If you don't have one: https://workspace.google.com → Start free trial.

- [ ] **[CONSOLE]** Verify domain ownership for `raisingatlantic.com` in Google Search Console (required by Workspace setup).

---

## Phase 1: GCP Organization

- [ ] **[CONSOLE]** Navigate to https://console.cloud.google.com → verify the GCP Organization `raisingatlantic.com` appears in the organization dropdown.
  If it doesn't appear, the Workspace account isn't linked — contact Google Workspace Admin support.

- [ ] **[CONSOLE]** Create a billing account:
  Navigation → Billing → Manage billing accounts → Create account.
  - Attach a company credit card.
  - Note the billing account ID (format: `XXXXXX-XXXXXX-XXXXXX`).
  - **Update** `infra/bootstrap/variables.tf` → `billing_account` default value.

- [ ] **[CONSOLE]** Set up budget alerts on the billing account:
  Billing → Budgets & alerts → Create budget.
  - Budget amount: set your monthly cap (e.g. R 3,000).
  - Alert thresholds: 50%, 80%, 100%.
  - Email alert recipients: `billing@raisingatlantic.com`.

---

## Phase 2: Environment Projects

Create three projects — one per environment. **These are created via console once; Terraform will manage them going forward.**

- [ ] **[CONSOLE]** Create project `ra-dev`:
  Console → IAM & Admin → Manage resources → Create project.
  - Project name: `Raising Atlantic Dev`
  - Project ID: `ra-dev` (or nearest available if taken)
  - Organization: `raisingatlantic.com`
  - Billing: attach to the billing account from Phase 1.
  - **Update** `infra/envs/dev/terraform.tfvars` → `project_id`.

- [ ] **[CONSOLE]** Create project `ra-staging` (same steps, project ID: `ra-staging`).
  - **Update** `infra/envs/staging/terraform.tfvars` → `project_id`.

- [ ] **[CONSOLE]** Create project `ra-prod` (same steps, project ID: `ra-prod`).
  - **Update** `infra/envs/prod/terraform.tfvars` → `project_id`.

- [ ] **[CONSOLE]** Create project `ra-bootstrap` (for the bootstrap Terraform state bucket and WIF pool):
  - Project ID: `ra-bootstrap`
  - **Update** `infra/bootstrap/variables.tf` → `bootstrap_project_id` default value.

---

## Phase 3: Bootstrap Project — APIs

- [ ] **[CLI]** Enable required APIs in the bootstrap project:
  ```sh
  gcloud config set project ra-bootstrap

  gcloud services enable \
    iam.googleapis.com \
    iamcredentials.googleapis.com \
    cloudresourcemanager.googleapis.com \
    storage.googleapis.com \
    secretmanager.googleapis.com
  ```

---

## Phase 4: Local Terraform Setup

- [ ] **[CLI]** Install `tfenv` and pin Terraform version:
  ```sh
  brew install tfenv
  cd infra
  tfenv install  # reads .terraform-version → installs 1.9.8
  tfenv use 1.9.8
  terraform version  # confirm: Terraform v1.9.8
  ```

- [ ] **[CLI]** Authenticate locally for bootstrap (owner-level access required):
  ```sh
  gcloud auth application-default login
  gcloud config set project ra-bootstrap
  ```

---

## Phase 5: Run Bootstrap

- [ ] **[TERRAFORM]** Initialize and apply the bootstrap module:
  ```sh
  cd infra/bootstrap
  terraform init
  terraform plan -var-file=../../infra/bootstrap/variables.tf  # review before applying
  terraform apply
  ```

- [ ] **[CLI]** Capture bootstrap outputs:
  ```sh
  terraform output
  # Copy:
  #   tfstate_bucket_name         → update infra/envs/*/backend.tf
  #   workload_identity_provider  → GitHub Secret: TF_WORKLOAD_IDENTITY_PROVIDER
  #   deployer_sa_dev             → GitHub Secret: TF_SERVICE_ACCOUNT_DEV
  #   deployer_sa_staging         → GitHub Secret: TF_SERVICE_ACCOUNT_STAGING
  #   deployer_sa_prod            → GitHub Secret: TF_SERVICE_ACCOUNT_PROD
  ```

- [ ] **[CLI]** Update `infra/envs/*/backend.tf` with the actual bucket name (replace `ra-tfstate` placeholder if the name was adjusted due to GCS naming conflicts).

---

## Phase 6: GitHub Secrets

Go to: https://github.com/raisingatlantic-dev/raisingatlantic-mono/settings/secrets/actions

Add each secret:

- [ ] `TF_WORKLOAD_IDENTITY_PROVIDER` — from bootstrap output `workload_identity_provider`
- [ ] `TF_SERVICE_ACCOUNT_DEV` — from bootstrap output `deployer_sa_dev`
- [ ] `TF_SERVICE_ACCOUNT_STAGING` — from bootstrap output `deployer_sa_staging`
- [ ] `TF_SERVICE_ACCOUNT_PROD` — from bootstrap output `deployer_sa_prod`
- [ ] `TF_STATE_BUCKET` — from bootstrap output `tfstate_bucket_name`
- [ ] `GH_TOKEN_TERRAFORM` — a GitHub PAT with `repo` scope for the `integrations/github` provider
- [ ] `STRIPE_API_KEY_DEV` — Stripe test-mode secret key
- [ ] `STRIPE_API_KEY_STAGING` — Stripe test-mode secret key (can reuse dev key)
- [ ] `STRIPE_API_KEY_PROD` — Stripe live-mode secret key (add only after Stripe KYC is complete)
- [ ] `CLOUDFLARE_API_TOKEN` — scoped to DNS edit on `raisingatlantic.com`
- [ ] `VERCEL_API_TOKEN` — Vercel team token for managing marketing preview deployments
- [ ] `SENTRY_AUTH_TOKEN` — Sentry org auth token
- [ ] `SENDGRID_API_KEY` — SendGrid API key (Mail Send permission)
- [ ] `BETTERSTACK_API_TOKEN` — BetterStack API token
- [ ] `PAGERDUTY_TOKEN` — PagerDuty API token
- [ ] `SLACK_WEBHOOK_URL` — Incoming webhook URL for `#deploys` Slack channel (create in Slack App settings)
- [ ] `INFRACOST_API_KEY` — register at https://infracost.io (free tier is sufficient)

---

## Phase 7: GitHub Environments

Go to: https://github.com/raisingatlantic-dev/raisingatlantic-mono/settings/environments

- [ ] Create environment `dev` (no protection rules needed)
- [ ] Create environment `staging` (no protection rules needed)
- [ ] Create environment `production`:
  - Enable **Required reviewers**
  - Add reviewer: `bilo-lwabona` (yourself)
  - This is the manual approval gate before prod Terraform applies

---

## Phase 8: Enable APIs in Environment Projects

Repeat for each of `ra-dev`, `ra-staging`, `ra-prod`:

- [ ] **[CLI]**
  ```sh
  gcloud config set project ra-dev  # change to ra-staging / ra-prod as needed

  gcloud services enable \
    run.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    storage.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    logging.googleapis.com \
    monitoring.googleapis.com \
    cloudtrace.googleapis.com \
    clouderrorreporting.googleapis.com \
    compute.googleapis.com \
    servicenetworking.googleapis.com \
    cloudscheduler.googleapis.com \
    pubsub.googleapis.com \
    iam.googleapis.com \
    iamcredentials.googleapis.com \
    billingbudgets.googleapis.com
  ```

---

## Phase 9: Grant Deployer SA Roles on Environment Projects

For each project × deployer SA, grant the minimum required roles.
These bindings are defined (commented-out) in `infra/bootstrap/main.tf` — uncomment them once
the environment project IDs are confirmed.

Alternatively, run manually while iterating:

- [ ] **[CLI]** Grant dev deployer access:
  ```sh
  # Replace ra-dev with actual project ID if different
  gcloud projects add-iam-policy-binding ra-dev \
    --member="serviceAccount:$(terraform -chdir=infra/bootstrap output -raw deployer_sa_dev)" \
    --role="roles/editor"
  ```
  Repeat for staging → `deployer_sa_staging` and prod → `deployer_sa_prod`.

  > Note: `roles/editor` is broad. After initial validation, narrow to:
  > `roles/run.developer`, `roles/cloudsql.editor`, `roles/secretmanager.admin`, `roles/iam.serviceAccountUser`

---

## Phase 10: First Terraform Apply via CI

- [ ] **[CLI]** Open a PR from `feat/iac-terraform-phase-1-4` to `dev`.
  The `terraform-plan.yml` workflow will run and post plan output as a PR comment.
  Review the plan to confirm only the expected `outputs.tf` placeholder change is present.

- [ ] Merge the PR to `dev`.

- [ ] Push `dev` → `main` (or open a PR from `dev` to `main`).
  The `terraform-apply.yml` workflow will:
  1. Auto-apply dev
  2. Auto-apply staging (after dev succeeds)
  3. Pause for manual approval on `production` environment

- [ ] Approve the prod gate in GitHub Actions → "production" environment.

---

## Phase 11: Uncomment Resources Incrementally

Work through `infra/envs/dev/main.tf` from top to bottom, uncommenting one block at a time:

1. VPC + subnets
2. Cloud SQL instance (requires VPC)
3. Service account for Cloud Run
4. Artifact Registry
5. Secret resources
6. Cloud Run API service
7. Cloud Run Web service
8. Sentry projects
9. GitHub branch protection rules
10. BetterStack uptime monitors
11. Cloud Armor WAF (prod only)
12. Stripe webhook endpoint (prod only, after Stripe KYC)

After each block is uncommented, push → plan → review → apply.

---

## Phase 12: Database Migration (Neon → Cloud SQL)

- [ ] Run a `pg_dump` from Neon and a `pg_restore` into the Cloud SQL dev instance as a rehearsal.
  ```sh
  # Dump from Neon (replace with actual Neon connection string)
  pg_dump "$NEON_DATABASE_URL" --no-owner --no-acl -Fc -f raisingatlantic_dump.pgc

  # Restore into Cloud SQL via Auth Proxy (proxy must be running on port 5432)
  pg_restore -h 127.0.0.1 -U ra_app -d raisingatlantic -Fc raisingatlantic_dump.pgc
  ```
- [ ] Validate the restored data against the Neon source.
- [ ] Switch `DATABASE_URL` in dev to point at Cloud SQL. Run API smoke tests.
- [ ] Repeat for staging, then schedule a prod cutover window.
- [ ] Sign Neon DPA (or cancel Neon after migration is complete).

---

## Phase 13: Verify Nightly Drift Detection

- [ ] **[CLI]** Manually trigger the drift workflow to confirm it runs green:
  ```sh
  gh workflow run terraform-drift.yml
  ```
- [ ] Check GitHub Actions → confirm all three env jobs pass (exit code 0 = no drift).

---

## Done ✓

When all boxes above are checked:
- [ ] Update `docs/GO_LIVE/DEV.md` → Phase 1.4 checklist items to `[x]`
- [ ] File `docs/adr/0001-hosting.md` status: **Accepted** (already set)
- [ ] Create a follow-up task for Phase 1.5 (database migration from Neon)
