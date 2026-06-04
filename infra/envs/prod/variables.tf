variable "project_id" {
  description = "GCP project ID for the production environment."
  type        = string
}

variable "region" {
  description = "GCP region. Must be africa-south1 for POPIA compliance."
  type        = string
  default     = "africa-south1"
}

variable "github_token" {
  type      = string
  sensitive = true
}

variable "github_owner" {
  description = "GitHub username of the repository owner, used as required reviewer on the production environment."
  type        = string
  default     = "raisingatlantic-dev"
}

variable "stripe_api_key" {
  description = "Stripe LIVE-mode secret key. Only used in prod."
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "vercel_api_token" {
  type      = string
  sensitive = true
}

variable "sentry_auth_token" {
  type      = string
  sensitive = true
}

variable "sentry_organization" {
  type    = string
  default = "raising-atlantic"
}

variable "sendgrid_api_key" {
  type      = string
  sensitive = true
}

variable "betterstack_api_token" {
  type      = string
  sensitive = true
}

variable "pagerduty_token" {
  type      = string
  sensitive = true
}

# ---------------------------------------------------------------------------
# Phase 7 — Observability & Monitoring
#
# Each feature flag below gates a slice of monitoring infrastructure so the
# Terraform code is reviewable now and can be turned on per environment as
# its external dependency lands:
#
#   enable_log_sink        — requires Phase 1.2 (live GCP project + APIs)
#   enable_uptime_checks   — requires Phase 1.2 (live GCP project) AND public URLs
#   enable_alert_policies  — requires enable_uptime_checks + notification channels
#   enable_sentry_projects — requires live Sentry organization
#   enable_betterstack     — requires live BetterStack account
#   enable_dashboards      — requires live GCP project + custom metrics flowing
#
# Default: false. Flip in terraform.tfvars once the dependency is ready.
# ---------------------------------------------------------------------------

variable "enable_log_sink" {
  description = "Provision the long-term log retention sink + GCS archive bucket."
  type        = bool
  default     = false
}

variable "enable_uptime_checks" {
  description = "Provision Cloud Monitoring synthetic uptime checks."
  type        = bool
  default     = false
}

variable "enable_alert_policies" {
  description = "Provision Cloud Monitoring alert policies (requires notification channels)."
  type        = bool
  default     = false
}

variable "enable_sentry_projects" {
  description = "Provision Sentry projects via the jianyuan/sentry provider."
  type        = bool
  default     = false
}

variable "enable_betterstack" {
  description = "Provision BetterStack uptime monitors + status page."
  type        = bool
  default     = false
}

variable "enable_dashboards" {
  description = "Provision Cloud Monitoring dashboards."
  type        = bool
  default     = false
}

variable "api_public_url" {
  description = "Public URL of the API service (e.g. https://api.raisingatlantic.com). Used by uptime checks."
  type        = string
  default     = "https://api.raisingatlantic.com"
}

variable "web_public_url" {
  description = "Public URL of the web app (e.g. https://raisingatlantic.com)."
  type        = string
  default     = "https://raisingatlantic.com"
}

variable "status_page_subdomain" {
  description = "Subdomain for the public status page."
  type        = string
  default     = "status.raisingatlantic.com"
}

variable "oncall_email" {
  description = "Email address that receives low-severity alert digests."
  type        = string
  default     = "alerts@raisingatlantic.com"
}

variable "slack_alerts_webhook_url" {
  description = "Slack incoming-webhook URL for #alerts-prod. Empty disables the Slack channel."
  type        = string
  sensitive   = true
  default     = ""
}
