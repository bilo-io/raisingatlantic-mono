variable "project_id" {
  description = "GCP project ID hosting the log sink and archive bucket."
  type        = string
}

variable "region" {
  description = "GCS bucket location. Must be africa-south1 for POPIA compliance."
  type        = string
  default     = "africa-south1"
}

variable "bucket_name" {
  description = "Globally-unique name of the GCS archive bucket."
  type        = string
}

variable "sink_name" {
  description = "Name of the Cloud Logging sink."
  type        = string
}

variable "filter" {
  description = "Cloud Logging filter expression selecting which entries to route."
  type        = string
  default     = "resource.type=\"cloud_run_revision\""
}

variable "kms_key_name" {
  description = "Optional CMEK key resource name for bucket encryption."
  type        = string
  default     = ""
}

variable "labels" {
  description = "Labels applied to the archive bucket."
  type        = map(string)
  default     = {}
}
