output "tfstate_bucket_name" {
  description = "Name of the GCS bucket holding Terraform remote state. Update infra/envs/*/backend.tf with this value."
  value       = google_storage_bucket.tfstate.name
}

output "workload_identity_provider" {
  description = "Full resource name of the WIF provider. Set as TF_WORKLOAD_IDENTITY_PROVIDER in GitHub Secrets."
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "deployer_sa_dev" {
  description = "Email of the dev deployer SA. Set as TF_SERVICE_ACCOUNT_DEV in GitHub Secrets."
  value       = google_service_account.tf_deployer_dev.email
}

output "deployer_sa_staging" {
  description = "Email of the staging deployer SA. Set as TF_SERVICE_ACCOUNT_STAGING in GitHub Secrets."
  value       = google_service_account.tf_deployer_staging.email
}

output "deployer_sa_prod" {
  description = "Email of the prod deployer SA. Set as TF_SERVICE_ACCOUNT_PROD in GitHub Secrets."
  value       = google_service_account.tf_deployer_prod.email
}
