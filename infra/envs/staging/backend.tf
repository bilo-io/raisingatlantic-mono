# Remote state stored in GCS. The bucket is created by infra/bootstrap/.
# TODO(GCP): replace the bucket name with the actual value from:
#   terraform output -raw tfstate_bucket_name   (run from infra/bootstrap/)
terraform {
  backend "gcs" {
    bucket = "ra-tfstate"  # TODO(GCP): replace with actual bucket name after bootstrap
    prefix = "envs/staging"
  }
}
