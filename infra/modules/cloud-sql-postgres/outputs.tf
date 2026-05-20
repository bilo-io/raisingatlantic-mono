output "instance_name" {
  description = "Cloud SQL instance name (used by Cloud SQL Auth Proxy connection string)."
  value       = google_sql_database_instance.this.name
}

output "connection_name" {
  description = "Cloud SQL connection name (PROJECT:REGION:INSTANCE) for use with Cloud SQL Auth Proxy."
  value       = google_sql_database_instance.this.connection_name
}

output "private_ip" {
  description = "Private IP address of the Cloud SQL instance."
  value       = google_sql_database_instance.this.private_ip_address
}

output "database_name" {
  description = "Name of the application database."
  value       = google_sql_database.app.name
}

output "database_user" {
  description = "Name of the application database user."
  value       = google_sql_user.app.name
}
