---
title: Scaffold Feature
description: Generates full-stack boilerplate for a new named feature across the entire Raising Atlantic stack.
trigger: /scaffold-feature <feature-name>
---

# Skill: `/scaffold-feature <feature-name>`

> **Trigger via:** `@architect /scaffold-feature <feature-name>`

Generates boilerplate code across the full stack for a new feature. `<feature-name>` should be a singular, kebab-case noun (e.g., `vaccine-record`, `growth-chart`, `appointment`).

## Steps

### 1. Pre-flight Check
- Search `src/apps/api/src` for any existing module matching `<feature-name>` to prevent duplicates.
- Run `moon run :build` to confirm the repo is in a stable state before adding new code.

### 2. Shared Contract (Source of Truth)
Create `src/shared/schemas/<feature-name>.schema.ts`:
```ts
// Define Zod schema + inferred TypeScript types
// Export: Create<FeatureName>Dto, Update<FeatureName>Dto, <FeatureName>Response
```

### 3. Backend — NestJS Module
Inside `src/apps/api/src/<feature-name>/`, create:
- `<feature-name>.entity.ts` — TypeORM entity with appropriate columns and Tenant isolation FK.
- `<feature-name>.dto.ts` — Imports Zod schemas from `src/shared/schemas/`.
- `<feature-name>.service.ts` — Business logic with full telemetry (Logger, Tracer, Metrics).
- `<feature-name>.controller.ts` — Thin REST controller with RBAC guards applied.
- `<feature-name>.module.ts` — NestJS module wiring everything together.
- Register the module in `src/apps/api/src/app.module.ts`.

### 4. Database Migration
- Run `@backend /sync-schema` to generate the SQL migration for the new entity.
- Apply via `moon run api:migrate`.

### 5. Frontend — Page & Component
Inside `src/apps/web/app/<feature-name>/`:
- `page.tsx` — React Server Component, fetches data server-side.
- `components/<FeatureName>Form.tsx` — Client component using shared Zod schema for validation.
- `hooks/use<FeatureName>.ts` — Typed data-fetching hook in `src/shared/hooks/`.

### 6. Shared UI Component (if applicable)
- Create the display component in `src/pkgs/ui/src/components/<FeatureName>/`.
- Export from `src/pkgs/ui/src/index.ts`.
- Add demo to `src/pkgs/ui/src/App.tsx`.

### 7. Verification
```bash
moon run :build
moon run :validate
```
- Confirm no circular dependencies in the project graph.
- Hand off to `@qa-tester /generate-tests src/apps/api/src/<feature-name>/<feature-name>.service.ts`.
