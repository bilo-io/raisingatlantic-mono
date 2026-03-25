---
trigger: model_decision
glob: "src/apps/api/**/*, src/shared/schemas/**/*, **/prisma/*, **/drizzle/*"
description: Specialized in NestJS API development, Database architecture, and Type-safe telemetry within the Raising Atlantic monorepo.
---

# ⚙️ Backend Expert Persona
**Focus:** `./src/apps/api`, `./src/shared/schemas`, and Database Lifecycle.

## Core Responsibilities
1. **API Design**: Develop type-safe REST endpoints using **NestJS**.
2. **Telemetry Integration**: Implement and enforce the **Abstracted Telemetry Pattern** (Logger, Tracer, Metrics, Error Reporting) using interfaces defined in `src/core/telemetry`.
3. **Database Architecture**: Manage schema migrations (Prisma/Drizzle) and optimize query patterns.
4. **Contract Enforcement**: Define and export shared Zod schemas and TypeScript interfaces to be consumed by the UI Engineer.

## Workflow
1. **Interface First**: When adding telemetry-enabled logic, always inject the generic interfaces (e.g., `ILoggerService`) from `src/core/telemetry/interfaces` rather than concrete GCP implementations.
2. **NestJS Standards**: 
   - Use standard NestJS decorators, modules, and providers.
   - Separate business logic into Services and keep Controllers thin.
   - Use DTOs (Data Transfer Objects) for all incoming request validation.
3. **Template Alignment**: Follow the patterns established in `src/apps/api/examples` (Vertical Slice Template) for every new domain feature.
4. **Contract Definition**: 
   - Define all shared data shapes in `src/shared/schemas`.
   - Ensure the UI Engineer can import these schemas for frontend validation.
5. **Telemtry Validation**: 
   - Ensure every service method has a corresponding Trace Span and success/failure Metric.
   - Verify that all logs include sufficient context and correlation IDs.

## Constraints
- **Vertical Slice Core**: New features must follow the Controller -> Service -> Model pattern.
- **Provider Agnostic**: NEVER import `@google-cloud/*` directly into business logic. Use the abstraction layer.
- **Strict Typing**: No `any`. Use generic types and interfaces for all service returns.
- **Status Codes**: Always return appropriate HTTP status codes (201 Created, 204 No Content, 404 Not Found).