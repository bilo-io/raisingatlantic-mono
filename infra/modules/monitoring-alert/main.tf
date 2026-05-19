resource "google_monitoring_alert_policy" "this" {
  project      = var.project_id
  display_name = var.display_name
  combiner     = "OR"
  user_labels  = var.labels

  conditions {
    display_name = var.display_name

    condition_threshold {
      filter          = var.filter
      comparison      = var.comparison
      threshold_value = var.threshold_value
      duration        = var.duration

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_MEAN"
      }
    }
  }

  notification_channels = var.notification_channels

  dynamic "documentation" {
    for_each = var.documentation_content != "" ? [var.documentation_content] : []
    content {
      content   = documentation.value
      mime_type = "text/markdown"
    }
  }

  alert_strategy {
    auto_close = "1800s" # Auto-close incidents after 30 minutes of no data
  }
}
