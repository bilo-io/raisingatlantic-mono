# Bootstrap (Run Once, Manually)

This module creates the prerequisite resources that Terraform itself needs to exist
before it can manage anything: the GCS remote-state bucket, the Workload Identity
Federation pool + provider for GitHub Actions, and the per-environment deployer
service accounts.

**Run this module exactly once from a local machine authenticated as a GCP Owner.
After bootstrap is complete, everything else is managed by CI.**

## Steps

1. Complete every item in [TODO_GCP.md](../../TODO_GCP.md) up to and including
   "Create bootstrap project (`ra-bootstrap`)".

2. Authenticate locally:
   ```sh
   gcloud auth application-default login
   gcloud config set project ra-bootstrap
   ```

3. Enable required APIs in the bootstrap project:
   ```sh
   gcloud services enable \
     iam.googleapis.com \
     iamcredentials.googleapis.com \
     cloudresourcemanager.googleapis.com \
     storage.googleapis.com \
     secretmanager.googleapis.com \
     --project=ra-bootstrap
   ```

4. Run bootstrap:
   ```sh
   cd infra/bootstrap
   terraform init
   terraform plan -var-file=bootstrap.tfvars
   terraform apply -var-file=bootstrap.tfvars
   ```

5. Copy the outputs to GitHub Secrets (one per environment):
   - `TF_WORKLOAD_IDENTITY_PROVIDER` → value of `workload_identity_provider`
   - `TF_SERVICE_ACCOUNT_DEV`        → value of `deployer_sa_dev`
   - `TF_SERVICE_ACCOUNT_STAGING`    → value of `deployer_sa_staging`
   - `TF_SERVICE_ACCOUNT_PROD`       → value of `deployer_sa_prod`
   - `TF_STATE_BUCKET`               → value of `tfstate_bucket_name`

6. Update `infra/envs/*/backend.tf` with the actual bucket name from step 5.

7. Commit and push. The CI pipelines will now work.

## After bootstrap

Once CI is wired up, do **not** run `terraform apply` from a laptop against any
environment. The `tf-deployer-prod` service account IAM binding is scoped to CI
only — local `apply` will be denied.
