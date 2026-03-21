---
trigger: always_on
glob: "packages/ui/src/components/**/*.{ts,tsx}, apps/**/*.{ts,tsx}"
description: Enforces a single source of truth for UI components by requiring them to be built in the UI library and documented in the showcase first.
---

# Rule: Source of Truth for UI Components

## Objective
Prevent duplicate code and maintain a consistent design system by centralizing all UI components in the shared library.

## Standards
1. **Library First**: NEVER create core UI components (buttons, cards, inputs, complex widgets, etc.) directly within an application folder (`apps/dashboard` or `apps/website`).
2. **Component Path**: All shared components MUST be created in `packages/ui/src/components/`.
3. **Showcase Requirement**: Every new component MUST be added to the UI library's showcase app in `packages/ui/src/App.tsx`. 
    - Identify the most relevant category (e.g., FOUNDATION, CHARTS, AI, OPS) or create a new one.
    - Add a demonstration of the component with various states (hover, disabled, theme variations).
4. **App Integration**: Apps MUST import components from the shared library using the workspace alias `@clawesome/ui`. 
    - Do NOT copy-paste component code from the library into an app.
    - Ensure the component is exported from `packages/ui/src/index.ts` to make it available to apps.

## Workflow
1. Create the component in `packages/ui/src/components`.
2. Export the component in `packages/ui/src/index.ts`.
3. Add a demonstration in `packages/ui/src/App.tsx`.
4. Import and use the component in the target application (`apps/dashboard`, `apps/website`, etc.).

## Verification
1. Run `moon run ui:build` to ensure the library compiles.
2. Verify the component is visible in the UI showcase.
