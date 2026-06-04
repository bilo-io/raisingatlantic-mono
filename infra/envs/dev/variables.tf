variable "project_id" {
  description = "GCP project ID for the dev environment."
  type        = string
}

variable "region" {
  description = "GCP region. Must be africa-south1 for POPIA compliance."
  type        = string
  default     = "africa-south1"
}

variable "github_token" {
  description = "GitHub personal access token for the github provider. Store in Secret Manager, not in code."
  type        = string
  sensitive   = true
}

variable "stripe_api_key" {
  description = "Stripe test-mode secret key. Never use live keys in dev/staging."
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token scoped to DNS edit + Cache Purge on raisingatlantic.com."
  type        = string
  sensitive   = true
}

variable "vercel_api_token" {
  description = "Vercel API token for managing marketing preview deploys."
  type        = string
  sensitive   = true
}

variable "sentry_auth_token" {
  description = "Sentry auth token for creating projects and alert rules."
  type        = string
  sensitive   = true
}

variable "sentry_organization" {
  description = "Sentry organization slug."
  type        = string
  default     = "raising-atlantic"
}

variable "sendgrid_api_key" {
  description = "SendGrid API key for managing sending domains."
  type        = string
  sensitive   = true
}

variable "betterstack_api_token" {
  description = "BetterStack API token for uptime monitors and status page."
  type        = string
  sensitive   = true
}

variable "pagerduty_token" {
  description = "PagerDuty API token."
  type        = string
  sensitive   = true
}

# ---------------------------------------------------------------------------
# Phase 7 — Observability & Monitoring (feature flags)
# Default to false; flip in terraform.tfvars once the upstream dependency lands.
# See infra/envs/prod/variables.tf for the full description of each flag.
# ---------------------------------------------------------------------------

variable "enable_log_sink" {
  type    = bool
  default = false
}

variable "enable_uptime_checks" {
  type    = bool
  default = false
}

variable "enable_alert_policies" {
  type    = bool
  default = false
}

variable "enable_sentry_projects" {
  type    = bool
  default = false
}

variable "enable_betterstack" {
  type    = bool
  default = false
}

variable "api_public_url" {
  type    = string
  default = "https://ra-api-dev.example.com"
}

variable "web_public_url" {
  type    = string
  default = "https://ra-web-dev.example.com"
}

variable "oncall_email" {
  type    = string
  default = "alerts-dev@raisingatlantic.com"
}
