output "environment" {
  description = "Name of this environment."
  value       = "prod"
}

# TODO(GCP): uncomment once prod resources are enabled
# output "api_url" {
#   value = module.api.url
# }
# output "web_url" {
#   value = module.web.url
# }
# output "db_connection_name" {
#   value = module.db.connection_name
# }
