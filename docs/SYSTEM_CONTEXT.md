# System Context: Raising Atlantic

## Layman's Executive Summary
**Raising Atlantic** is a comprehensive digital "Road to Health" SaaS application designed to modernize and digitalize the South African National Department of Health (DoH) Road to Health booklet (RtHB).

**The Problem:** Traditional physical booklets are highly susceptible to loss, damage, or incomplete entries. This fragmentation creates a critical lack of "Continuity of Care" wherein pediatricians, clinical specialists, and parents are forced to rely on fragmented historical data, delaying early interventions for developmental or physical issues.
**The Solution:** The platform bridges this gap by acting as a secure, immutable, cloud-based ledger for a child's early development. It dynamically tracks developmental milestones, precise growth percentiles (Growth Velocity), and complex vaccination schedules — accessible from both a Next.js web console and a native Expo mobile app.
**Core Value Proposition:**
- **For Parents:** Peace of mind through automated immunization reminders, the elimination of "lost books", and a clear view into their child's holistic growth — on web or mobile.
- **For Clinicians:** Reduced clinical liability, immediate access to an accurate historical clinical dataset, simplified HPCSA/SANC compliance, seamless patient roster management, and an integrated appointment scheduler.

*Crucial Context:* Our programmatic immunization logic strictly follows the **South African EPI (Expanded Programme on Immunisation) schedule as of 2024/2025**, adhering exclusively to the latest Department of Health (DoH) guidelines.

## Product Feature Map

### 1. Parent Role
*   **Parent Dashboard:** The primary landing zone. Offers an immediate, aggregated overview of all registered children. Includes dynamic progress bars, actionable alerts for upcoming or missed EPI vaccinations, and due milestones mapped specifically to the current month of the child's life.
*   **Child Management (Add/Edit Profile):** The workflow allowing parents to securely register a new child, entering their Date of Birth, gender, and demographics to dynamically instantiate a completely personalized health timeline. Allergies and chronic medical conditions are also captured.
*   **Clinical Records Tracking:**
    *   *Growth:* Inputting episodic weight, height/length, and head circumference points.
    *   *Milestones:* Checking off achievements across Cognitive, Social/Emotional, Language, and Physical domains, deeply categorized by age buckets (2 Months to 5 Years).
    *   *Vaccinations:* Recording administered vaccines.
    *   *User Story:* As a parent, I can input my child's latest stats or check off milestones directly from my web or mobile device, pushing their status to "Pending Assessment" for clinician review.
*   **Validated Clinician/Practice Directory:**
    *   *User Story:* As a parent, I can search a validated directory of local clinics or specialized pediatricians, linking their digital practice to my child's profile to permit secure, read/write medical oversight.
*   **Appointments & Messaging:** Parents can request and view appointments tied to a linked clinician/practice, and consume in-app messaging surfaces (mobile) for clinician communication.

### 2. Clinician Role
*   **Clinician Dashboard:** Focuses strictly on clinical patient management across their assigned roster. Surfaces recently active patient records, aggregations of upcoming required vaccinations for their practice body, and critical pending verification workloads.
*   **Patient Roster & Detail View:**
    *   *User Story:* As a clinician, I instantly see my linked patients. I can drill down into a child's complete historical Road to Health record—reviewing longitudinal mock charts and notes prior to physical consultations.
*   **The Verification Loop (Crucial Workflow):**
    *   *User Story:* When a parent logs a new milestone or vaccination, it enters a `PENDING_ASSESSMENT` state. As a clinician, I am required to clinically review these entries, either adding medical notes or authenticating the record to finalize it as verified medical history.
*   **Schedule & Reports:** Clinicians manage an `Appointment` calendar and generate clinical `Report` artifacts (PDF export via `jspdf` on web) summarising a child's status across visits.

### 3. Admin & Super Admin Roles
*   **System Dashboard:** Provides high-level telemetry and KPI metrics (Total Active Clinicians, Total Registered Parents, Total Children).
*   **Tenant & Practice Topology Management:**
    *   *User Story:* As a system administrator, I can safely provision access for entirely new hospital groups (Tenants), add branch clinics (Practices), and associate clinical staff to these practices based on strict multi-tenant boundaries.
*   **Clinician Vetting and Verification (HPCSA/SANC):**
    *   *User Story:* As an admin, I possess the authority to audit a newly registered clinician's profile, cross-referencing their provided medical license strings against official HPCSA or SANC databases before they are authorized as 'Verified' and exposed within the public parent directory.
*   **System Activity & Audit:** Admins inspect a `SystemLog` activity feed (admin-only API tier) for tenant-wide auditability.

