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
# Service account for Cloud Run workloads in dev
# TODO(GCP): uncomment once the dev project is created and APIs are enabled
# ---------------------------------------------------------------------------
# resource "google_service_account" "api_runner" {
#   account_id   = "ra-api-runner"
#   display_name = "Cloud Run API Runner — dev"
#   project      = var.project_id
# }

# ---------------------------------------------------------------------------
# VPC + Private Service Connect for Cloud SQL
# TODO(GCP): uncomment after VPC is provisioned
# ---------------------------------------------------------------------------
# resource "google_compute_network" "vpc" {
#   name                    = "ra-vpc-dev"
#   auto_create_subnetworks = false
#   project                 = var.project_id
# }
#
# resource "google_compute_subnetwork" "api" {
#   name          = "ra-api-subnet-dev"
#   ip_cidr_range = "10.10.0.0/24"
#   region        = var.region
#   network       = google_compute_network.vpc.id
#   project       = var.project_id
# }
#
# resource "google_compute_global_address" "psc_range" {
#   name          = "ra-psc-range-dev"
#   purpose       = "VPC_PEERING"
#   address_type  = "INTERNAL"
#   prefix_length = 16
#   network       = google_compute_network.vpc.id
#   project       = var.project_id
# }
#
# resource "google_service_networking_connection" "psc" {
#   network                 = google_compute_network.vpc.id
#   service                 = "servicenetworking.googleapis.com"
#   reserved_peering_ranges = [google_compute_global_address.psc_range.name]
# }

# ---------------------------------------------------------------------------
# Cloud SQL (Postgres 15) — dev instance
# TODO(GCP): uncomment after VPC is provisioned (private_network required)
# ---------------------------------------------------------------------------
# module "db" {
#   source = "../../modules/cloud-sql-postgres"
#
#   project_id        = var.project_id
#   region            = var.region
#   instance_name     = "ra-postgres-dev"
#   tier              = "db-f1-micro"
#   availability_type = "ZONAL"
#   database_name     = "raisingatlantic"
#   database_user     = "ra_app"
#   pitr_enabled      = false
#   deletion_protection = false
#
#   # TODO(GCP): replace with actual VPC network self-link once VPC is created
#   private_network   = google_compute_network.vpc.self_link
# }

# ---------------------------------------------------------------------------
# Secret Manager — dev secrets
# TODO(GCP): uncomment after APIs are enabled in dev project
# ---------------------------------------------------------------------------
# locals {
#   secrets = [
#     "ra-db-password",
#     "ra-jwt-secret",
#     "ra-stripe-webhook-secret",
#     "ra-sendgrid-api-key",
#     "ra-sentry-dsn-api",
#     "ra-sentry-dsn-web",
#   ]
# }
#
# module "secrets" {
#   for_each = toset(local.secrets)
#   source   = "../../modules/secret"
#
#   project_id = var.project_id
#   region     = var.region
#   secret_id  = each.value
#   labels     = { environment = "dev" }
#
#   # TODO(GCP): replace with the API runner SA email once created
#   # accessor_service_accounts = [google_service_account.api_runner.email]
# }

# ---------------------------------------------------------------------------
# Cloud Run — API service (dev)
# TODO(GCP): uncomment after service account and VPC are created
# ---------------------------------------------------------------------------
# module "api" {
#   source = "../../modules/cloud-run-service"
#
#   project_id            = var.project_id
#   region                = var.region
#   name                  = "ra-api-dev"
#   # TODO(GCP): replace placeholder with actual Artifact Registry image URI
#   image                 = "africa-south1-docker.pkg.dev/${var.project_id}/ra-images/api:latest"
#   service_account_email = google_service_account.api_runner.email
#   min_instances         = 0
#   max_instances         = 3
#   memory                = "512Mi"
#
#   env_vars = {
#     NODE_ENV    = "development"
#     PORT        = "3000"
#     DB_SSL      = "true"
#   }
#
#   secrets = {
#     DATABASE_URL           = "ra-db-password"
#     JWT_SECRET             = "ra-jwt-secret"
#     STRIPE_WEBHOOK_SECRET  = "ra-stripe-webhook-secret"
#   }
# }

# ---------------------------------------------------------------------------
# Cloud Run — Web service (dev)
# TODO(GCP): uncomment after API module is configured
# ---------------------------------------------------------------------------
# module "web" {
#   source = "../../modules/cloud-run-service"
#
#   project_id            = var.project_id
#   region                = var.region
#   name                  = "ra-web-dev"
#   image                 = "africa-south1-docker.pkg.dev/${var.project_id}/ra-images/web:latest"
#   service_account_email = google_service_account.api_runner.email
#   min_instances         = 0
#   max_instances         = 3
#   memory                = "512Mi"
#
#   env_vars = {
#     NEXT_PUBLIC_API_URL  = module.api.url
#     NEXT_PUBLIC_USE_API  = "true"
#   }
# }

# ---------------------------------------------------------------------------
# Artifact Registry — container image registry
# TODO(GCP): uncomment after APIs are enabled
# ---------------------------------------------------------------------------
# resource "google_artifact_registry_repository" "images" {
#   provider      = google-beta
#   location      = var.region
#   repository_id = "ra-images"
#   format        = "DOCKER"
#   project       = var.project_id
#   description   = "Container images for Raising Atlantic (dev environment)"
# }

# ---------------------------------------------------------------------------
# Sentry — dev projects
# TODO(OPS): uncomment after Sentry organization is created
# ---------------------------------------------------------------------------
# resource "sentry_project" "api_dev" {
#   organization = var.sentry_organization
#   name         = "ra-api-dev"
#   slug         = "ra-api-dev"
#   platform     = "node-nestjs"
# }
#
# resource "sentry_project" "web_dev" {
#   organization = var.sentry_organization
#   name         = "ra-web-dev"
#   slug         = "ra-web-dev"
#   platform     = "javascript-nextjs"
# }

# ---------------------------------------------------------------------------
# GitHub — branch protection for dev branch
# Requires the CI jobs defined in .github/workflows/ci.yml to pass before merge.
# ---------------------------------------------------------------------------
resource "github_branch_protection" "dev" {
  repository_id = "raisingatlantic-mono"
  pattern       = "dev"

  required_status_checks {
    strict   = true
    contexts = ["Lint", "API Tests", "Web Build"]
  }

  required_pull_request_reviews {
    dismiss_stale_reviews           = true
    required_approving_review_count = 1
  }

  enforce_admins = false
}

# ---------------------------------------------------------------------------
# BetterStack — uptime monitors (dev)
# TODO(OPS): uncomment after BetterStack account is created
# ---------------------------------------------------------------------------
# resource "betterstack_monitor" "api_health_dev" {
#   url              = "${module.api.url}/health"
#   monitor_type     = "status"
#   check_frequency  = 180 # 3 minutes in dev (60 seconds in prod)
#   team_name        = "Raising Atlantic"
# }
