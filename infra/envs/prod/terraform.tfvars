# Production environment variable values.
# Sensitive values are injected via TF_VAR_* environment variables in CI (GitHub Secrets).
# The prod apply workflow requires manual approval in GitHub Environments before running.

# TODO(GCP): replace with the actual prod project ID
project_id = "ra-prod"

region = "africa-south1"

sentry_organization = "raising-atlantic"
