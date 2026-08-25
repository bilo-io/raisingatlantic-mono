variable "project_id" {
  description = "GCP project ID for the staging environment."
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

variable "stripe_api_key" {
  description = "Stripe test-mode secret key. Never use live keys in staging."
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

variable "enable_slos" {
  description = "Provision Cloud Monitoring SLO objects for the staging API service."
  type        = bool
  default     = false
}

variable "api_public_url" {
  type    = string
  default = "https://ra-api-staging.example.com"
}

variable "web_public_url" {
  type    = string
  default = "https://ra-web-staging.example.com"
}

variable "oncall_email" {
  type    = string
  default = "alerts-staging@raisingatlantic.com"
}
