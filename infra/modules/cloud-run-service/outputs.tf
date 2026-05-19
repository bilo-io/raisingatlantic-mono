output "url" {
  description = "The HTTPS URL of the deployed Cloud Run service."
  value       = google_cloud_run_v2_service.this.uri
}

output "name" {
  description = "The Cloud Run service name."
  value       = google_cloud_run_v2_service.this.name
}

output "id" {
  description = "The Cloud Run service resource ID."
  value       = google_cloud_run_v2_service.this.id
}
