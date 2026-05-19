# Raising Atlantic — Infrastructure as Code

All production, staging, and dev GCP resources are managed here via Terraform.
No one should modify GCP (or any provider in this stack) through a console or CLI
after initial bootstrap. Every change is a Git commit, reviewed via PR, and applied
by CI.

## Pre-requisites (one-time bootstrap)

See [bootstrap/README.md](./bootstrap/README.md) and [TODO_GCP.md](../TODO_GCP.md).

## Directory layout

```
infra/
├── bootstrap/    One-off: GCS tfstate bucket, WIF pool, deployer service accounts
├── modules/      Reusable building blocks (cloud-run-service, cloud-sql-postgres, …)
└── envs/         Per-environment root modules (dev / staging / prod)
```

## Workflow

| Event | Action |
|---|---|
| PR touching `infra/**` | `terraform-plan.yml` — fmt, validate, tflint, checkov, plan, Infracost cost diff |
| Push to `main` | `terraform-apply.yml` — dev+staging auto, prod requires manual approval |
| Nightly cron 02:00 SAST | `terraform-drift.yml` — plan all envs, fail+notify Slack on diff |

## Providers (pinned in `envs/*/versions.tf`)

| Provider | Purpose |
|---|---|
| `hashicorp/google` | GCP core (Cloud Run, Cloud SQL, IAM, networking, monitoring, DNS) |
| `hashicorp/google-beta` | GCP beta features |
| `integrations/github` | Repo settings, branch protection, environments, secrets |
| `stripe/stripe` | Products, prices, webhook endpoints |
| `cloudflare/cloudflare` | WAF / DDoS layer (optional, in front of Cloud DNS) |
| `vercel/vercel` | Marketing preview deploys |
| `neondatabase/neon` | Neon Postgres (active until Cloud SQL migration is complete) |
| `jianyuan/sentry` | Sentry projects, alert rules, DSN issuance |
| `Trois-Six/sendgrid` | Sending domains, DKIM/SPF/DMARC records |
| `BetterStackHQ/better-uptime` | Uptime monitors, status page |
| `PagerDuty/pagerduty` | On-call escalation policies |

## Secrets

Secret *resources* (not values) are created by Terraform. Values are written once
with `gcloud secrets versions add` or a sealed-secrets workflow. Terraform uses
`lifecycle { ignore_changes = [secret_data] }` so rotation does not cause plan noise.

## What Terraform does NOT manage

- Application code deploys (app pipeline owns the Cloud Run image tag)
- Database schema (TypeORM migrations own the schema)
- User-generated data, blog content, runtime feature flags
- Per-developer GCP IAM grants for ad-hoc debugging (use just-in-time access)

## Notes on OpenTofu

This repo uses Terraform 1.9.8 (HashiCorp BSL). If you prefer a BSL-free runtime,
replace `.terraform-version` with `opentofu-1.8.5` and swap `terraform` for `tofu`
in the workflow steps. All HCL in this repo is compatible with both.
