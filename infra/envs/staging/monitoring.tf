# ---------------------------------------------------------------------------
# Phase 7 — Observability & Monitoring (staging)
# Production-like topology, relaxed thresholds. Drives rehearsal of alerts
# before they fire in prod. Each block gated by var.enable_*.
# ---------------------------------------------------------------------------

module "log_sink_app" {
  count  = var.enable_log_sink ? 1 : 0
  source = "../../modules/log-sink"

  project_id  = var.project_id
  region      = var.region
  bucket_name = "${var.project_id}-logs-archive"
  sink_name   = "ra-app-logs-archive-staging"

  filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=~\"^ra-(api|web)\""

  labels = {
    environment = "staging"
    managed_by  = "terraform"
    phase       = "7"
  }
}

resource "google_monitoring_notification_channel" "email_digest" {
  count = var.enable_alert_policies ? 1 : 0

  project      = var.project_id
  display_name = "Email digest (staging)"
  type         = "email"

  labels = {
    email_address = var.oncall_email
  }
}

resource "google_monitoring_uptime_check_config" "api_health" {
  count = var.enable_uptime_checks ? 1 : 0

  project      = var.project_id
  display_name = "ra-api staging /v1/health"
  timeout      = "10s"
  period       = "60s"

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
  display_name    = "ra-api staging: 5xx error rate > 2%"
  filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"ra-api-staging\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\""
  threshold_value = 0.02
  duration        = "300s"
  comparison      = "COMPARISON_GT"

  notification_channels = [google_monitoring_notification_channel.email_digest[0].name]

  documentation_content = "## Staging API Errors\n\n5xx rate exceeded 2% over 5 minutes in staging."

  labels = {
    severity    = "warning"
    environment = "staging"
  }
}

resource "sentry_project" "api_staging" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-api-staging"
  slug         = "ra-api-staging"
  platform     = "node-nestjs"
}

resource "sentry_project" "web_staging" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-web-staging"
  slug         = "ra-web-staging"
  platform     = "javascript-nextjs"
}

resource "betterstack_monitor" "api_health_staging" {
  count = var.enable_betterstack ? 1 : 0

  url             = "${var.api_public_url}/v1/health"
  monitor_type    = "status"
  check_frequency = 60
  team_name       = "Raising Atlantic"
}

# ---- SLOs (DEV.md §7.4, ADR 0004) -----------------------------------------
# Slimmer mirror of prod: the same availability + latency contract on the
# staging API service, without the burn-rate alert policies. Gated by enable_slos.
resource "google_monitoring_custom_service" "ra_api" {
  count = var.enable_slos ? 1 : 0

  project      = var.project_id
  service_id   = "ra-api-staging"
  display_name = "ra-api (staging)"
}

resource "google_monitoring_slo" "api_availability" {
  count = var.enable_slos ? 1 : 0

  project = var.project_id
  service = google_monitoring_custom_service.ra_api[0].service_id

  slo_id              = "ra-api-availability"
  display_name        = "99.5% availability — 30d rolling"
  goal                = 0.995
  rolling_period_days = 30

  request_based_sli {
    good_total_ratio {
      total_service_filter = "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"ra-api-staging\""
      bad_service_filter   = "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"ra-api-staging\" metric.label.\"response_code_class\"=\"5xx\""
    }
  }
}

resource "google_monitoring_slo" "api_latency" {
  count = var.enable_slos ? 1 : 0

  project = var.project_id
  service = google_monitoring_custom_service.ra_api[0].service_id

  slo_id              = "ra-api-latency"
  display_name        = "95% of requests < 500ms — 30d rolling"
  goal                = 0.95
  rolling_period_days = 30

  request_based_sli {
    distribution_cut {
      distribution_filter = "metric.type=\"run.googleapis.com/request_latencies\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"ra-api-staging\""
      range {
        max = 500
      }
    }
  }
}
