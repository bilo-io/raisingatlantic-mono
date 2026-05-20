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
# PRODUCTION ENVIRONMENT
#
# Key differences from staging:
#   - deletion_protection = true on Cloud SQL (set before go-live)
#   - availability_type = REGIONAL (HA)
#   - min_instances = 2 (no cold starts)
#   - Stripe LIVE keys (not test keys)
#   - Cloud Armor WAF enabled
#   - All monitoring alerts wired to PagerDuty
#
# TODO(GCP): uncomment each block as you work through TODO_GCP.md.
# Apply order: VPC → IAM → DB → Secrets → Cloud Run → Monitoring
# ---------------------------------------------------------------------------

# resource "google_service_account" "api_runner" {
#   account_id   = "ra-api-runner"
#   display_name = "Cloud Run API Runner — prod"
#   project      = var.project_id
# }

# module "db" {
#   source = "../../modules/cloud-sql-postgres"
#
#   project_id          = var.project_id
#   region              = var.region
#   instance_name       = "ra-postgres-prod"
#   tier                = "db-n1-standard-2"   # TODO(GCP): right-size based on load tests
#   availability_type   = "REGIONAL"
#   database_name       = "raisingatlantic"
#   database_user       = "ra_app"
#   pitr_enabled        = true
#   deletion_protection = true   # IMPORTANT: enable before go-live
#   private_network     = google_compute_network.vpc.self_link  # TODO(GCP): add VPC block
# }

# module "api" {
#   source = "../../modules/cloud-run-service"
#
#   project_id            = var.project_id
#   region                = var.region
#   name                  = "ra-api-prod"
#   image                 = "africa-south1-docker.pkg.dev/${var.project_id}/ra-images/api:latest"
#   service_account_email = google_service_account.api_runner.email
#   min_instances         = 2
#   max_instances         = 20
#   memory                = "1Gi"
#
#   secrets = {
#     DATABASE_URL          = "ra-db-password"
#     JWT_SECRET            = "ra-jwt-secret"
#     STRIPE_WEBHOOK_SECRET = "ra-stripe-webhook-secret"
#   }
# }

# module "web" {
#   source = "../../modules/cloud-run-service"
#
#   project_id            = var.project_id
#   region                = var.region
#   name                  = "ra-web-prod"
#   image                 = "africa-south1-docker.pkg.dev/${var.project_id}/ra-images/web:latest"
#   service_account_email = google_service_account.api_runner.email
#   min_instances         = 2
#   max_instances         = 20
#   memory                = "1Gi"
#
#   env_vars = {
#     NEXT_PUBLIC_API_URL = module.api.url
#     NEXT_PUBLIC_USE_API = "true"
#   }
# }

# ---------------------------------------------------------------------------
# Cloud Armor WAF — prod only
# TODO(GCP): uncomment after HTTPS Load Balancer is set up
# ---------------------------------------------------------------------------
# resource "google_compute_security_policy" "waf" {
#   name    = "ra-waf-prod"
#   project = var.project_id
#
#   # OWASP ModSecurity Core Rule Set
#   rule {
#     action   = "deny(403)"
#     priority = 1000
#     match {
#       expr {
#         expression = "evaluatePreconfiguredExpr('xss-v33-stable')"
#       }
#     }
#     description = "OWASP XSS rule"
#   }
#
#   rule {
#     action   = "deny(403)"
#     priority = 1001
#     match {
#       expr {
#         expression = "evaluatePreconfiguredExpr('sqli-v33-stable')"
#       }
#     }
#     description = "OWASP SQLi rule"
#   }
#
#   # Default allow rule (must exist)
#   rule {
#     action   = "allow"
#     priority = 2147483647
#     match {
#       versioned_expr = "SRC_IPS_V1"
#       config {
#         src_ip_ranges = ["*"]
#       }
#     }
#     description = "Default allow"
#   }
# }

# ---------------------------------------------------------------------------
# Monitoring alerts — prod only, wired to PagerDuty
# TODO(OPS): uncomment after PagerDuty + notification channels are set up
# ---------------------------------------------------------------------------
# module "alert_error_rate" {
#   source = "../../modules/monitoring-alert"
#
#   project_id      = var.project_id
#   display_name    = "API Error Rate > 1%"
#   filter          = "resource.type=\"cloud_run_revision\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\""
#   threshold_value = 0.01
#   duration        = "60s"
#   comparison      = "COMPARISON_GT"
#
#   # TODO(OPS): replace with actual PagerDuty notification channel resource names
#   # notification_channels = [google_monitoring_notification_channel.pagerduty.name]
#
#   documentation_content = "## API Error Rate Alert\n\nError rate exceeded 1% over 60 seconds.\n\n**Runbook**: https://github.com/raisingatlantic-dev/raisingatlantic-mono/blob/main/docs/runbooks/api-errors.md"
# }

# ---------------------------------------------------------------------------
# GitHub — production branch protection
# TODO(OPS): uncomment after GitHub provider is configured
# ---------------------------------------------------------------------------
# resource "github_branch_protection" "main" {
#   repository_id = "raisingatlantic-mono"
#   pattern       = "main"
#
#   required_status_checks {
#     strict   = true
#     contexts = ["API Tests", "Web Build", "Lint", "Cypress E2E"]
#   }
#
#   required_pull_request_reviews {
#     dismiss_stale_reviews           = true
#     required_approving_review_count = 1
#   }
#
#   enforce_admins = true
# }

# ---------------------------------------------------------------------------
# Stripe — prod products and webhook
# TODO(OPS): uncomment after Stripe account is set up with live keys
# ---------------------------------------------------------------------------
# resource "stripe_webhook_endpoint" "prod" {
#   url = "${module.api.url}/v1/webhooks/stripe"
#
#   enabled_events = [
#     "customer.subscription.created",
#     "customer.subscription.updated",
#     "customer.subscription.deleted",
#     "invoice.payment_failed",
#     "invoice.payment_succeeded",
#   ]
#
#   description = "Raising Atlantic production Stripe webhook"
# }

# ---------------------------------------------------------------------------
# Sentry — prod projects
# TODO(OPS): uncomment after Sentry organization is created
# ---------------------------------------------------------------------------
# resource "sentry_project" "api_prod" {
#   organization = var.sentry_organization
#   name         = "ra-api-prod"
#   slug         = "ra-api-prod"
#   platform     = "node-nestjs"
# }
#
# resource "sentry_project" "web_prod" {
#   organization = var.sentry_organization
#   name         = "ra-web-prod"
#   slug         = "ra-web-prod"
#   platform     = "javascript-nextjs"
# }
#
# resource "sentry_project" "mobile_prod" {
#   organization = var.sentry_organization
#   name         = "ra-mobile-prod"
#   slug         = "ra-mobile-prod"
#   platform     = "javascript-react-native"
# }

# ---------------------------------------------------------------------------
# BetterStack — uptime monitors (prod, 60s interval)
# TODO(OPS): uncomment after BetterStack account is created
# ---------------------------------------------------------------------------
# resource "betterstack_monitor" "api_health_prod" {
#   url             = "${module.api.url}/health"
#   monitor_type    = "status"
#   check_frequency = 60
#   team_name       = "Raising Atlantic"
# }
#
# resource "betterstack_monitor" "web_prod" {
#   url             = "https://app.raisingatlantic.com"
#   monitor_type    = "status"
#   check_frequency = 60
#   team_name       = "Raising Atlantic"
# }
