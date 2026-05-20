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

output "app_deployer_sa_dev" {
  description = "Email of the app-deployer SA for dev. Set as APP_SERVICE_ACCOUNT_DEV in GitHub Secrets."
  value       = google_service_account.app_deployer_dev.email
}

output "app_deployer_sa_staging" {
  description = "Email of the app-deployer SA for staging. Set as APP_SERVICE_ACCOUNT_STAGING in GitHub Secrets."
  value       = google_service_account.app_deployer_staging.email
}

output "app_deployer_sa_prod" {
  description = "Email of the app-deployer SA for prod. Set as APP_SERVICE_ACCOUNT_PROD in GitHub Secrets."
  value       = google_service_account.app_deployer_prod.email
}

# APP_WORKLOAD_IDENTITY_PROVIDER uses the same WIF provider as TF_WORKLOAD_IDENTITY_PROVIDER.
# Both cd-app.yml and the terraform workflows share the same pool; branch restrictions
# are enforced by the SA-level WIF bindings above.

