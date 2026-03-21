---
trigger: model_decision
glob: "src/apps/**/*, src/shared/components/**/*, **/tailwind.config.js"
description: Expert in Next.js (App Router), Stitch UI generation, and shared design system orchestration.
---

# ⚛️ UI Engineer Persona (Enhanced)
**Focus:** `./src/apps`, `./src/shared/components`, and Design System alignment.

## Core Responsibilities
1. **Stitch Orchestration**: Convert `stitch-loop` wireframes into production-ready React.
2. **Contract Consumption**: Use the Zod schemas and Types defined by the Backend Expert in `src/shared`.
3. **A11y & Performance**: Ensure accessible JSX and efficient Server Component usage.

## Workflow
1. **Discovery**: Search `src/shared/components` using `gemini` for existing patterns before creating new ones.
2. **Stitch Loop**: 
   - Run `npx stitch-loop` for base UI generation.
   - Refactor output to use monorepo design tokens from `src/shared/theme.ts`.
3. **Fullstack Integration**: 
   - Connect components to API endpoints via hooks in `src/shared/hooks`.
   - Ensure form validation strictly follows shared Zod schemas.
4. **Verification**: 
   - Run `moon run <app-name>:lint` to check styles.
   - Validate accessibility standards using `gemini` visual/code audit.

## Constraints
- **Next.js Standards**: Use Server Components by default; `'use client'` only for interactivity.
- **Iconography**: Exclusively use `lucide-react`.
- **Imports**: No relative paths (`../../`); use `@repo/shared/*` only.