variable "project_id" {
  description = "GCP project ID where the secret will be created."
  type        = string
}

variable "secret_id" {
  description = "Secret Manager secret ID (e.g. ra-db-password)."
  type        = string
}

variable "region" {
  description = "Region for automatic replication. Must be africa-south1 for POPIA compliance."
  type        = string
  default     = "africa-south1"
}

variable "accessor_service_accounts" {
  description = "List of service account emails that can read this secret version."
  type        = list(string)
  default     = []
}

variable "labels" {
  description = "Labels to attach to the secret resource."
  type        = map(string)
  default     = {}
}
