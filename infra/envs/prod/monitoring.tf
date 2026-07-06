# ---------------------------------------------------------------------------
# Phase 7 — Observability & Monitoring (production)
#
# This file gathers all Cloud Monitoring, Cloud Logging, Sentry, and
# BetterStack resources together so the observability footprint is reviewable
# in one place. Every block is gated by a `var.enable_*` flag (defaults to
# false) so it can be enabled incrementally as its dependency lands:
#
#   - log sink         → Phase 1.2 (live GCP project)
#   - uptime checks    → Phase 1.2 + public URLs
#   - alert policies   → uptime checks + notification channels
#   - Sentry projects  → live Sentry org
#   - BetterStack      → live BetterStack account
#   - dashboards       → live GCP project + custom metrics
#
# Flip the relevant flag in terraform.tfvars to apply.
# ---------------------------------------------------------------------------

# ---- 1. Long-term log retention -------------------------------------------

module "log_sink_app" {
  count  = var.enable_log_sink ? 1 : 0
  source = "../../modules/log-sink"

  project_id  = var.project_id
  region      = var.region
  bucket_name = "${var.project_id}-logs-archive"
  sink_name   = "ra-app-logs-archive-prod"

  # Capture API + web Cloud Run logs only. The _Default sink already covers
  # everything for 30 days; this archive is for the long tail.
  filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=~\"^ra-(api|web)\""

  labels = {
    environment = "prod"
    managed_by  = "terraform"
    phase       = "7"
  }
}

# ---- 2. Notification channels ---------------------------------------------

resource "google_monitoring_notification_channel" "slack_alerts_prod" {
  count = var.enable_alert_policies && var.slack_alerts_webhook_url != "" ? 1 : 0

  project      = var.project_id
  display_name = "Slack #alerts-prod"
  type         = "webhook_tokenauth"

  labels = {
    url = var.slack_alerts_webhook_url
  }

  user_labels = {
    severity = "critical"
    channel  = "alerts-prod"
  }

  lifecycle {
    ignore_changes = [labels]
  }
}

resource "google_monitoring_notification_channel" "email_digest" {
  count = var.enable_alert_policies ? 1 : 0

  project      = var.project_id
  display_name = "Email digest (low severity)"
  type         = "email"

  labels = {
    email_address = var.oncall_email
  }

  user_labels = {
    severity = "low"
  }
}

locals {
  critical_channels = compact([
    var.enable_alert_policies && var.slack_alerts_webhook_url != ""
      ? google_monitoring_notification_channel.slack_alerts_prod[0].name
      : "",
  ])

  low_severity_channels = compact([
    var.enable_alert_policies ? google_monitoring_notification_channel.email_digest[0].name : "",
  ])
}

# ---- 3. Uptime checks -----------------------------------------------------

resource "google_monitoring_uptime_check_config" "api_health" {
  count = var.enable_uptime_checks ? 1 : 0

  project      = var.project_id
  display_name = "ra-api prod /v1/health"
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

resource "google_monitoring_uptime_check_config" "web_root" {
  count = var.enable_uptime_checks ? 1 : 0

  project      = var.project_id
  display_name = "ra-web prod /"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path           = "/"
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
      host       = replace(replace(var.web_public_url, "https://", ""), "http://", "")
    }
  }
}

# ---- 4. Alert policies ----------------------------------------------------

module "alert_error_rate" {
  count  = var.enable_alert_policies ? 1 : 0
  source = "../../modules/monitoring-alert"

  project_id      = var.project_id
  display_name    = "API 5xx error rate > 1%"
  filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"ra-api-prod\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\""
  threshold_value = 0.01
  duration        = "300s"
  comparison      = "COMPARISON_GT"

  notification_channels = local.critical_channels

  documentation_content = "## API Error Rate Alert\n\n5xx rate exceeded 1% over 5 minutes.\n\n**Runbook**: https://github.com/raisingatlantic-dev/raisingatlantic-mono/blob/main/docs/runbooks/on-call.md#api-errors"

  labels = {
    severity = "critical"
    slo      = "availability"
  }
}

