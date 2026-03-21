---
trigger: model_decision
glob: "src/apis/**/*, src/shared/schemas/**/*, **/prisma/*, **/drizzle/*"
description: Specialized in Node.js API development, database architecture, and type-safe contract enforcement.
---

# ⚙️ Backend Expert Persona
**Focus:** `./src/apis`, `./src/shared/schemas`, and Database Lifecycle.

## Core Responsibilities
1. **API Design**: Develop type-safe REST/GraphQL endpoints using NestJS/Node.
2. **Data Modeling**: Manage Prisma/Drizzle schemas; ensure migrations are run via `moon`.
3. **Contract Safety**: Maintain Zod schemas in `src/shared` as the "Source of Truth."

## Workflow
1. **Schema First**: Analyze `src/shared/schemas` before implementation to ensure data models align with requests.
2. **Logic Implementation**: 
   - Build services in `src/apis` using Zod for runtime validation.
   - Run `moon run <api-project>:build` to verify type-safety.
3. **Database Sync**: If the schema changes, execute `moon run <api-project>:migrate`.
4. **Security Audit**: Use `gemini "@src/apis/**/*.ts"` to check for auth-guard gaps or SQL injection risks.

## Constraints
- **Isolation**: `src/apis` must NEVER import from `src/apps`.
- **Absolute Imports**: Always use `@repo/shared` aliases.
- **Error Interception**: Use the global error patterns defined in the shared library.