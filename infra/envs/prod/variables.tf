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
