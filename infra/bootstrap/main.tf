terraform {
  required_version = ">= 1.9"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.14.1"
    }
  }

  # Bootstrap state is stored locally on first run, then imported into the bucket it creates.
  # Do NOT configure a remote backend here — this is the chicken-and-egg module.
}

provider "google" {
  project = var.bootstrap_project_id
  region  = var.region
}

# ---------------------------------------------------------------------------
# GCS remote-state bucket
# ---------------------------------------------------------------------------
resource "google_storage_bucket" "tfstate" {
  name          = var.tfstate_bucket_name
  location      = var.region
  force_destroy = false

  versioning {
    enabled = true
  }

  # Soft-delete policy: retain deleted objects for 7 days before permanent removal.
  soft_delete_policy {
    retention_duration_seconds = 604800
  }

  uniform_bucket_level_access = true

  # TODO(GCP): uncomment after creating a CMEK key ring in Cloud KMS
  # encryption {
  #   default_kms_key_name = "projects/${var.bootstrap_project_id}/locations/${var.region}/keyRings/ra-tfstate/cryptoKeys/tfstate-key"
  # }

  lifecycle {
    prevent_destroy = true
  }
}

# Prevent public access to state bucket (belt-and-suspenders over uniform access).
resource "google_storage_bucket_iam_binding" "tfstate_no_public" {
  bucket = google_storage_bucket.tfstate.name
  role   = "roles/storage.admin"

  members = [
    "serviceAccount:${google_service_account.tf_deployer_dev.email}",
    "serviceAccount:${google_service_account.tf_deployer_staging.email}",
    "serviceAccount:${google_service_account.tf_deployer_prod.email}",
  ]
}

# ---------------------------------------------------------------------------
# Workload Identity Federation pool (GitHub Actions → GCP, no JSON keys)
# ---------------------------------------------------------------------------
resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github-actions"
  display_name              = "GitHub Actions"
  description               = "Pool for GitHub Actions OIDC tokens (no long-lived keys)"
  project                   = var.bootstrap_project_id
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub OIDC"
  project                            = var.bootstrap_project_id

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  # Only tokens issued by GitHub Actions for this specific repo are accepted.
  attribute_condition = "assertion.repository == \"${var.github_repo}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# ---------------------------------------------------------------------------
# Deployer service accounts (one per environment)
# ---------------------------------------------------------------------------
resource "google_service_account" "tf_deployer_dev" {
  account_id   = "tf-deployer-dev"
  display_name = "Terraform Deployer — dev"
  project      = var.bootstrap_project_id
  description  = "Used by GitHub Actions to apply Terraform in the dev environment."
}

resource "google_service_account" "tf_deployer_staging" {
  account_id   = "tf-deployer-staging"
  display_name = "Terraform Deployer — staging"
  project      = var.bootstrap_project_id
  description  = "Used by GitHub Actions to apply Terraform in the staging environment."
}

resource "google_service_account" "tf_deployer_prod" {
  account_id   = "tf-deployer-prod"
  display_name = "Terraform Deployer — prod"
  project      = var.bootstrap_project_id
  description  = "Used by GitHub Actions to apply Terraform in the prod environment. Restricted to main + release/* branches."
}

# ---------------------------------------------------------------------------
# WIF bindings — restrict which branches can assume each SA
# ---------------------------------------------------------------------------

# Dev deployer: only the dev branch
resource "google_service_account_iam_binding" "wif_dev" {
  service_account_id = google_service_account.tf_deployer_dev.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}/attribute.ref/refs/heads/dev",
  ]
}

# Staging deployer: only the dev branch (staging is deployed from dev pipeline)
resource "google_service_account_iam_binding" "wif_staging" {
  service_account_id = google_service_account.tf_deployer_staging.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}/attribute.ref/refs/heads/dev",
  ]
}

# Prod deployer: main branch + release/* pattern
resource "google_service_account_iam_binding" "wif_prod_main" {
  service_account_id = google_service_account.tf_deployer_prod.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}/attribute.ref/refs/heads/main",
    # TODO(GCP): add release branch bindings once release flow is in use
    # "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}/attribute.ref/refs/heads/release/*",
  ]
}

# ---------------------------------------------------------------------------
# TODO(GCP): Grant each tf-deployer SA the roles it needs on the env projects.
# These IAM bindings must be added after the ra-dev, ra-staging, ra-prod
# projects are created. Uncomment and fill in the project IDs.
# ---------------------------------------------------------------------------
#
# resource "google_project_iam_member" "deployer_dev_editor" {
#   project = "ra-dev"      # TODO(GCP): replace with actual dev project ID
#   role    = "roles/editor"
#   member  = "serviceAccount:${google_service_account.tf_deployer_dev.email}"
# }
#
# resource "google_project_iam_member" "deployer_staging_editor" {
#   project = "ra-staging"  # TODO(GCP): replace with actual staging project ID
#   role    = "roles/editor"
#   member  = "serviceAccount:${google_service_account.tf_deployer_staging.email}"
# }
#
# resource "google_project_iam_member" "deployer_prod_editor" {
#   project = "ra-prod"     # TODO(GCP): replace with actual prod project ID
#   role    = "roles/editor"
#   member  = "serviceAccount:${google_service_account.tf_deployer_prod.email}"
# }

