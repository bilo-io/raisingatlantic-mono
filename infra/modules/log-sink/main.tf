# ---------------------------------------------------------------------------
# Long-term log retention: Cloud Logging → GCS sink with tiered lifecycle.
#
# Retention policy (from DEV.md §7.1):
#   - 30 days hot (STANDARD storage class) — fast investigation
#   - up to 1 year cold (COLDLINE) — POPIA evidence on demand
#   - delete at 395 days (30 hot + 365 cold)
#
# The Cloud Logging _Default sink already keeps 30 days hot in the bucket;
# this sink is the long-tail archive that survives the _Default bucket.
# ---------------------------------------------------------------------------

resource "google_storage_bucket" "archive" {
  project       = var.project_id
  name          = var.bucket_name
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  lifecycle_rule {
    condition {
      age = 395
    }
    action {
      type = "Delete"
    }
  }

  dynamic "encryption" {
    for_each = var.kms_key_name != "" ? [var.kms_key_name] : []
    content {
      default_kms_key_name = encryption.value
    }
  }

  labels = var.labels
}

resource "google_logging_project_sink" "this" {
  name        = var.sink_name
  project     = var.project_id
  destination = "storage.googleapis.com/${google_storage_bucket.archive.name}"
  filter      = var.filter

  unique_writer_identity = true
}

# Grant the sink's writer identity permission to write to the bucket.
resource "google_storage_bucket_iam_member" "sink_writer" {
  bucket = google_storage_bucket.archive.name
  role   = "roles/storage.objectCreator"
  member = google_logging_project_sink.this.writer_identity
}
