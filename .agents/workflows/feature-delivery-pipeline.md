---
title: Feature Delivery Pipeline
description: End-to-end automated pipeline for delivering a fully implemented, tested, and compliant feature from a single user request.
---

# Workflow: `feature-delivery-pipeline`

> **Trigger:** Describe a new feature to `@architect` and it will orchestrate this pipeline automatically.

Automated multi-agent pipeline for shipping a new feature from product requirement to tested, compliant code.

---

## Step 1 — Requirements Breakdown (`@architect`)
**Input:** User's feature description in natural language.

`@architect` produces:
- A named feature slug (kebab-case)
- A list of affected domains (UI / API / DB / Compliance / Clinical)
- An ordered task list with agent assignments
- Identification of any parallel tasks

---

## Step 2 — Scaffold (`@architect` → `/scaffold-feature <feature-name>`)
`@architect` triggers the `/scaffold-feature` skill to generate:
- Shared Zod schema in `src/shared/schemas/`
- NestJS module (entity, DTO, service, controller)
- Next.js page and form component
- Typed fetch hook in `src/shared/hooks/`

---

## Step 3 — Implementation (parallel dispatch)

`@architect` dispatches `@frontend` and `@backend` in parallel:

| Agent | Task |
|---|---|
| `@frontend` | Build the UI components and connect them to the new API hook |
| `@backend` | Implement service business logic, run `/sync-schema`, apply migration |

Both agents work concurrently and synchronise to the `src/shared/schemas/` contract.

---

## Step 4 — Compliance Audit (`@security` → `/audit-popia`)
Once `@backend` is complete, `@security` runs:
```
/audit-popia src/apps/api/src/<feature-name>/
```
- Any HIGH or CRITICAL findings must be resolved before proceeding.
- MEDIUM findings are logged in a `docs/security/audit-log.md` backlog item.

---

## Step 5 — Test Coverage (`@qa-tester` → `/generate-tests`)
`@qa-tester` runs:
```
/generate-tests src/apps/api/src/<feature-name>/<feature-name>.service.ts
```
- Generates Jest unit tests and Postman collection entries.
- Runs `moon run tests:test` to confirm green.

---

## Step 6 — Sign-off
`@architect` performs final verification:
```bash
moon run :build
moon run :validate
moon run tests:test
```
Reports a summary of all agent outputs to the user and flags any outstanding items.
