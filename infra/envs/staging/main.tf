provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

provider "github" {
  token = var.github_token
  owner = "raisingatlantic-dev"
}

provider "stripe" {
  api_key = var.stripe_api_key
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "vercel" {
  api_token = var.vercel_api_token
}

provider "sentry" {
  token = var.sentry_auth_token
}

provider "sendgrid" {
  api_key = var.sendgrid_api_key
}

provider "betterstack" {
  api_token = var.betterstack_api_token
}

provider "pagerduty" {
  token = var.pagerduty_token
}

# ---------------------------------------------------------------------------
# Staging mirrors dev. Resources are identical in shape; differ only in:
#   - project_id (ra-staging vs ra-dev)
#   - tier (db-g1-small for staging vs db-f1-micro for dev)
#   - availability_type (REGIONAL for staging vs ZONAL for dev)
#   - min_instances (1 for staging vs 0 for dev)
#
# TODO(GCP): uncomment all resource blocks once dev env is validated.
# Copy the pattern from infra/envs/dev/main.tf and adjust values below.
# ---------------------------------------------------------------------------

# resource "google_service_account" "api_runner" {
#   account_id   = "ra-api-runner"
#   display_name = "Cloud Run API Runner — staging"
#   project      = var.project_id
# }

# module "db" {
#   source = "../../modules/cloud-sql-postgres"
#
#   project_id        = var.project_id
#   region            = var.region
#   instance_name     = "ra-postgres-staging"
#   tier              = "db-g1-small"
#   availability_type = "REGIONAL"
#   database_name     = "raisingatlantic"
#   database_user     = "ra_app"
#   pitr_enabled      = true
#   deletion_protection = false
#   private_network   = google_compute_network.vpc.self_link  # TODO(GCP): add VPC block
# }

# module "api" {
#   source = "../../modules/cloud-run-service"
#
#   project_id            = var.project_id
#   region                = var.region
#   name                  = "ra-api-staging"
#   image                 = "africa-south1-docker.pkg.dev/${var.project_id}/ra-images/api:latest"
#   service_account_email = google_service_account.api_runner.email
#   min_instances         = 1
#   max_instances         = 5
#   memory                = "512Mi"
# }

# module "web" {
#   source = "../../modules/cloud-run-service"
#
#   project_id            = var.project_id
#   region                = var.region
#   name                  = "ra-web-staging"
#   image                 = "africa-south1-docker.pkg.dev/${var.project_id}/ra-images/web:latest"
#   service_account_email = google_service_account.api_runner.email
#   min_instances         = 1
#   max_instances         = 5
#   memory                = "512Mi"
#
#   env_vars = {
#     NEXT_PUBLIC_API_URL = module.api.url
#     NEXT_PUBLIC_USE_API = "true"
#   }
# }
