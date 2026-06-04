# ---------------------------------------------------------------------------
# Phase 7 — Observability & Monitoring (dev)
# Lower-cost mirror of prod: shorter retention, no Slack channel, no dashboards.
# Each block is gated by var.enable_* — flip in terraform.tfvars to apply.
# ---------------------------------------------------------------------------

module "log_sink_app" {
  count  = var.enable_log_sink ? 1 : 0
  source = "../../modules/log-sink"

  project_id  = var.project_id
  region      = var.region
  bucket_name = "${var.project_id}-logs-archive"
  sink_name   = "ra-app-logs-archive-dev"

  filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=~\"^ra-(api|web)\""

  labels = {
    environment = "dev"
    managed_by  = "terraform"
    phase       = "7"
  }
}

resource "google_monitoring_notification_channel" "email_digest" {
  count = var.enable_alert_policies ? 1 : 0

  project      = var.project_id
  display_name = "Email digest (dev)"
  type         = "email"

  labels = {
    email_address = var.oncall_email
  }
}

resource "google_monitoring_uptime_check_config" "api_health" {
  count = var.enable_uptime_checks ? 1 : 0

  project      = var.project_id
  display_name = "ra-api dev /v1/health"
  timeout      = "10s"
  period       = "300s" # relaxed in dev — 5 min

  http_check {
    path           = "/v1/health"
    port           = 443
    use_ssl        = true
    validate_ssl   = true
    accepted_response_status_codes {
      status_class = "STATUS_CLASS_2XX"
    }
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = replace(replace(var.api_public_url, "https://", ""), "http://", "")
    }
  }
}

module "alert_error_rate" {
  count  = var.enable_alert_policies ? 1 : 0
  source = "../../modules/monitoring-alert"

  project_id      = var.project_id
  display_name    = "ra-api dev: 5xx error rate > 5%"
  filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"ra-api-dev\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\""
  threshold_value = 0.05
  duration        = "300s"
  comparison      = "COMPARISON_GT"

  notification_channels = [google_monitoring_notification_channel.email_digest[0].name]

  documentation_content = "## Dev API Errors\n\n5xx rate exceeded 5% over 5 minutes in dev."

  labels = {
    severity    = "warning"
    environment = "dev"
  }
}

resource "sentry_project" "api_dev" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-api-dev"
  slug         = "ra-api-dev"
  platform     = "node-nestjs"
}

resource "sentry_project" "web_dev" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-web-dev"
  slug         = "ra-web-dev"
  platform     = "javascript-nextjs"
}

resource "sentry_project" "mobile_dev" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-mobile-dev"
  slug         = "ra-mobile-dev"
  platform     = "react-native"
}

resource "betterstack_monitor" "api_health_dev" {
  count = var.enable_betterstack ? 1 : 0

  url             = "${var.api_public_url}/v1/health"
  monitor_type    = "status"
  check_frequency = 180 # 3 minutes in dev
  team_name       = "Raising Atlantic"
}
