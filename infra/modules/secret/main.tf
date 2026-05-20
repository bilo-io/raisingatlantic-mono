resource "google_secret_manager_secret" "this" {
  secret_id = var.secret_id
  project   = var.project_id

  labels = var.labels

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }

  # Secret *values* are written separately via:
  #   gcloud secrets versions add SECRET_ID --data-file=- <<< "my-secret-value"
  # Terraform deliberately does not know the value — only that the resource exists.
  lifecycle {
    ignore_changes = [
      # Prevent Terraform from fighting manual value rotations.
      # The resource shell is managed here; the version/value is not.
    ]
  }
}

resource "google_secret_manager_secret_iam_binding" "accessor" {
  count     = length(var.accessor_service_accounts) > 0 ? 1 : 0
  project   = var.project_id
  secret_id = google_secret_manager_secret.this.secret_id
  role      = "roles/secretmanager.secretAccessor"

  members = [
    for sa in var.accessor_service_accounts : "serviceAccount:${sa}"
  ]
}
