# Raising Atlantic: Agentic Workflow Guide

This monorepo uses **Google Antigravity** as an agent-first IDE. We have pre-configured a team of AI Personas, Skills, and Workflows to ensure high-quality, compliant code generation.

---

## 🏗️ Directory Structure

Antigravity automatically discovers configurations from two specific locations at the project root:

```yaml
raisingatlantic-mono/
├── agents/                          # Personas — triggered with @name
│   ├── architect/                   # Orchestrator & monorepo graph guardian
│   ├── frontend/                    # Next.js, React Native, shared UI library
│   ├── backend/                     # NestJS, PostgreSQL, TypeORM, Genkit AI
│   ├── security/                    # POPIA, PAIA, HPCSA/SANC, RBAC
│   ├── qa-tester/                   # Jest, Playwright, Postman
│   ├── copywriter/                  # Brand voice (parents vs. clinicians)
│   ├── legalwriter/                 # ToS, EULA, DPA, liability disclaimers
│   └── pediatric-advisor/           # EPI-SA 2024/25 clinical logic validator
│
├── .agents/                         # Automations, Skills, and Always-on Rules
│   ├── rules/                       # Always-on constraints for the AI
│   │   ├── component-lib-first.md   # All UI components go in packages/ui
│   │   ├── moon-conventions.md      # Moon v2 task runner standards
│   │   ├── no-secrets.md            # No hardcoded API keys or credentials
│   │   └── typescript-strict.md     # Strict TypeScript rules (no any, Zod, RSC)
│   ├── skills/                      # Actions — triggered with /name
│   │   ├── scaffold-feature/        # Full-stack feature boilerplate generator
│   │   ├── audit-popia/             # POPIA compliance scanner
│   │   ├── generate-tests/          # Jest unit test + Postman assertion generator
│   │   ├── sync-schema/             # TypeORM entity → SQL migration generator
│   │   └── draft-release-notes/     # git diff → user-facing release notes
│   └── workflows/                   # Multi-step automations — triggered with /name
│       ├── build.md                 # /build — moon run :build
│       ├── dev.md                   # /dev — moon run :dev
│       ├── new-endpoint.md          # /new-endpoint — full-stack API scaffold
│       ├── feature-delivery-pipeline.md # @architect → /scaffold → parallel impl → audit → tests
│       └── clinical-report-generation.md# EPI-SA validate → Genkit AI → PDF report
│
├── .ai/                             # Human-readable documentation backup (Do not edit directly)
```

---

## 🎭 Using Agents (Personas)

Trigger an agent in the Antigravity chat by typing `@` followed by its name. Each agent has a strict domain boundary to prevent hallucinations and enforce specific standards.

### Example Prompts

**1. Delegating an entire feature (`@architect`)**
> `@architect` I need a new "appointment booking" feature. It needs a Next.js form for parents, a NestJS API to save to the database, and it must alert the clinic. Please orchestrate this.

**2. Requesting an audit (`@security`)**
> `@security` review `@src/apps/api/src/children/children.controller.ts` and ensure it complies with POPIA Section 32.

**3. Clinical Validation (`@pediatric-advisor`)**
> `@pediatric-advisor` Check the weight calculation logic in `@src/apps/api/src/growth/growth.service.ts`. Does it align with the latest WHO Z-score tables for a 6-month-old girl?

**4. Drafting Legal/Copy (`@copywriter` and `@legalwriter`)**
> `@copywriter` rewrite this error message so a stressed parent understands what to do next without using medical jargon.
> 
> `@legalwriter` draft a medical liability disclaimer for the new AI growth prediction chart.

---

## 🛠️ Using Skills and Workflows

Trigger a predefined action by typing `/` in the Antigravity chat.

### Core Automation Pipelines

*   **/feature-delivery-pipeline**: Run this to scaffold, implement, audit, and test a new feature automatically.
*   **/clinical-report-generation**: An end-to-end flow to ingest raw patient data, validate against EPI-SA guidelines, generate an AI summary, and produce a Crèche PDF.

### Specific Actions

*   **/scaffold-feature**: Creates boilerplate (Schemas, Entity, Controller, Service, Next.js page).
*   **/audit-popia**: Specifically scans for PII leaks, unencrypted health data, and RBAC implementation.
*   **/generate-tests**: Generates Jest unit tests and Postman collection assertions for a given file.
*   **/sync-schema**: Automates running the TypeORM migration generation task.
*   **/draft-release-notes**: Summarizes commits into user-facing release notes.

### Common Dev Tasks
You can use `/build`, `/dev`, `/install`, and `/storybook` to invoke the standard `moon run` tasks without leaving the chat.