output "pool_name" {
  description = "Full resource name of the workload identity pool."
  value       = google_iam_workload_identity_pool.this.name
}

output "provider_name" {
  description = "Full resource name of the WIF provider. Use as workload_identity_provider in google-github-actions/auth."
  value       = google_iam_workload_identity_pool_provider.this.name
}
