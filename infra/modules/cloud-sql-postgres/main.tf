resource "google_sql_database_instance" "this" {
  name             = var.instance_name
  database_version = var.database_version
  region           = var.region
  project          = var.project_id

  # TODO(GCP): set deletion_protection = true for prod before go-live
  deletion_protection = var.deletion_protection

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_autoresize   = true
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = true
      start_time                     = var.backup_start_time
      point_in_time_recovery_enabled = var.pitr_enabled
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    ip_configuration {
      # Private IP only — no public IP ever touches the database.
      ipv4_enabled    = false
      private_network = var.private_network
      ssl_mode        = "ENCRYPTED_ONLY"
    }

    database_flags {
      name  = "log_min_duration_statement"
      value = "100" # Log queries taking > 100ms for slow-query review
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }

    insights_config {
      query_insights_enabled  = true
      query_plans_per_minute  = 5
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = false # PII: do not log client IPs
    }
  }
}

resource "google_sql_database" "app" {
  name     = var.database_name
  instance = google_sql_database_instance.this.name
  project  = var.project_id
}

resource "google_sql_user" "app" {
  name     = var.database_user
  instance = google_sql_database_instance.this.name
  project  = var.project_id
  # Password is managed via Secret Manager; this resource creates the user shell.
  # Run: gcloud sql users set-password ra_app --instance=INSTANCE --password=$(gcloud secrets versions access latest --secret=ra-db-password)
  password = "MANAGED_BY_SECRET_MANAGER_DO_NOT_SET_HERE"

  lifecycle {
    ignore_changes = [password]
  }
}