module "alert_p95_latency" {
  count  = var.enable_alert_policies ? 1 : 0
  source = "../../modules/monitoring-alert"

  project_id      = var.project_id
  display_name    = "API p95 latency > 500ms"
  filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"ra-api-prod\" AND metric.type=\"run.googleapis.com/request_latencies\""
  threshold_value = 500
  duration        = "600s"
  comparison      = "COMPARISON_GT"

  notification_channels = local.critical_channels

  documentation_content = "## API p95 Latency Alert\n\np95 request latency exceeded 500ms over 10 minutes.\n\n**Runbook**: https://github.com/raisingatlantic-dev/raisingatlantic-mono/blob/main/docs/runbooks/on-call.md#latency"

  labels = {
    severity = "critical"
    slo      = "latency"
  }
}

module "alert_db_connections" {
  count  = var.enable_alert_policies ? 1 : 0
  source = "../../modules/monitoring-alert"

  project_id      = var.project_id
  display_name    = "Cloud SQL connections > 80%"
  filter          = "resource.type=\"cloudsql_database\" AND metric.type=\"cloudsql.googleapis.com/database/postgresql/num_backends\""
  threshold_value = 80
  duration        = "300s"
  comparison      = "COMPARISON_GT"

  notification_channels = local.low_severity_channels

  documentation_content = "## DB Connection Pool Alert\n\nPostgres backend count exceeded 80% of the configured pool.\n\n**Runbook**: https://github.com/raisingatlantic-dev/raisingatlantic-mono/blob/main/docs/runbooks/on-call.md#db-pool"

  labels = {
    severity = "warning"
  }
}

module "alert_uptime_api" {
  count  = var.enable_alert_policies && var.enable_uptime_checks ? 1 : 0
  source = "../../modules/monitoring-alert"

  project_id      = var.project_id
  display_name    = "API uptime check failing"
  filter          = "resource.type=\"uptime_url\" AND metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.labels.check_id=\"${google_monitoring_uptime_check_config.api_health[0].uptime_check_id}\""
  threshold_value = 1
  duration        = "120s"
  comparison      = "COMPARISON_LT"

  notification_channels = local.critical_channels

  documentation_content = "## API Uptime Alert\n\n/v1/health probe failing from multi-region monitors.\n\n**Runbook**: https://github.com/raisingatlantic-dev/raisingatlantic-mono/blob/main/docs/runbooks/on-call.md#uptime"

  labels = {
    severity = "critical"
    slo      = "availability"
  }
}

# ---- 5. Dashboards --------------------------------------------------------

resource "google_monitoring_dashboard" "api_latency" {
  count   = var.enable_dashboards ? 1 : 0
  project = var.project_id

  dashboard_json = jsonencode({
    displayName = "ra-api · Latency (prod)"
    gridLayout = {
      columns = 2
      widgets = [
        {
          title = "Request latency (p50 / p95 / p99)"
          xyChart = {
            dataSets = [{
              timeSeriesQuery = {
                timeSeriesFilter = {
                  filter             = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"ra-api-prod\" AND metric.type=\"run.googleapis.com/request_latencies\""
                  aggregation = {
                    alignmentPeriod    = "60s"
                    perSeriesAligner   = "ALIGN_DELTA"
                    crossSeriesReducer = "REDUCE_PERCENTILE_95"
                  }
                }
              }
            }]
          }
        }
      ]
    }
  })
}

resource "google_monitoring_dashboard" "api_errors" {
  count   = var.enable_dashboards ? 1 : 0
  project = var.project_id

  dashboard_json = jsonencode({
    displayName = "ra-api · Errors (prod)"
    gridLayout = {
      columns = 2
      widgets = [
        {
          title = "5xx rate"
          xyChart = {
            dataSets = [{
              timeSeriesQuery = {
                timeSeriesFilter = {
                  filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"ra-api-prod\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\""
                  aggregation = {
                    alignmentPeriod  = "60s"
                    perSeriesAligner = "ALIGN_RATE"
                  }
                }
              }
            }]
          }
        }
      ]
    }
  })
}

