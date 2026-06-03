output "bucket_name" {
  description = "Name of the GCS archive bucket."
  value       = google_storage_bucket.archive.name
}

output "sink_writer_identity" {
  description = "Service account identity the sink writes from."
  value       = google_logging_project_sink.this.writer_identity
}

output "sink_name" {
  description = "Full resource name of the log sink."
  value       = google_logging_project_sink.this.id
}
