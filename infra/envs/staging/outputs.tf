output "environment" {
  description = "Name of this environment."
  value       = "staging"
}

# TODO(GCP): uncomment once staging resources are enabled
# output "api_url" {
#   value = module.api.url
# }
# output "web_url" {
#   value = module.web.url
# }
