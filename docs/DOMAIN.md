# Raising Atlantic Domain Documentation

This document outlines the core API architecture, the domain entities, and the comprehensive set of endpoints available in the NestJS backend.

## Core API Architecture
The Raising Atlantic API is built using **NestJS** and follows a modular architecture. All endpoints are prefixed with `/v1` and are served over HTTPS. The persistence layer uses **PostgreSQL** with **TypeORM**, utilizing a hierarchical multi-tenant model.

### Multi-Tenancy Model
- **Tenant**: A macro-organization (e.g., Hospital Group like Mediclinic or Netcare).
- **Practice**: A localized clinical branch (e.g., Netcare Blaauwberg Hospital).
- **Clinician**: Affiliated with one or more Practices.
- **Parent/Child**: Linked to a primary Clinician and optionally associated with a Practice site.

## API Endpoint Reference

| Domain | Method | Endpoint | Description | Guard/Roles |
| :--- | :--- | :--- | :--- | :--- |
| **Auth & Users** | `GET` | `/v1/users` | Fetch all system users. | `ADMIN` |
| | `POST` | `/v1/users` | Create a new user profile. | Open |
| | `GET` | `/v1/users/:id` | Fetch detailed user metadata. | Owner or `ADMIN` |
| | `PATCH` | `/v1/users/:id` | Update user demographics/role. | Owner or `ADMIN` |
| | `GET` | `/v1/users/clinicians/public` | Public directory of verified clinicians. | Open |
| **Children** | `GET` | `/v1/children` | List pediatric patient records. | `ADMIN`, `CLINICIAN` |
| | `POST` | `/v1/children` | Register a new child profile. | `ADMIN`, `CLINICIAN` |
| | `GET` | `/v1/children/:id` | Fetch full child health profile. | `ADMIN`, `CLINICIAN`, `PARENT` |
| | `PATCH` | `/v1/children/:id` | Update child health attributes. | `ADMIN`, `CLINICIAN` |
| | `GET` | `/v1/children/:id/records` | Fetch growth, vaccine, and milestone history. | Assigned `CLINICIAN` |
| | `POST` | `/v1/children/:id/allergies` | Log a new allergy. | `ADMIN`, `CLINICIAN` |
| | `POST` | `/v1/children/:id/conditions` | Log a medical condition. | `ADMIN`, `CLINICIAN` |
| **Appointments**| `GET` | `/v1/appointments` | List all scheduled consultations. | `ADMIN`, `CLINICIAN`, `PARENT` |
| | `POST` | `/v1/appointments` | Book a new medical appointment. | `ADMIN`, `CLINICIAN` |
| | `PATCH` | `/v1/appointments/:id` | Reschedule or cancel appointment. | `ADMIN`, `CLINICIAN` |
| **Reports** | `GET` | `/v1/reports` | List generated clinical reports. | `ADMIN`, `CLINICIAN` |
| | `POST` | `/v1/reports` | Generate a new Crèche Admission PDF. | `CLINICIAN` |
| | `GET` | `/v1/reports/:id` | Download/View specific report. | Assigned `CLINICIAN`, `PARENT` |
| **Master Data** | `GET` | `/v1/records/milestones` | Standard CDC/WHO developmental milestones. | Open |
| | `GET` | `/v1/records/vaccinations`| Global EPI vaccination schedules. | Open |
| **Verification** | `GET` | `/v1/verifications/clinicians` | Queue of pending medical license audits. | `SUPER_ADMIN` |
| | `GET` | `/v1/verifications/records` | Pending parent-logged health entries. | `ADMIN`, `CLINICIAN` |
| **Infrastructure** | `GET` | `/v1/tenants` | Manage hospital groups. | `SUPER_ADMIN` |
| | `GET` | `/v1/practices` | Manage branch clinic metadata. | `SUPER_ADMIN` |
| | `GET` | `/v1/api/dashboard` | High-level telemetry for the active session. | Authenticated |

## Data Model & Relationships

### Key Entities
- **User**: The root authentication identity. Roles include `PARENT`, `CLINICIAN`, `ADMIN`, and `SUPER_ADMIN`.
- **ClinicianProfile**: Extension of `User` for medical professionals, storing HPSCA/SANC metadata.
- **Child**: The central medical record. Holds relationships to a Parent (`User`) and a primary Clinician (`User`).
- **GrowthRecord**: Time-series data for height, weight, and head circumference.
- **CompletedVaccination**: Record of an administered dose from the EPI schedule.
- **Appointment**: Bridge entity between `Child`, `Clinician`, and `Practice`.

### Data Constraints
1. **POPI Compliance**: All PII is encrypted at rest. Clinician-Parent interactions are subject to strict multi-tenant data isolation.
2. **Verification Loop**: Health records logged by parents (Milestones, Growth) remain in a `PENDING_ASSESSMENT` state until verified by an associated Clinician.
3. **Hierarchy**: A Practice cannot exist without a Parent Tenant. A Clinician cannot verify records unless associated with a Practice.

## Real-Time Statistics (Seeded Data)
*As of the latest hierarchical seed in `src/apps/api/db/seeds/`*

| Stat Name | Count |
| :--- | :--- |
| **Total Tenants** | 8 |
| **Active Practices** | 31 |
| **Verified Clinicians** | 1+ |
| **Registered Patients (Children)** | 1+ |
| **Master Records (Vaccines/Milestones)** | 64+ |

---
*Auto-Generated via Antigravity Toolkit.*
