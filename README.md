# Raising Atlantic Monorepo 🌊

Welcome to the **Raising Atlantic** monorepo. This project is built using a modern, scalable stack and managed with **Moonrepo** to ensure high performance and consistent developer workflows.

### 📚 Core Documentation
- [System Context](./docs/SYSTEM_CONTEXT.md)
- [Brand Guidelines](./docs/BRAND_GUIDELINE.md)
- [Agentic Coding System](./docs/AGENTIC.md)
- [NotebookLM MCP Setup](./docs/NOTEBOOK_LM_MCP.md)

## 🚀 Quickstart

Get up and running in minutes:

1.  **Install dependencies:**
    ```bash
    moon run :install
    ```
2.  **Start your database (Docker):**
    ```bash
    moon run :db-start
    ```
3.  **Run migrations & seed initial data:**
    ```bash
    moon run :db-migrate
    moon run :db-seed
    ```
4.  **Start the development server:**
    ```bash
    moon run :dev
    ```

The API will be available at `http://localhost:3000/v1/`.
The Frontend will be available at `http://localhost:9002/`.
The Mobile app will launch its Expo Metro server (see [Mobile Development](#-mobile-development) below for iOS/Android instructions).

---

## 🛠 Project Workflow

We use **Moonrepo** to orchestrate all project-level and monorepo-level tasks.

### 🗄 Database Management
All database commands are unified across the monorepo root:
- `moon run :db-start`: Spins up the PostgreSQL container (mapped to port `5433`).
- `moon run :db-stop`: Shuts down the database.
- `moon run :db-migrate`: Applies all pending database migrations.
- `moon run :db-seed`: Populates the database with initial developer data.

### 🏗 API & Development
- `moon run :build`: Builds all applications (API, Web, Mobile, etc.).
- `moon run :dev`: Starts the API, Web, and Mobile watchers simultaneously.

---

## 📱 Mobile Development

The mobile app is a **React Native (Expo)** app. See the full guide at [`src/apps/mobile/README.md`](./src/apps/mobile/README.md).

### Prerequisites
- **iOS:** macOS + Xcode 15+ (for iOS Simulator)
- **Android:** Android Studio + an AVD configured in Device Manager
- **Physical device:** Install [Expo Go](https://expo.dev/go) on your iOS or Android device

### Running on iOS or Android

**Step 1 — Start the Metro bundler (Expo dev server):**
```bash
moon run mobile:dev
# or: cd src/apps/mobile && npm run dev
```

**Step 2 — Open on your target platform** (from the interactive terminal menu):

| Key | Action |
|-----|--------|
| `i` | Open iOS Simulator |
| `a` | Open Android Emulator |
| Scan QR | Open in Expo Go on a physical device |

**One-step shortcuts** (start Metro + open platform automatically):
```bash
moon run mobile:ios      # iOS Simulator (macOS only)
moon run mobile:android  # Android Emulator
```

### Troubleshooting
- **iOS Simulator missing:** Run `xcode-select --install`
- **Android emulator not detected:** Ensure `ANDROID_HOME` is set and an AVD is started from Android Studio → Device Manager
- **Clear Expo cache:** `npx expo start --clear` inside `src/apps/mobile/`
- **Dependency errors:** `npm install --legacy-peer-deps` (required for React 19 peer deps)

---

## 🏗 Repository Structure

-   `src/apps/api`: NestJS API.
-   `src/apps/web`: React Next.js application.
-   `src/apps/mobile`: React Native Expo mobile application.
-   `src/pkgs/ui`: Shared UI component library.
-   `src/core`: Shared logic, interfaces, and telemetry.
-   `tests/postman`: API integration tests and Postman collections.

## 📡 API Versioning

All API endpoints strictly follow the `v1` prefix convention. 
Example: `GET http://localhost:3000/v1/examples`

---

## 🤖 Agentic Coding

This monorepo is built with an AI agent orchestration system that provides specialised, domain-scoped intelligence for every layer of the stack. All configuration lives in the **`.ai/`** directory at the root.

> Full documentation: [`docs/AGENTIC.md`](./docs/AGENTIC.md)

---

### Agents (Personas) — `@name`

Invoke an agent by prefixing its name with `@`. Each agent has a strict domain boundary and system prompt to prevent hallucinations across different parts of the stack.

| Agent | Trigger | Domain |
|---|---|---|
| **Architect** | `@architect` | Monorepo graph, toolchain, orchestration & agent dispatch |
| **Frontend** | `@frontend` | Next.js, React Native, shared UI library (`src/pkgs/ui`) |
| **Backend** | `@backend` | NestJS API, PostgreSQL, TypeORM, Genkit AI integration |
| **Security** | `@security` | POPIA, PAIA, HPCSA/SANC compliance, RBAC auditing |
| **QA Tester** | `@qa-tester` | Jest unit tests, Playwright E2E, Postman collections |
| **Copywriter** | `@copywriter` | Dual-audience brand voice (parents & clinicians) |
| **Legal Writer** | `@legalwriter` | ToS, EULA, Privacy Policy, DPA, medical liability |
| **Pediatric Advisor** | `@pediatric-advisor` | EPI-SA 2024/25 immunisation & growth logic validation |

**Example usage:**
```
@architect I need a new "appointment booking" feature for parents and clinicians.
@security /audit-popia src/apps/api/src/children/children.controller.ts
@pediatric-advisor Review the rotavirus scheduling logic in vaccines.service.ts
```

---

### Skills (Actions) — `/name`

Skills are repeatable, ephemeral tasks. They are agent-agnostic and can be triggered directly or invoked by `@architect` as part of a pipeline.

| Skill | Trigger | What it does |
|---|---|---|
| **Scaffold Feature** | `/scaffold-feature <name>` | Generates entity, service, controller, page, form, and hook for a new feature |
| **Audit POPIA** | `/audit-popia <file-path>` | Scans for PII exposure, unencrypted health data, and missing RBAC guards |
| **Generate Tests** | `/generate-tests <file-path>` | Produces Jest unit tests and Postman assertions for a completed file |
| **Sync Schema** | `/sync-schema` | Detects TypeORM entity changes and generates the SQL migration script |
| **Draft Release Notes** | `/draft-release-notes` | Converts `git diff` into user-facing release notes (Features / Fixes / Clinical) |

---

### Workflows (Automations)

Pre-built, multi-step pipelines that combine agents and skills. Located in `.ai/workflows/`.

#### `feature-delivery-pipeline`
End-to-end feature shipping from a single natural language request:
```
@architect → /scaffold-feature → (@frontend ∥ @backend) → @security /audit-popia → @qa-tester /generate-tests
```

#### `clinical-report-generation`
Converts raw patient data into a validated, AI-drafted Crèche Admission PDF report:
```
Patient data → @pediatric-advisor validates → @backend invokes Genkit AI → @copywriter formats PDF
```

#### Dev Workflows
| Command | What it runs |
|---|---|
| `/build` | `moon run :build` |
| `/dev` | `moon run :dev` |
| `/install` | `bun run cli:install` |
| `/new-endpoint` | Full-stack endpoint scaffold (route → Zod schema → hook) |
| `/ui-loop` | Stitch component generation + design token refactor |
| `/fix-config` | Moon v2 config repair with schema validation |
| `/storybook` | `moon run :storybook` |

---

## ❓ FAQ

### Why is there a `migrations` table in my database?
The `migrations` table is automatically created by TypeORM. It is **essential for schema stability**. 
It acts as a record of which versioned migration files have already been applied to the database. Without this table, the system wouldn't know which changes are new, leading to errors when attempting to recreate existing tables or columns during a migration run.

### Why port `5433`?
If you have a local PostgreSQL installation (like via Homebrew or PostgreSQL.app), it typically hijacks port `5432`. We map Docker to `5433` to allow both to coexist without conflicts.
