# TODO(GCP): uncomment these outputs once the corresponding resources are enabled in main.tf

# output "api_url" {
#   description = "Cloud Run API URL for the dev environment."
#   value       = module.api.url
# }

# output "web_url" {
#   description = "Cloud Run Web URL for the dev environment."
#   value       = module.web.url
# }

# output "db_connection_name" {
#   description = "Cloud SQL connection name for Cloud SQL Auth Proxy."
#   value       = module.db.connection_name
# }

output "environment" {
  description = "Name of this environment."
  value       = "dev"
}
