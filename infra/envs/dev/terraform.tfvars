# Dev environment variable values.
# All TODO(GCP) values must be filled in before running terraform init / plan.
# Sensitive values (tokens, keys) must NEVER be committed — pass them via
# environment variables: TF_VAR_github_token, TF_VAR_stripe_api_key, etc.
# In CI they are injected from GitHub Secrets.

# TODO(GCP): replace with the actual dev project ID created in the GCP console
project_id = "ra-dev"

region = "africa-south1"

# Sentry org slug (non-sensitive, safe to commit)
sentry_organization = "raising-atlantic"

# All *_token and *_api_key variables are intentionally absent from this file.
# They are injected at CI time via TF_VAR_* environment variables from GitHub Secrets.
# For local runs, export them in your shell:
#   export TF_VAR_github_token=$(op read "op://Raising Atlantic/GitHub PAT/credential")
