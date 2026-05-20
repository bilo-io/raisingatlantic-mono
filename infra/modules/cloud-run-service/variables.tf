variable "project_id" {
  description = "GCP project ID where the Cloud Run service will be deployed."
  type        = string
}

variable "region" {
  description = "GCP region. Must be africa-south1 for POPIA compliance."
  type        = string
  default     = "africa-south1"
}

variable "name" {
  description = "Name of the Cloud Run service (e.g. ra-api-prod)."
  type        = string
}

variable "image" {
  description = "Initial container image URI. The app CI pipeline owns this value after first deploy; set a placeholder here."
  type        = string
  # TODO(GCP): replace with actual Artifact Registry URI once the registry is provisioned
  # Format: REGION-docker.pkg.dev/PROJECT/REPO/IMAGE:TAG
  default = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "service_account_email" {
  description = "Service account email the Cloud Run service runs as."
  type        = string
}

variable "env_vars" {
  description = "Environment variables to inject into the container (non-secret values only)."
  type        = map(string)
  default     = {}
}

variable "secrets" {
  description = "Map of env-var name → Secret Manager secret ID for secret injection."
  type        = map(string)
  default     = {}
}

variable "min_instances" {
  description = "Minimum number of running instances (use 1+ to eliminate cold starts in prod)."
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum number of instances. Cap to control costs."
  type        = number
  default     = 10
}

variable "cpu" {
  description = "CPU allocation per instance (e.g. '1', '2')."
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory allocation per instance (e.g. '512Mi', '1Gi')."
  type        = string
  default     = "512Mi"
}

variable "vpc_connector" {
  description = "Full name of the VPC connector for private networking. Leave empty to skip."
  type        = string
  default     = ""
}

variable "allow_public_access" {
  description = "Whether to allow unauthenticated (public) access. True for public-facing services, false for internal workers."
  type        = bool
  default     = true
}
