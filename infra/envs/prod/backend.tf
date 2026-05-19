# Remote state stored in GCS. The bucket is created by infra/bootstrap/.
# PROD state must be kept completely separate from dev/staging state.
# TODO(GCP): replace the bucket name with the actual value from:
#   terraform output -raw tfstate_bucket_name   (run from infra/bootstrap/)
terraform {
  backend "gcs" {
    bucket = "ra-tfstate"  # TODO(GCP): replace with actual bucket name after bootstrap
    prefix = "envs/prod"
  }
}
