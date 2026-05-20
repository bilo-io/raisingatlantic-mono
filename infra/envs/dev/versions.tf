terraform {
  required_version = ">= 1.9"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.14.1"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "6.14.1"
    }
    github = {
      source  = "integrations/github"
      version = "6.4.0"
    }
    stripe = {
      source  = "stripe/stripe"
      version = "0.0.3"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.49.1"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "2.8.0"
    }
    # TODO(GCP): uncomment once the Neon → Cloud SQL migration decision is made.
    # neon = {
    #   source  = "kislerdm/neon"
    #   version = "0.6.3"
    # }
    sentry = {
      source  = "jianyuan/sentry"
      version = "0.14.1"
    }
    sendgrid = {
      source  = "Trois-Six/sendgrid"
      version = "1.0.1"
    }
    betterstack = {
      source  = "BetterStackHQ/better-uptime"
      version = "0.6.7"
    }
    pagerduty = {
      source  = "PagerDuty/pagerduty"
      version = "3.18.3"
    }
  }
}
