variable "bootstrap_project_id" {
  description = "GCP project ID for the bootstrap project (e.g. ra-bootstrap). TODO(GCP): replace placeholder."
  type        = string
  # TODO(GCP): set this to the actual bootstrap project ID after creating it in the console
  default = "ra-bootstrap"
}

variable "region" {
  description = "GCP region for all resources. Must be africa-south1 for POPIA compliance."
  type        = string
  default     = "africa-south1"
}

variable "github_repo" {
  description = "GitHub repository in 'owner/repo' format used to scope WIF bindings."
  type        = string
  default     = "raisingatlantic-dev/raisingatlantic-mono"
}

variable "tfstate_bucket_name" {
  description = "Name of the GCS bucket to store Terraform state. Must be globally unique."
  type        = string
  # TODO(GCP): rename if this bucket name is already taken (GCS names are global)
  default = "ra-tfstate"
}

variable "billing_account" {
  description = "GCP billing account ID to associate with each environment project."
  type        = string
  # TODO(GCP): replace with your actual billing account ID (format: XXXXXX-XXXXXX-XXXXXX)
  default = "REPLACE_WITH_BILLING_ACCOUNT_ID"
}