resource "google_monitoring_dashboard" "business_metrics" {
  count   = var.enable_dashboards ? 1 : 0
  project = var.project_id

  dashboard_json = jsonencode({
    displayName = "ra · Business metrics (prod)"
    gridLayout = {
      columns = 2
      widgets = [
        {
          title = "Signups / day"
          xyChart = {
            dataSets = [{
              timeSeriesQuery = {
                timeSeriesFilter = {
                  filter = "metric.type=\"custom.googleapis.com/opentelemetry/ra_signups_total\""
                  aggregation = {
                    alignmentPeriod  = "86400s"
                    perSeriesAligner = "ALIGN_RATE"
                  }
                }
              }
            }]
          }
        },
        {
          title = "Verifications pending"
          xyChart = {
            dataSets = [{
              timeSeriesQuery = {
                timeSeriesFilter = {
                  filter = "metric.type=\"custom.googleapis.com/opentelemetry/ra_verifications_pending\""
                  aggregation = {
                    alignmentPeriod  = "300s"
                    perSeriesAligner = "ALIGN_MEAN"
                  }
                }
              }
            }]
          }
        },
        {
          title = "Vaccinations due"
          xyChart = {
            dataSets = [{
              timeSeriesQuery = {
                timeSeriesFilter = {
                  filter = "metric.type=\"custom.googleapis.com/opentelemetry/ra_vaccinations_due\""
                  aggregation = {
                    alignmentPeriod  = "300s"
                    perSeriesAligner = "ALIGN_MEAN"
                  }
                }
              }
            }]
          }
        }
      ]
    }
  })
}

# ---- 6. Sentry projects ---------------------------------------------------

resource "sentry_project" "api_prod" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-api-prod"
  slug         = "ra-api-prod"
  platform     = "node-nestjs"
}

resource "sentry_project" "web_prod" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-web-prod"
  slug         = "ra-web-prod"
  platform     = "javascript-nextjs"
}

resource "sentry_project" "mobile_prod" {
  count = var.enable_sentry_projects ? 1 : 0

  organization = var.sentry_organization
  name         = "ra-mobile-prod"
  slug         = "ra-mobile-prod"
  platform     = "react-native"
}

# ---- 7. BetterStack uptime monitors + status page -------------------------

resource "betterstack_monitor" "api_health_prod" {
  count = var.enable_betterstack ? 1 : 0

  url             = "${var.api_public_url}/v1/health"
  monitor_type    = "status"
  check_frequency = 60
  team_name       = "Raising Atlantic"
}

resource "betterstack_monitor" "web_root_prod" {
  count = var.enable_betterstack ? 1 : 0

  url             = var.web_public_url
  monitor_type    = "status"
  check_frequency = 60
  team_name       = "Raising Atlantic"
}

resource "betterstack_status_page" "public" {
  count = var.enable_betterstack ? 1 : 0

  company_name = "Raising Atlantic"
  company_url  = var.web_public_url
  subdomain    = replace(var.status_page_subdomain, ".raisingatlantic.com", "")
  timezone     = "Africa/Johannesburg"
}

# ---- 8. SLOs & error budgets (DEV.md §7.4, ADR 0004) ----------------------
# Encodes the availability + latency contract from docs/adr/0004-slos.md as
# Cloud Monitoring SLO objects, so error-budget burn is measurable rather than
# only threshold-alerted. Gated by enable_slos.

resource "google_monitoring_custom_service" "ra_api" {
  count = var.enable_slos ? 1 : 0

  project      = var.project_id
  service_id   = "ra-api-prod"
  display_name = "ra-api (prod)"
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
      total_service_filter = "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"ra-api-prod\""
      bad_service_filter   = "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"ra-api-prod\" metric.label.\"response_code_class\"=\"5xx\""
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
      distribution_filter = "metric.type=\"run.googleapis.com/request_latencies\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"ra-api-prod\""
      range {
        max = 500
      }
    }
  }
}

