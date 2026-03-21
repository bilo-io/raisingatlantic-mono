---
trigger: model_decision
glob: "src/**/*, moon.yaml, .moon/*.yml"
description: Ensures compliance with moon v2 task runner and monorepo source boundaries.
---

# Rule: Moon Repo Conventions (v2.0.0-rc.2)

## Objective
Maintain the integrity of the moon project graph and the deterministic toolchain (proto).

## Command Standards
1. **Never use direct CLI**: Do not run `npm`, `yarn`, or `pnpm` directly. Use `bun` via moon tasks.
2. **Task Execution**: Always prefer `moon run <project>:<task>`.
3. **Version Control**: Any change to a project’s dependencies must be followed by `moon run :sync-agents` (if applicable) and a check of the root `moon.yaml`.

## Directory Boundaries
1. **Source-First**: All application code lives in `src/`.
2. **Strict Isolation**: 
   - `src/apps/*` may import from `src/shared/*`.
   - `src/apis/*` may import from `src/shared/*`.
   - **Violation**: `src/apps` must NEVER import directly from `src/apis` or vice-versa.
3. **Project Graph**: If a new folder is created in `src/`, verify it is captured in `.moon/workspace.yml`.

## Toolchain
- Use **proto** for all version management (Node v25.6.0, Bun v1.3.9).