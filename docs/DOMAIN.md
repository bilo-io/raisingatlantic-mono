# Raising Atlantic Domain Documentation

This document outlines the core API architecture of the Raising Atlantic Monorepo, the endpoints available within the NestJS microservice under the `/v1` prefix, and a real-time status indication based on database health queries.

## Core API Endpoints

| Endpoint | Method | Domain Object | Description | Status | Current DB Entries |
|----------|--------|---------------|-------------|--------|------------------|
| `/v1/users` | GET | `User` | Fetch all user profiles including clinicians, parents, and admins. | Active | 3 |
| `/v1/tenants` | GET | `Tenant` | Retrieve healthcare tenant groups managing multiple practices. | Active | 1 |
| `/v1/practices` | GET | `Practice` | Physical or logical clinical boundaries. Mapped optionally to many ClinicianProfiles. | Active | 4 |
| `/v1/children` | GET | `Child` | Pediatric patient records containing metadata like birthdates, gender, and clinical associations. | Active | 6 |
| `/v1/records/vaccinations` | GET | `Vaccination` | The global source of truth for vaccination schedules to be distributed locally. | Active | 24 |
| `/v1/records/milestones` | GET | `Milestone` | Developmental milestones separated by age groups for parent dashboards. | Active | 40 |
| `/v1/verifications/clinicians` | GET | `User` | A specific queue for administrators to review Clinician licensing constraints and activations. | Active | Varied |
| `/v1/verifications/records` | GET | `Mixed` | Pending validations targeting inputted milestones/growths needing physician approval. | Active | Varied |

## Important Data Constraints & Relations
- `Child` resolves its clinician loop through the `User` table, navigating into to `ClinicianProfile` recursively. 
- A `ClinicianProfile` has a Many-to-Many reciprocal relationship connected to physical `Practice` sites.
- The `Dashboard` client caches calls, resolving internal identifiers prior to assembling dynamic lists or fallback mock entries internally if the database is offline.

---
*Auto-Generated via Antigravity Toolkit.*
