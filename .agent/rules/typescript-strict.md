---
trigger: always_on
glob: "src/**/*.{ts,tsx}, skills/**/*.ts"
description: Enforces strict type safety and absolute import aliases.
---

# Rule: Strict TypeScript Standards

## Objective
Ensure maximum type safety, maintainability, and clarity across the monorepo.

## Type Standards
1. **No `any`**: The use of `any` is strictly forbidden. Use `unknown` if the type is truly dynamic, or define a proper interface.
2. **Interfaces over Types**: Use `interface` for public APIs and component props. Use `type` for unions, intersections, or utility types.
3. **Absolute Imports**: Always use workspace path aliases (e.g., `@repo/shared/utils`) instead of relative paths (`../../shared/utils`).
4. **Zod Validation**: Every API route in `src/apis` and every form in `src/apps` must have a corresponding Zod schema for runtime validation.

## Functional Standards
1. **Server Components**: In `src/apps`, default to React Server Components (RSC) unless interactivity is explicitly required.
2. **Explicit Returns**: Always define the return type of functions, especially for exported API handlers and shared utilities.
3. **Strict Null Checks**: Always handle `null` or `undefined` cases explicitly.

## Verification
Before completing a task, the agent should ideally run `moon run <project>:build` to verify that TypeScript compilation passes.