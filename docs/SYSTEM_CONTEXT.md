# System Context: Raising Atlantic

## Layman's Executive Summary
**Raising Atlantic** is a comprehensive digital "Road to Health" SaaS application designed to modernize and digitalize the South African National Department of Health (DoH) Road to Health booklet (RtHB).

**The Problem:** Traditional physical booklets are highly susceptible to loss, damage, or incomplete entries. This fragmentation creates a critical lack of "Continuity of Care" wherein pediatricians, clinical specialists, and parents are forced to rely on fragmented historical data, delaying early interventions for developmental or physical issues.
**The Solution:** The platform bridges this gap by acting as a secure, immutable, cloud-based ledger for a child's early development. It dynamically tracks developmental milestones, precise growth percentiles (Growth Velocity), and complex vaccination schedules.
**Core Value Proposition:** 
- **For Parents:** Peace of mind through automated immunization reminders, the elimination of "lost books", and a clear view into their child's holistic growth.
- **For Clinicians:** Reduced clinical liability, immediate access to an accurate historical clinical dataset, simplified HPCSA/SANC compliance, and seamless patient roster management.

*Crucial Context:* Our programmatic immunization logic strictly follows the **South African EPI (Expanded Programme on Immunisation) schedule as of 2024/2025**, adhering exclusively to the latest Department of Health (DoH) guidelines.

## Product Feature Map

### 1. Parent Role
*   **Parent Dashboard:** The primary landing zone. Offers an immediate, aggregated overview of all registered children. Includes dynamic progress bars, actionable alerts for upcoming or missed EPI vaccinations, and due milestones mapped specifically to the current month of the child's life.
*   **Child Management (Add/Edit Profile):** The workflow allowing parents to securely register a new child, entering their Date of Birth, gender, and demographics to dynamically instantiate a completely personalized health timeline.
*   **Clinical Records Tracking:** 
    *   *Growth:* Inputting episodic weight, height/length, and head circumference points.
    *   *Milestones:* Checking off achievements across Cognitive, Social/Emotional, Language, and Physical domains, deeply categorized by age buckets (2 Months to 5 Years).
    *   *Vaccinations:* Recording administered vaccines. 
    *   *User Story:* As a parent, I can input my child's latest stats or check off milestones directly from my mobile device, pushing their status to "Pending Assessment" for clinician review.
*   **Validated Clinician/Practice Directory:** 
    *   *User Story:* As a parent, I can search a validated directory of local clinics or specialized pediatricians, linking their digital practice to my child's profile to permit secure, read/write medical oversight.

### 2. Clinician Role
*   **Clinician Dashboard:** Focuses strictly on clinical patient management across their assigned roster. Surfaces recently active patient records, aggregations of upcoming required vaccinations for their practice body, and critical pending verification workloads.
*   **Patient Roster & Detail View:** 
    *   *User Story:* As a clinician, I instantly see my linked patients. I can drill down into a child's complete historical Road to Health record—reviewing longitudinal mock charts and notes prior to physical consultations.
*   **The Verification Loop (Crucial Workflow):** 
    *   *User Story:* When a parent logs a new milestone or vaccination, it enters a `PENDING_ASSESSMENT` state. As a clinician, I am required to clinically review these entries, either adding medical notes or authenticating the record to finalize it as verified medical history.

### 3. Admin & Super Admin Roles
*   **System Dashboard:** Provides high-level telemetry and KPI metrics (Total Active Clinicians, Total Registered Parents, Total Children).
*   **Tenant & Practice Topology Management:** 
    *   *User Story:* As a system administrator, I can safely provision access for entirely new hospital groups (Tenants), add branch clinics (Practices), and associate clinical staff to these practices based on strict multi-tenant boundaries.
*   **Clinician Vetting and Verification (HPCSA/SANC):** 
    *   *User Story:* As an admin, I possess the authority to audit a newly registered clinician's profile, cross-referencing their provided medical license strings against official HPCSA or SANC databases before they are authorized as 'Verified' and exposed within the public parent directory.

## Technical Architecture (High Level)
The application leverages a modern, scalable **Moonrepo monorepo** architecture, emphasizing strict boundary isolation and rapid tooling execution via **Bun** / Node.js.

*   **Frontend Application (`apps/web`):** 
    *   Built rigidly with **Next.js (App Router)** utilizing React 19 Server Components for data hydration. 
    *   Design system is powered by **Tailwind CSS** overlaying `shadcn/ui` (Radix UI primitives).
    *   Relies heavily on custom React Hooks (`useToast`, `useMobile`) to guarantee responsive, accessible clinical interfaces.
*   **Backend Application (`apps/api`):** 
    *   Powered by **NestJS**, operating as the exclusive orchestration layer for all business logic, data persistence, and role verifications. REST endpoints are versioned exclusively under the `/v1` prefix.
    *   Sub-divided into strictly bounded modules: `users`, `children`, `practices`, `tenants`, `verifications`, and `master-data`.
*   **Database Persistence:** **PostgreSQL 15** accessed firmly via **TypeORM**, managing all relational constraints, cascades, and schema synchronizations natively.
*   **Dual Data-Source Flow (Adapter Pattern):** 
    *   The frontend communicates to the backend through a strictly typed Axios client (`api-client.ts`).
    *   Crucially, data fetching is abstracted through an adapter layer invoking `withDataSource()`. By evaluating the `NEXT_PUBLIC_USE_API` environment variable, the application can gracefully toggle at runtime between static local mock data flows and live NestJS REST responses. Allow NotebookLM to deeply reference this mock vs. live flow design choice.
