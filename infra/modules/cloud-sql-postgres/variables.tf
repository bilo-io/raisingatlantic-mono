variable "project_id" {
  description = "GCP project ID for the Cloud SQL instance."
  type        = string
}

variable "region" {
  description = "GCP region. Must be africa-south1 for POPIA compliance."
  type        = string
  default     = "africa-south1"
}

variable "instance_name" {
  description = "Cloud SQL instance name (e.g. ra-postgres-prod)."
  type        = string
}

variable "database_version" {
  description = "Postgres version. Locked to 15 for now."
  type        = string
  default     = "POSTGRES_15"
}

variable "tier" {
  description = "Machine type (e.g. db-f1-micro for dev, db-n1-standard-2 for prod)."
  type        = string
  default     = "db-f1-micro"
}

variable "availability_type" {
  description = "REGIONAL for HA (prod/staging) or ZONAL for dev."
  type        = string
  default     = "ZONAL"
}

variable "database_name" {
  description = "Name of the application database to create."
  type        = string
  default     = "raisingatlantic"
}

variable "database_user" {
  description = "Name of the application database user."
  type        = string
  default     = "ra_app"
}

variable "private_network" {
  description = "Self-link of the VPC network for private IP access."
  type        = string
  # TODO(GCP): set to the VPC network self-link once VPC is provisioned
  default = ""
}

variable "backup_start_time" {
  description = "Time (HH:MM) to start automated backups."
  type        = string
  default     = "02:00"
}

variable "pitr_enabled" {
  description = "Enable Point-In-Time Recovery. Required for RPO < 15min target."
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Prevent accidental deletion. Set to true for prod before go-live."
  type        = bool
  default     = false
}