### 4. Public / Marketing Surface
*   **Marketing site, Blog, Pricing, Legal:** The web app additionally serves a public marketing surface — landing page, `about`, `contact`, `pricing`, `blog` (TipTap-authored CMS-style posts), and a `legal/[slug]` corpus (ToS / Privacy / DPA). Public clinician/practice `directory` is also exposed without authentication.
*   **Lead Capture:** A dedicated `leads` module persists marketing-form submissions for sales follow-up.

## Technical Architecture (High Level)
The application is a **Moonrepo monorepo** (`moon.yaml` at the root) emphasising strict boundary isolation and rapid tooling execution via **Bun** / Node.js. Three deployable apps live under `src/apps/*` and consume shared workspaces under `src/pkgs/*` and `src/core/*`.

### Repository Topology
```
src/
├── apps/
│   ├── api/        # NestJS 11 + TypeORM + PostgreSQL 15 (Docker)
│   ├── web/        # Next.js 16 (App Router) + React 19
│   └── mobile/     # Expo 54 + React Native 0.81 + Expo Router
├── core/
│   └── telemetry/  # GCP/OpenTelemetry adapters (Logger, Metric, Tracer, ErrorReporter)
├── pkgs/
│   ├── types/      # Cross-app TypeScript domain types (child, user, practice, records, …)
│   └── ui/         # Cross-app shared UI primitives
└── test/
    └── cypress/    # Web E2E (Cypress 14) — local / dev / staging / prod profiles
tests/postman/      # API contract suite (collection + per-env config)
```

### Frontend — Web (`apps/web`)
*   **Next.js 16 (App Router)** with **React 19** Server Components for data hydration, run with **Turbopack** (`next dev --turbopack -p 9002`).
*   Design system: **Tailwind CSS 3** + `shadcn/ui` (Radix UI primitives) + `tailwindcss-animate` + `framer-motion`.
*   **State & data fetching:** **TanStack React Query v5** (`QueryProvider`, `query-client`, devtools) with a typed Axios `api-client.ts` underneath. Forms via `react-hook-form` + `zod` + `@hookform/resolvers`.
*   **Error handling:** `react-error-boundary` integrated through `FeatureErrorBoundary` and `RouteError` shells; per-route `error.tsx` boundaries in the App Router tree.
*   **Internationalisation:** `i18next` + `react-i18next` (HTTP backend + browser language detection).
*   **Theming:** `next-themes` with light/dark token system; `design-system` route exposes brand / styleguide / visual-identity playgrounds.
*   **Editorial:** `tiptap` (StarterKit, Image, Link, Placeholder) for blog authoring; `react-markdown` + `remark-gfm` for rendering.
*   **Charts & PDF:** `recharts` for clinical charts, `jspdf` for report export.
*   **Deployment targets:** Firebase App Hosting (`apphosting.yaml`) and Vercel (`vercel.json`).

### Frontend — Mobile (`apps/mobile`)
*   **Expo SDK 54** + **React Native 0.81** + **Expo Router 6** (file-system routing under `app/`).
*   Role-segmented route groups: `app/(auth)/login`, `app/(app)/(parent)`, `app/(app)/(clinician)`, `app/(app)/(admin)` — each with its own `_layout.tsx` and tab structure (dashboard, records, profile, etc.).
*   Styling: **NativeWind 4** (Tailwind for RN) + `tailwindcss` config + custom theme tokens.
*   Animation & graphics: `react-native-reanimated` 4, `react-native-gesture-handler`, **`@shopify/react-native-skia`**, `expo-blur`, `expo-linear-gradient`, `victory-native` (charts), `@gorhom/bottom-sheet`.
*   Auth: local `auth/AuthContext.tsx` + `AsyncStorage`-backed token storage; integrates with the same NestJS REST API via a shared Axios client.
*   Forms: `react-hook-form` + `zod`. Toasts: `sonner-native`. Haptics: `expo-haptics`. Icons: `lucide-react-native`.
*   Data fetching: **TanStack React Query v5** (shared mental model with the web app).

### Backend (`apps/api`)
*   **NestJS 11** orchestrating all business logic, persistence, and role verifications. REST endpoints versioned exclusively under the `/v1` prefix.
*   **Bounded modules:** `users`, `tenants`, `practices`, `children`, `verifications`, `master-data`, `appointments`, `reports`, `blog`, `leads`, `system-logs`, `ai`, plus a generic `examples` reference module.
*   **Cross-cutting:**
    *   `@nestjs/swagger` exposes OpenAPI documentation.
    *   `@nestjs/throttler` provides rate limiting (default 1 req/min on tagged endpoints).
    *   `@nestjs/config` + `dotenv` for environment-driven configuration.
    *   `class-validator` / `class-transformer` for DTO validation.
    *   `nodemailer` for transactional email; `cookie-parser` for cookie-borne sessions.
    *   Auth & RBAC enforced via `common/guards/jwt-auth.guard.ts` and `common/guards/roles.guard.ts`.
