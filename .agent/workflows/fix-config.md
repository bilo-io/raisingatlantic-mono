---
title: Fix Configuration
description: Repairs broken moon.yaml or workspace.yml files using Gemini CLI and moon v2 schema validation.
---
# Workflow: Fix Configuration
Trigger: `/fix-config`

1. **Schema Check**: 
   - Identify which config file is failing (e.g., `.moon/workspace.yml`).
   - Run `moon check` or `moon project <name>` to capture the exact validation error.
2. **Knowledge Retrieval**:
   - Use `gemini "Explain the current moonrepo v2.0.0-rc.2 schema for [filename]. Focus on deprecated fields like 'manager' vs 'client'."`
3. **Plan & Repair**:
   - Create a plan to fix the specific line numbers.
   - Apply the fix using the `moon-conventions.md` rules to ensure proper paths (e.g., ensuring `src/` is correctly globbed).
4. **Verification**:
   - Re-run `moon check`.
   - If it passes, run `moon run :validate` to ensure the Antigravity skills still recognize the project.
5. **Documentation**:
   - Summarize what was deprecated and what was updated so the user learns the v2 changes.