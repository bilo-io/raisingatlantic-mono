output "secret_id" {
  description = "The Secret Manager secret ID."
  value       = google_secret_manager_secret.this.secret_id
}

output "secret_name" {
  description = "Full resource name of the secret (projects/PROJECT/secrets/SECRET_ID)."
  value       = google_secret_manager_secret.this.name
}