*   **Database Persistence:** **PostgreSQL 15** (containerised via `docker-compose.yml`, host port `5433` → container `5432`) accessed via **TypeORM 0.3**. Schema is auto-synchronised in non-production (`synchronize: true`) and managed by explicit migrations in `db/migrations/` for production. Seed scripts live in `db/seeds/` (`SeedExamples`, `SeedCoreData`, `SeedHospitals`, `SeedBlogPosts`).

### Shared Workspaces (`pkgs/*`, `core/*`)
*   **`pkgs/types`** — single source of truth for cross-app TypeScript domain models (`child`, `user`, `role`, `practice`, `records`, `appointment`, `verification`, `common`).
*   **`pkgs/ui`** — shared component primitives consumable from both web and mobile contexts.
*   **`core/telemetry`** — vendor-agnostic interfaces (`logger.interface.ts`, `metric.interface.ts`, `tracer.interface.ts`, `error-reporter.interface.ts`) with concrete GCP/OpenTelemetry implementations under `gcp/`.

### Dual Data-Source Flow (Adapter Pattern)
*   The web frontend communicates to the backend through a strictly typed Axios client (`lib/api/api-client.ts`).
*   Crucially, data fetching is abstracted through `lib/api/data-source.ts::withDataSource()`. By evaluating the `NEXT_PUBLIC_USE_API` environment variable, the application toggles at runtime between static local mock data flows (under `src/data/*.ts`) and live NestJS REST responses.
*   Per-domain adapters live under `lib/api/adapters/*.adapter.ts` (`child`, `health`, `lead`, `master-data`, `practice`, `system-log`, `tenant`, `user`, `verification`) and feed React Query hooks under `lib/api/hooks/*.ts` (`appointments`, `blog`, `children`, `clinicians-public`, `leads`, `master-data`, `practices`, `reports`, `system-logs`, `tenants`, `users`, `verifications`). Allow NotebookLM to deeply reference this mock vs. live flow design choice.

### RBAC Strategy (Role-Based Access Control)
*   Hard-enforced across both UI layers (suppressing navigational access via `lib/rbac/can.ts` + `permissions.ts`) and backend Auth Guards (`JwtAuthGuard`, `RolesGuard` + `@Roles()` decorator).
*   Roles strictly mapped as: `PARENT`, `CLINICIAN`, `ADMIN`, and `SUPER_ADMIN`.

### Observability & Telemetry (`core/telemetry`)
Custom-implemented telemetry layer supporting GCP/OpenTelemetry interfaces (Logger, Metric, Tracer, ErrorReporter) to ensure enterprise-grade observability and auditability in production deployments.

### Branch & Deployment Flow
Branches: `dev` → `test` → `main`. The root `moon.yaml` exposes `deploy-test` and `deploy-prod` tasks that stash, fast-forward-merge `dev` into the target branch, push, and restore the working tree — so engineers ship via Moon, not raw git.

## Data Schema Overview
The architecture depends entirely on a strictly typed relational schema orchestrated via TypeORM decorators. DO NOT infer raw credentials; focus exclusively on the relational cardinality:

*   **Users (`users`):** The absolute authentication root. Stores core roles (`UserRole` Enum), identity emails, and basic demographics.
*   **ClinicianProfiles (`clinician_profiles`):** A strict 1-to-1 cascading relationship from the primary `User` entity to store granular medical attributes like `specialty` and `bio`. Clinicians are joined to specific `Practices` via a Many-to-Many join table (`practice_clinicians`).
*   **Tenants & Practices (`tenants`, `practices`):**
    *   `Tenant`: The top-level hierarchical organization (e.g., "Raising Atlantic Health Group").
    *   `Practice`: A strict 1-to-N relationship descending from a Tenant representing individual physical clinics.
*   **Children (`children`):** The primary domain object representing a patient. Holds an N-to-1 associative relationship to exactly one `Parent` (User) and an optional N-to-1 relationship to exactly one `Clinician` (User).
*   **Clinical Records (1-to-N relationships extending from `Child`):**
    *   `GrowthRecord`: Stores absolute `height`, `weight`, and `headCircumference` measurements against specific assessment dates.
    *   `CompletedMilestone`: Tracks the achievement state (`milestoneId`) referencing an external static dictionary of age-graded developmental markers.
    *   `CompletedVaccination`: Logs exact vaccine identifiers (`vaccineId`) mapping rigidly to the EPI schedule configurations.
    *   `Allergy` / `MedicalCondition`: Long-lived clinical attributes attached to a child, reviewed during the verification workflow.
    *   *Workflow State:* All record entities inherit from a core `ResourceStatus` enum dictating their operational state: `ACTIVE`, `INACTIVE`, `ARCHIVED`, `DISCHARGED`, or crucial tightly coupled workflow states like `PENDING_ASSESSMENT`.