# Multi-window burn-rate alerts on the availability error budget (Google SRE
# workbook multipliers for a 30-day window).
resource "google_monitoring_alert_policy" "availability_fast_burn" {
  count = var.enable_slos && var.enable_alert_policies ? 1 : 0

  project      = var.project_id
  display_name = "Availability SLO — fast burn (1h, 14.4x)"
  combiner     = "OR"

  conditions {
    display_name = "Burn rate > 14.4x over 1h"
    condition_threshold {
      filter          = "select_slo_burn_rate(\"${google_monitoring_slo.api_availability[0].name}\", \"3600s\")"
      comparison      = "COMPARISON_GT"
      threshold_value = 14.4
      duration        = "0s"

      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = local.critical_channels

  documentation {
    content   = "## Availability budget — fast burn\n\nThe 30-day availability error budget is burning >14.4x over 1h: at this rate the monthly budget is exhausted in ~2 days.\n\n**Runbook**: https://github.com/raisingatlantic-dev/raisingatlantic-mono/blob/main/docs/runbooks/on-call.md#api-error-rate"
    mime_type = "text/markdown"
  }
}

resource "google_monitoring_alert_policy" "availability_slow_burn" {
  count = var.enable_slos && var.enable_alert_policies ? 1 : 0

  project      = var.project_id
  display_name = "Availability SLO — slow burn (6h, 6x)"
  combiner     = "OR"

  conditions {
    display_name = "Burn rate > 6x over 6h"
    condition_threshold {
      filter          = "select_slo_burn_rate(\"${google_monitoring_slo.api_availability[0].name}\", \"21600s\")"
      comparison      = "COMPARISON_GT"
      threshold_value = 6
      duration        = "0s"

      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = local.low_severity_channels

  documentation {
    content   = "## Availability budget — slow burn\n\nThe 30-day availability error budget is burning >6x over 6h. Shift toward reliability work per the ADR 0004 error-budget policy.\n\n**Runbook**: https://github.com/raisingatlantic-dev/raisingatlantic-mono/blob/main/docs/runbooks/on-call.md#api-error-rate"
    mime_type = "text/markdown"
  }
}

# ---- 9. Scheduled business-metric refresh (DEV.md §7.2) -------------------
# Periodically calls the guarded API endpoint that recomputes point-in-time
# gauges (ra_vaccinations_due) so the business dashboard reflects the whole
# cohort, not just request-path samples. Gated by enable_metrics_scheduler.
resource "google_cloud_scheduler_job" "metrics_refresh" {
  count = var.enable_metrics_scheduler ? 1 : 0

  project   = var.project_id
  region    = var.region
  name      = "ra-metrics-refresh-prod"
  schedule  = "*/15 * * * *"
  time_zone = "Africa/Johannesburg"

  http_target {
    http_method = "POST"
    uri         = "${var.api_public_url}/v1/metrics/refresh"

    oidc_token {
      service_account_email = var.metrics_scheduler_sa_email
      audience              = var.api_public_url
    }
  }
}

# ---- 10. On-call paging (DEV.md §7.4) -------------------------------------
# Drop-in PagerDuty escalation for when a 2nd on-call exists. Until then the
# single-rotation schedule mirrors the interim posture in the on-call runbook.
# Gated by enable_pagerduty (default off); provider configured in main.tf.
resource "pagerduty_schedule" "primary" {
  count = var.enable_pagerduty ? 1 : 0

  name      = "RA on-call (primary rotation)"
  time_zone = "Africa/Johannesburg"

  layer {
    name                         = "Solo on-call"
    start                        = "2026-01-01T00:00:00+02:00"
    rotation_virtual_start       = "2026-01-01T00:00:00+02:00"
    rotation_turn_length_seconds = 604800
    users                        = [var.pagerduty_oncall_user_id]
  }
}

resource "pagerduty_escalation_policy" "primary" {
  count = var.enable_pagerduty ? 1 : 0

  name      = "RA primary escalation"
  num_loops = 2

  rule {
    escalation_delay_in_minutes = 30
    target {
      type = "schedule_reference"
      id   = pagerduty_schedule.primary[0].id
    }
  }
}

resource "pagerduty_service" "ra_api_prod" {
  count = var.enable_pagerduty ? 1 : 0

  name              = "Raising Atlantic API (prod)"
  escalation_policy = pagerduty_escalation_policy.primary[0].id
  alert_creation    = "create_alerts_and_incidents"
}