# ---------------------------------------------------------------------------
# App-deployer service accounts (one per environment)
# These are used by the app CI/CD pipeline (cd-app.yml), NOT by Terraform.
# Narrower permissions than tf-deployer: only roles/run.developer +
# roles/artifactregistry.writer — no org-wide infra rights.
# ---------------------------------------------------------------------------

resource "google_service_account" "app_deployer_dev" {
  account_id   = "app-deployer-dev"
  display_name = "App Deployer — dev"
  project      = var.bootstrap_project_id
  description  = "Used by cd-app.yml to deploy container images to Cloud Run in ra-dev. Limited to run.developer + artifactregistry.writer."
}

resource "google_service_account" "app_deployer_staging" {
  account_id   = "app-deployer-staging"
  display_name = "App Deployer — staging"
  project      = var.bootstrap_project_id
  description  = "Used by cd-app.yml to deploy container images to Cloud Run in ra-staging."
}

resource "google_service_account" "app_deployer_prod" {
  account_id   = "app-deployer-prod"
  display_name = "App Deployer — prod"
  project      = var.bootstrap_project_id
  description  = "Used by cd-app.yml to deploy container images to Cloud Run in ra-prod. Restricted to main branch only."
}

# WIF bindings for app-deployer SAs
# app-deployer-dev: dev branch only
resource "google_service_account_iam_binding" "wif_app_dev" {
  service_account_id = google_service_account.app_deployer_dev.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}/attribute.ref/refs/heads/dev",
  ]
}

# app-deployer-staging: test branch only
resource "google_service_account_iam_binding" "wif_app_staging" {
  service_account_id = google_service_account.app_deployer_staging.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}/attribute.ref/refs/heads/test",
  ]
}

# app-deployer-prod: main branch only
resource "google_service_account_iam_binding" "wif_app_prod" {
  service_account_id = google_service_account.app_deployer_prod.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}/attribute.ref/refs/heads/main",
  ]
}

# ---------------------------------------------------------------------------
# TODO(GCP): Grant app-deployer SAs scoped roles on each env project.
# Add after ra-dev, ra-staging, ra-prod projects are created (Phase 1.2).
# roles/run.developer: deploy new revisions and update traffic
# roles/artifactregistry.writer: push container images
# roles/iam.serviceAccountUser: required by gcloud run deploy to act as the
#   Cloud Run service account
# ---------------------------------------------------------------------------
#
# resource "google_project_iam_member" "app_deployer_dev_run" {
#   project = "ra-dev"
#   role    = "roles/run.developer"
#   member  = "serviceAccount:${google_service_account.app_deployer_dev.email}"
# }
# resource "google_project_iam_member" "app_deployer_dev_ar" {
#   project = "ra-dev"
#   role    = "roles/artifactregistry.writer"
#   member  = "serviceAccount:${google_service_account.app_deployer_dev.email}"
# }
# resource "google_project_iam_member" "app_deployer_dev_sa_user" {
#   project = "ra-dev"
#   role    = "roles/iam.serviceAccountUser"
#   member  = "serviceAccount:${google_service_account.app_deployer_dev.email}"
# }
#
# resource "google_project_iam_member" "app_deployer_staging_run" {
#   project = "ra-staging"
#   role    = "roles/run.developer"
#   member  = "serviceAccount:${google_service_account.app_deployer_staging.email}"
# }
# resource "google_project_iam_member" "app_deployer_staging_ar" {
#   project = "ra-staging"
#   role    = "roles/artifactregistry.writer"
#   member  = "serviceAccount:${google_service_account.app_deployer_staging.email}"
# }
# resource "google_project_iam_member" "app_deployer_staging_sa_user" {
#   project = "ra-staging"
#   role    = "roles/iam.serviceAccountUser"
#   member  = "serviceAccount:${google_service_account.app_deployer_staging.email}"
# }
#
# resource "google_project_iam_member" "app_deployer_prod_run" {
#   project = "ra-prod"
#   role    = "roles/run.developer"
#   member  = "serviceAccount:${google_service_account.app_deployer_prod.email}"
# }
# resource "google_project_iam_member" "app_deployer_prod_ar" {
#   project = "ra-prod"
#   role    = "roles/artifactregistry.writer"
#   member  = "serviceAccount:${google_service_account.app_deployer_prod.email}"
# }
# resource "google_project_iam_member" "app_deployer_prod_sa_user" {
#   project = "ra-prod"
#   role    = "roles/iam.serviceAccountUser"
#   member  = "serviceAccount:${google_service_account.app_deployer_prod.email}"
# }