*   **Operational Entities:**
    *   `Appointment`: Schedule entries linking a `Child` (and typically a `Parent`) to a `Clinician` / `Practice` for a future or completed visit.
    *   `Report`: Generated clinical artifacts (PDF-exportable on the web) summarising a child's records over a window.
    *   `BlogPost`: CMS content driving the public `blog/` route; authored via TipTap.
    *   `SystemLog`: Append-only audit trail surfaced through the admin-only `system-logs` module.

*(Note: Raw connection strings, secrets, and environment `.env` credentials are systematically excluded from this LLM boundary).*

## Terminology Glossary
This section provides strict, non-negotiable definitions for uniquely South African and localized medical acronyms to tightly ground an LLM's generative context:

*   **DoH:** The National Department of Health within the South African government.
*   **Road to Health Book (RtHB):** The official physical health tracking booklet issued by the DoH to every newborn citizen. Often mismanaged or lost.
*   **EPI Schedule:** The South African Expanded Programme on Immunisation. A scientifically formulated timetable specifying precisely which vaccines a child MUST receive at explicitly defined ages (from birth continuing up to 12 years).
*   **HPCSA:** Health Professions Council of South Africa. The statutory body for medical practitioners. Verifying an HPCSA number ensures clinical legitimacy.
*   **SANC:** South African Nursing Council. Similar statutory validation exclusively for nursing professionals.
*   **POPIA / PAIA:** South African data-privacy and access-to-information statutes that constrain handling of personally identifiable health data inside this platform.
*   **Growth Velocity:** The mathematical rate of physical growth (weight, height, head circumference). Clinicians track velocity across timelines to ensure a child remains aligned to an optimal percentile curve.
*   **Milestones:** Standardized developmental checkpoints divided systematically into Cognitive, Social/Emotional, Language, and Physical capabilities (e.g., "Rolls over at 6 months").
*   **Pending Assessment:** A transient, critical data state identifying a localized health record (growth metric, milestone, vaccine) logged by a parent that currently lacks the required formal validation by their authorized treating clinician.
*   **Tenant vs Practice:** A Tenant represents a sprawling macro-organization (a hospital network), whereas a Practice is the localized micro-facility (the specific pediatric ward / clinic building).

## Integration Points
*   **AI Analytics Engine — Web (`apps/web/src/ai/genkit.ts`):** Directly integrated with Google's `@genkit-ai/googleai` + `@genkit-ai/next` modules leveraging the `gemini-2.0-flash` model. Configured to process synthetic health contexts, provide intelligent clinical summaries, or orchestrate localized intelligent chat interactions.
*   **AI Analytics Engine — API (`apps/api/src/ai/ai.service.ts`):** A NestJS-side `AiService` (currently a Genkit-shaped placeholder reading `GOOGLE_GENAI_API_KEY`) is wired into the `VerificationsModule` so server-side verification flows can request `draftClinicalSummary(...)` outputs.
*   **PostgreSQL Persistence Layer:** Containerised PostgreSQL 15 instances execute strictly on localized Docker port `TCP/5433` (mapped to internal `5432`) using bespoke `docker-compose.yml` configuration to ensure complex schema synchronizations (`typeorm sync`) and rapid seed hydration (`db:seed`, `db:seed:core`, `db:seed:hospitals`, `db:seed:blog`).
*   **Postman E2E Assurances:** Comprehensive endpoint integration tests reside under `tests/postman/api_collection.json` with environment-scoped configs (`local.env.json`, `dev.env.json`, `production.env.json`) enforcing schema contracts prior to deployment logic.
*   **Cypress Web E2E:** End-to-end browser tests live under `src/test/cypress` (Cypress 14) with profile scripts `test:local`, `test:dev`, `test:test` (staging), and `test:prod`.
*   **Firebase:** The web app additionally embeds the `firebase` SDK and is deployable to **Firebase App Hosting** via `apphosting.yaml`; **Vercel** is supported as an alternative target (`vercel.json`).
*   **Transactional Email:** `nodemailer` is registered on the API for outbound mail (verification, reminders, lead notifications).
*   **NotebookLM System Manifest Integration:** This specific `.md` document acts as the zero-point canonical grounding schema for external LLMs (such as NotebookLM). It inherently encapsulates the complete architectural, domain, and workflow context required to authorize high-accuracy code generation or clinical documentation processes.
