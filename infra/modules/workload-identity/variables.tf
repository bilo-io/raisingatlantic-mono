variable "project_id" {
  description = "GCP project ID where the workload identity pool lives."
  type        = string
}

variable "pool_id" {
  description = "Workload identity pool ID (e.g. github-actions)."
  type        = string
}

variable "provider_id" {
  description = "Workload identity provider ID (e.g. github-provider)."
  type        = string
}

variable "github_repo" {
  description = "GitHub repo in 'owner/repo' format used to scope the attribute condition."
  type        = string
}

variable "service_account_email" {
  description = "Email of the service account the GitHub Actions job will impersonate."
  type        = string
}

variable "allowed_branches" {
  description = "List of branch refs that are allowed to assume the SA (e.g. ['refs/heads/main', 'refs/heads/release/*'])."
  type        = list(string)
}