*   **RBAC Strategy (Role-Based Access Control):** 
    *   Hard-enforced across both UI layers (suppressing navigational access) and backend Auth Guards.
    *   Roles strictly mapped as: `PARENT`, `CLINICIAN`, `ADMIN`, and `SUPER_ADMIN`.
*   **Observability & Telemetry (`core/telemetry`):** 
    *   Features a custom-implemented telemetry layer supporting GCP/OpenTelemetry interfaces (Logger, Metric, Tracer, ErrorReporter) to ensure enterprise-grade observability and auditability in production deployments.

## Data Schema Overview
The architecture depends entirely on a strictly typed relational schema orchestrated via TypeORM decorators. DO NOT infer raw credentials; focus exclusively on the relational cardinality:

*   **Users (`users`):** The absolute authentication root. Stores core roles (`UserRole` Enum), identity emails, and basic demographics.
*   **ClinicianProfiles (`clinician_profiles`):** A strict 1-to-1 cascading relationship from the primary `User` entity to store granular medical attributes like `specialty` and `bio`. Clinicians are joined to specific `Practices` via a Many-to-Many join table (`practice_clinicians`).
*   **Tenants & Practices (`tenants`, `practices`):** 
    *   `Tenant`: The top-level hierarchical organization (e.g., "Raising Atlantic Health Group"). 
    *   `Practice`: A strict 1-to-N relationship descending from a Tenant repesenting individual physical clinics.
*   **Children (`children`):** The primary domain object representing a patient. Holds an N-to-1 associative relationship to exactly one `Parent` (User) and an optional N-to-1 relationship to exactly one `Clinician` (User).
*   **Clinical Records (The 1-to-N relationships extending from `Child`):** 
    *   `GrowthRecord`: Stores absolute `height`, `weight`, and `headCircumference` measurements against specific assessment dates.
    *   `CompletedMilestone`: Tracks the achievement state (`milestoneId`) referencing an external static dictionary of age-graded developmental markers.
    *   `CompletedVaccination`: Logs exact vaccine identifiers (`vaccineId`) mapping rigidly to the EPI schedule configurations.
    *   *Workflow State:* All record entities inherit from a core `ResourceStatus` enum dictating their operational state: `ACTIVE`, `INACTIVE`, `ARCHIVED`, `DISCHARGED`, or crucial tightly coupled workflow states like `PENDING_ASSESSMENT`.

*(Note: Raw connection strings, secrets, and environment `.env` credentials are systematically excluded from this LLM boundary).*

## Terminology Glossary
This section provides strict, non-negotiable definitions for uniquely South African and localized medical acronyms to tightly ground an LLM's generative context:

*   **DoH:** The National Department of Health within the South African government.
*   **Road to Health Book (RtHB):** The official physical health tracking booklet issued by the DoH to every newborn citizen. Often mismanaged or lost.
*   **EPI Schedule:** The South African Expanded Programme on Immunisation. A scientifically formulated timetable specifying precisely which vaccines a child MUST receive at explicitly defined ages (from birth continuing up to 12 years).
*   **HPCSA:** Health Professions Council of South Africa. The statutory body for medical practitioners. Verifying an HPCSA number ensures clinical legitimacy.
*   **SANC:** South African Nursing Council. Similar statutory validation exclusively for nursing professionals.
*   **Growth Velocity:** The mathematical rate of physical growth (weight, height, head circumference). Clinicians track velocity across time lines to ensure a child remains aligned to an optimal percentile curve.
*   **Milestones:** Standardized developmental checkpoints divided systematically into Cognitive, Social/Emotional, Language, and Physical capabilities (e.g., "Rolls over at 6 months").
*   **Pending Assessment:** A transient, critical data state identifying a localized health record (growth metric, milestone, vaccine) logged by a parent that currently lacks the required formal validation by their authorized treating clinician.
*   **Tenant vs Practice:** In our architecture, a Tenant represents a sprawling macro-organization (A hospital network), whereas a Practice is the localized micro-facility (The specific pediatric ward/clinic building).

## Integration Points
*   **AI Analytics Engine (`src/ai/genkit.ts`):** Directly integrated with Google's `@genkit-ai` module leveraging the `gemini-2.0-flash` model. Configured to process synthetic health contexts, provide intelligent clinical summaries, or orchestrate localized intelligent chat interactions.
*   **PostgreSQL Persistence Layer:** Containerized instances execute strictly on localized Docker port `TCP/5433` using bespoke Compose configurations to ensure complex schema synchronizations (`typeorm sync`) and rapid seed hydration.
*   **Postman E2E Assurances:** Comprehensive endpoint integration tests reside directly within the `tests/postman/api_collection.json` definitions enforcing schema contracts prior to deployment logic.
*   **NotebookLM System Manifest Integration:** This specific `.md` document acts as the zero-point canonical grounding schema for external LLMs (such as NotebookLM). It inherently encapsulates the complete architectural, domain, and workflow context required to authorize high-accuracy code generation or clinical documentation processes.
