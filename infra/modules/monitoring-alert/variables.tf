variable "project_id" {
  description = "GCP project ID for the alert policy."
  type        = string
}

variable "display_name" {
  description = "Human-readable name for the alert policy."
  type        = string
}

variable "filter" {
  description = "Cloud Monitoring MQL or legacy filter expression for the alert condition."
  type        = string
}

variable "threshold_value" {
  description = "Numeric threshold that triggers the alert."
  type        = number
}

variable "duration" {
  description = "How long the condition must hold before alerting (e.g. '60s')."
  type        = string
  default     = "60s"
}

variable "comparison" {
  description = "Comparison operator: COMPARISON_GT, COMPARISON_LT, etc."
  type        = string
  default     = "COMPARISON_GT"
}

variable "notification_channels" {
  description = "List of notification channel resource names (Slack, email, PagerDuty)."
  type        = list(string)
  default     = []
}

variable "documentation_content" {
  description = "Markdown documentation shown in the alert notification (runbook link, description)."
  type        = string
  default     = ""
}

variable "labels" {
  description = "User labels to attach to the alert policy."
  type        = map(string)
  default     = {}
}
